import type { InquiryForm, OrimetricsFetch } from "@sdk";

import { expect, test } from "bun:test";
import { createOrimetricsClient, validateInquirySubmission } from "@sdk";

import * as fixture from "../fixtures/inquiries";

const clientWith = (fetch: OrimetricsFetch) =>
  createOrimetricsClient({ baseUrl: "https://example.test", organizationSlug: "demo", fetch });
const OPTIONS = { idempotencyKey: fixture.INQUIRY_KEY } as const;

test.each(["disabled", "new-notice"] as const)(
  "current form %s does not block explicit recovery of an earlier operation",
  async (change) => {
    let posts = 0;
    const original = fixture.createInquiry();
    const initialForm = fixture.createInquiryForm();
    const changedForm: InquiryForm =
      change === "disabled"
        ? { enabled: false }
        : {
            ...initialForm,
            privacyNotice: { ...initialForm.privacyNotice, version: "new-version" },
          };
    const client = clientWith(async (request) => {
      if (request.method === "GET") {
        return Response.json(changedForm);
      }

      posts++;
      expect(request.headers.get("Idempotency-Key")).toBe(fixture.INQUIRY_KEY);
      expect(await request.json()).toEqual({
        ...original,
        turnstileToken: posts === 1 ? original.turnstileToken : "fresh-token",
      });

      if (posts === 1) {
        throw new Error("Response lost after dispatch");
      }

      // Model a server replay acknowledgment, not admission of a new inquiry.
      return Response.json({ accepted: true }, { status: 202 });
    });

    validateInquirySubmission(original, initialForm);
    await expect(client.inquiries.submit("listing", original, OPTIONS)).rejects.toMatchObject({
      kind: "network",
    });
    const current = await client.inquiries.getForm("listing");

    expect(() => validateInquirySubmission(original, current)).toThrow(TypeError);
    expect(
      await client.inquiries.submit(
        "listing",
        { ...original, turnstileToken: "fresh-token" },
        OPTIONS,
      ),
    ).toEqual({ accepted: true });
    expect(posts).toBe(2);
    expect(original).toEqual(fixture.createInquiry());
  },
);

test("new notice validation never rewrites consent or mutates the draft", () => {
  const draft = fixture.createInquiry();
  const form = fixture.createInquiryForm();
  const changed = { ...form, privacyNotice: { ...form.privacyNotice, version: "new-version" } };

  expect(() => validateInquirySubmission(draft, changed)).toThrow(TypeError);
  expect(draft).toEqual(fixture.createInquiry());
  // Updating the version is not a substitute for the visitor acknowledging the notice.
  expect(() => {
    const unacknowledged = { ...draft, privacyVersion: "new-version", privacyAcknowledged: false };

    // @ts-expect-error Exercise unacknowledged JavaScript form input.
    validateInquirySubmission(unacknowledged, changed);
  }).toThrow(TypeError);
  expect(changed.privacyNotice.version).toBe("new-version");
});

test("local rejection does not poison the client or silently dispatch later", async () => {
  let calls = 0;
  const client = clientWith(async () => {
    calls++;
    return Response.json({ accepted: true }, { status: 202 });
  });
  const draft = fixture.createInquiry();

  await expect(
    client.inquiries.submit("listing", { ...draft, turnstileToken: "" }, OPTIONS),
  ).rejects.toBeInstanceOf(TypeError);
  expect(calls).toBe(0);
  expect(await client.inquiries.submit("listing", draft, OPTIONS)).toEqual({ accepted: true });
  expect(calls).toBe(1);
});

test("concurrent submissions snapshot their input and do not share a client-side operation state", async () => {
  const requests: { request: Request; finish: (response: Response) => void }[] = [];
  const client = clientWith(
    (request) =>
      new Promise((finish) => {
        requests.push({ request, finish });
      }),
  );
  const draft = fixture.createInquiry();
  const original = fixture.createInquiry();
  const controller = new AbortController();
  const first = client.inquiries.submit("listing", draft, {
    ...OPTIONS,
    signal: controller.signal,
  });
  draft.customer.contacts.splice(0, 2, { kind: "phone", value: "+593991234567" });
  const secondKey = "d76d917d-d138-4291-a84e-98c2715bd8b3";
  const second = client.inquiries.submit("other-listing", draft, { idempotencyKey: secondKey });
  const firstRequest = requests[0];
  const secondRequest = requests[1];

  if (!firstRequest || !secondRequest) {
    throw new Error("Expected independent requests.");
  }

  expect(await firstRequest.request.json()).toEqual(original);
  expect(await secondRequest.request.json()).toEqual(draft);
  expect(firstRequest.request.headers.get("Idempotency-Key")).toBe(fixture.INQUIRY_KEY);
  expect(secondRequest.request.headers.get("Idempotency-Key")).toBe(secondKey);
  controller.abort();
  await expect(first).rejects.toMatchObject({ name: "AbortError" });
  expect(secondRequest.request.signal.aborted).toBe(false);
  secondRequest.finish(Response.json({ accepted: true }, { status: 202 }));
  expect(await second).toEqual({ accepted: true });
  firstRequest.finish(Response.json({ accepted: true }, { status: 202 }));
});
