import type { InquirySubmission, OrimetricsFetch } from "@sdk";

import { expect, test } from "bun:test";
import { createOrimetricsClient, validateInquirySubmission } from "@sdk";

import * as fixture from "../fixtures/inquiries";

const clientWith = (fetch: OrimetricsFetch) =>
  createOrimetricsClient({ baseUrl: "https://api.example/v1", organizationSlug: "demo", fetch });
const options = { idempotencyKey: fixture.INQUIRY_KEY };

test("retrieves current enabled/disabled form configuration without caching", async () => {
  let calls = 0;
  const form = fixture.createInquiryForm();
  const client = clientWith(async (request, init) => {
    calls++;
    expect(request.method).toBe("GET");
    expect(new URL(request.url).pathname).toBe(
      "/v1/public/o/demo/vehicles/caf%C3%A9/interest-requests/form",
    );
    expect(init.credentials).toBe("omit");
    expect(init.cache).toBe("no-store");

    return Response.json(calls === 1 ? form : { enabled: false });
  });

  expect(await client.inquiries.getForm("café")).toEqual(form);
  expect(await client.inquiries.getForm("café")).toEqual({ enabled: false });
  expect(calls).toBe(2);
});

test("submits exact input and caller key; receipt reveals only acceptance", async () => {
  const submission = fixture.createInquiry();
  let calls = 0;
  const client = clientWith(async (request, init) => {
    calls++;
    expect(request.method).toBe("POST");
    expect(request.url).toBe(
      "https://api.example/v1/public/o/demo/vehicles/listing/interest-requests",
    );
    expect(request.headers.get("Idempotency-Key")).toBe(fixture.INQUIRY_KEY);
    expect(request.headers.has("authorization")).toBe(false);
    expect(request.headers.has("cookie")).toBe(false);
    expect(init.credentials).toBe("omit");
    expect(await request.json()).toEqual(submission);

    return Response.json({ accepted: true, internalReference: "do-not-expose" }, { status: 202 });
  });

  expect(await client.inquiries.submit("listing", submission, options)).toEqual({ accepted: true });
  expect(calls).toBe(1);
  expect(submission).toEqual(fixture.createInquiry());
});

test("preserves null versus omitted optional fields", async () => {
  const customer = {
    displayName: "Visitor",
    contacts: [{ kind: "email" as const, value: "visitor@example.com" }],
  };
  const { message: _message, ...base } = fixture.createInquiry();
  const bodies: unknown[] = [];
  const client = clientWith(async (request) => {
    bodies.push(await request.json());

    return Response.json({ accepted: true }, { status: 202 });
  });

  await client.inquiries.submit("listing", { ...base, customer }, options);
  await client.inquiries.submit(
    "listing",
    { ...base, customer: { ...customer, preferredContactChannel: null }, message: null },
    options,
  );
  expect(bodies).toEqual([
    { ...base, customer },
    { ...base, customer: { ...customer, preferredContactChannel: null }, message: null },
  ]);
});

test("uncertain outcomes never retry automatically; manual retry retains key and refreshes token", async () => {
  const requests: { key: string | null; body: unknown }[] = [];
  const client = clientWith(async (request) => {
    requests.push({ key: request.headers.get("Idempotency-Key"), body: await request.json() });

    if (requests.length === 1) {
      throw new Error("Secret contact details");
    }

    return Response.json({ accepted: true }, { status: 202 });
  });
  const submission = fixture.createInquiry();

  await expect(client.inquiries.submit("listing", submission, options)).rejects.toMatchObject({
    kind: "network",
  });
  expect(requests).toHaveLength(1);
  expect(
    await client.inquiries.submit(
      "listing",
      { ...submission, turnstileToken: "fresh-token" },
      options,
    ),
  ).toEqual({ accepted: true });
  expect(requests).toEqual([
    { key: fixture.INQUIRY_KEY, body: submission },
    { key: fixture.INQUIRY_KEY, body: { ...submission, turnstileToken: "fresh-token" } },
  ]);
});

test.each([404, 409, 422, 429, 503])(
  "preserves HTTP %s diagnostics without exposing input or retrying",
  async (status) => {
    let calls = 0;
    const client = clientWith(async () => {
      calls++;

      return Response.json(
        { code: "INQUIRY_REJECTED", detail: "private-contact-and-token" },
        { status, headers: { "Retry-After": "2", "X-Request-ID": "inquiry-123" } },
      );
    });

    try {
      await client.inquiries.submit("listing", fixture.createInquiry(), options);
      throw new Error("Expected failure");
    } catch (error) {
      expect(error).toMatchObject({
        kind: "http",
        status,
        code: "INQUIRY_REJECTED",
        requestId: "inquiry-123",
        retryAfterMs: 2000,
      });
      expect(String(error)).not.toContain("private-contact-and-token");
    }

    expect(calls).toBe(1);
  },
);

test.each([
  { enabled: true },
  { enabled: "false" },
  { enabled: false, limits: {} },
  {
    ...fixture.createInquiryForm(),
    limits: { nameMaxCharacters: -1, messageMaxCharacters: 10, maxPhones: 1, maxEmails: 1 },
  },
])("rejects malformed form responses", async (form) => {
  await expect(
    clientWith(async () => Response.json(form)).inquiries.getForm("listing"),
  ).rejects.toMatchObject({ kind: "protocol" });
});

test.each([{ accepted: false }, {}, { accepted: "true" }])(
  "rejects malformed receipts",
  async (receipt) => {
    await expect(
      clientWith(async () => Response.json(receipt, { status: 202 })).inquiries.submit(
        "listing",
        fixture.createInquiry(),
        options,
      ),
    ).rejects.toMatchObject({ kind: "protocol" });
  },
);

test("cancellation and deadlines apply to inquiry reads and writes", async () => {
  let calls = 0;
  const client = clientWith(() => {
    calls++;
    return new Promise(() => {});
  });

  await expect(
    client.inquiries.submit("listing", fixture.createInquiry(), {
      ...options,
      signal: AbortSignal.abort(),
    }),
  ).rejects.toMatchObject({ name: "AbortError" });
  expect(calls).toBe(0);
  await expect(client.inquiries.getForm("listing", { timeoutMs: 5 })).rejects.toMatchObject({
    kind: "timeout",
  });
  await expect(
    client.inquiries.submit("listing", fixture.createInquiry(), { ...options, timeoutMs: 5 }),
  ).rejects.toMatchObject({ kind: "timeout" });
  expect(calls).toBe(2);
});

test("bad slugs and missing/invalid operation keys never dispatch", async () => {
  let calls = 0;
  const client = clientWith(async () => {
    calls++;
    return Response.json({ accepted: true });
  });

  await expect(client.inquiries.getForm("../listing")).rejects.toBeInstanceOf(TypeError);
  await expect(
    client.inquiries.submit("%2e%2e", fixture.createInquiry(), options),
  ).rejects.toBeInstanceOf(TypeError);
  await expect(
    client.inquiries.submit("listing", fixture.createInquiry(), { idempotencyKey: "bad-key" }),
  ).rejects.toBeInstanceOf(TypeError);
  // @ts-expect-error JavaScript consumers must also provide the key.
  await expect(client.inquiries.submit("listing", fixture.createInquiry())).rejects.toBeInstanceOf(
    TypeError,
  );
  expect(calls).toBe(0);
});

test.each([
  { ...fixture.createInquiry(), privacyAcknowledged: false },
  { ...fixture.createInquiry(), privacyVersion: "" },
  { ...fixture.createInquiry(), turnstileToken: "" },
  { ...fixture.createInquiry(), turnstileToken: "a".repeat(2049) },
  { ...fixture.createInquiry(), customer: { displayName: "Visitor", contacts: [] } },
  {
    ...fixture.createInquiry(),
    customer: { displayName: "Visitor", contacts: [{ kind: "phone", value: "0991234567" }] },
  },
  {
    ...fixture.createInquiry(),
    customer: {
      displayName: "Visitor",
      contacts: [{ kind: "email", value: "x@example.com" }],
      preferredContactChannel: "whatsapp",
    },
  },
  {
    ...fixture.createInquiry(),
    customer: {
      displayName: "Visitor",
      contacts: [
        { kind: "email", value: "x@example.com" },
        { kind: "email", value: "y@example.com" },
      ],
    },
  },
])("invalid JavaScript submissions fail safely before I/O", async (input) => {
  let calls = 0;
  const client = clientWith(async () => {
    calls++;
    return Response.json({ accepted: true });
  });

  // Simulate untyped browser input at the public boundary.
  await expect(
    client.inquiries.submit("listing", input as InquirySubmission, options),
  ).rejects.toBeInstanceOf(TypeError);
  expect(calls).toBe(0);
});

test("pure validation uses current limits and version, with no data normalization", () => {
  const submission = fixture.createInquiry();
  const form = fixture.createInquiryForm();

  expect(() => validateInquirySubmission(submission, form)).not.toThrow();
  expect(submission).toEqual(fixture.createInquiry());
  expect(() => validateInquirySubmission(submission, { enabled: false })).toThrow(TypeError);
  expect(() => validateInquirySubmission({ ...submission, privacyVersion: "old" }, form)).toThrow(
    TypeError,
  );

  for (const limits of [
    { ...form.limits, nameMaxCharacters: 1 },
    { ...form.limits, messageMaxCharacters: 1 },
    { ...form.limits, maxPhones: 0 },
    { ...form.limits, maxEmails: 0 },
  ]) {
    expect(() => validateInquirySubmission(submission, { ...form, limits })).toThrow(TypeError);
  }
});
