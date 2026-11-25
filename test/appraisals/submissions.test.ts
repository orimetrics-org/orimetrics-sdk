import type { AppraisalSubmission, AppraisalForm, AppraisalReceipt, OrimetricsFetch } from "@sdk";

import { expect, test } from "bun:test";
import { createOrimetricsClient, validateAppraisalSubmission } from "@sdk";
import { INQUIRY_KEY } from "../fixtures/inquiries";

import * as fixture from "../fixtures/appraisals";

const clientWith = (fetch: OrimetricsFetch) =>
  createOrimetricsClient({ baseUrl: "https://api.example/v1", organizationSlug: "demo", fetch });
const options = { idempotencyKey: INQUIRY_KEY };

test("retrieves enabled/disabled forms with photo policy and nullable privacy fields", async () => {
  const forms: AppraisalForm[] = [
    fixture.createAppraisalForm(),
    { enabled: false as const },
    {
      ...fixture.createAppraisalForm(),
      privacyNotice: { url: null, version: null },
      photos: { enabled: false as const, contentTypes: ["image/jpeg" as const] },
    },
  ];
  let index = 0;
  const client = clientWith(async (request, init) => {
    expect(request.url).toBe(
      "https://api.example/v1/public/o/demo/d/north/appraisal-requests/form",
    );
    expect(init.credentials).toBe("omit");

    return Response.json(forms[index++]);
  });

  for (const form of forms) {
    expect(await client.appraisals.getForm("north")).toEqual(form);
  }
});

test("submits exact customer/vehicle/photo metadata and preserves receipt states", async () => {
  const submission = { ...fixture.createAppraisal(), photos: [fixture.createPhotoInput()] };
  const receipt: AppraisalReceipt = {
    accepted: true,
    reference: "apr-receipt",
    photos: [
      fixture.createPhoto(),
      ...(["upload_closed", "temporarily_unavailable", "completion_accepted"] as const).map(
        (state) => ({
          slug: state,
          state,
          upload: null,
        }),
      ),
    ],
  };
  const client = clientWith(async (request, init) => {
    expect(request.method).toBe("POST");
    expect(request.headers.get("Idempotency-Key")).toBe(INQUIRY_KEY);
    expect(request.headers.has("authorization")).toBe(false);
    expect(init.credentials).toBe("omit");
    expect(await request.json()).toEqual(submission);

    return Response.json(receipt, { status: 202 });
  });

  expect(await client.appraisals.submit("north", submission, options)).toEqual(receipt);
});

test("no-photo submissions preserve omission and manual retries retain key and business data", async () => {
  const submission = fixture.createAppraisal();
  let calls = 0;
  const client = clientWith(async (request) => {
    calls++;
    expect(request.headers.get("Idempotency-Key")).toBe(INQUIRY_KEY);
    expect(await request.json()).toEqual({
      ...submission,
      turnstileToken: calls === 1 ? submission.turnstileToken : "fresh",
    });

    if (calls === 1) {
      throw new Error("private data");
    }

    return Response.json({ accepted: true, reference: "apr-receipt", photos: [] }, { status: 202 });
  });

  await expect(client.appraisals.submit("north", submission, options)).rejects.toMatchObject({
    kind: "network",
  });
  expect(calls).toBe(1);
  expect(
    await client.appraisals.submit("north", { ...submission, turnstileToken: "fresh" }, options),
  ).toEqual({ accepted: true, reference: "apr-receipt", photos: [] });
});

test.each([404, 409, 422, 429, 503])(
  "safe appraisal HTTP %s errors never retry",
  async (status) => {
    let calls = 0;
    const client = clientWith(async () => {
      calls++;
      return Response.json(
        { code: "APPRAISAL_REJECTED", detail: "secret" },
        { status, headers: { "Retry-After": "3" } },
      );
    });

    await expect(
      client.appraisals.submit("north", fixture.createAppraisal(), options),
    ).rejects.toMatchObject({ kind: "http", status, retryAfterMs: 3000 });
    expect(calls).toBe(1);
  },
);

test.each([
  { enabled: true as const },
  { ...fixture.createAppraisalForm(), photos: { enabled: true as const } },
  { enabled: false as const, company: {} },
])("malformed forms reject", async (body) => {
  await expect(
    clientWith(async () => Response.json(body)).appraisals.getForm("north"),
  ).rejects.toMatchObject({ kind: "protocol" });
});

test.each([
  { accepted: true },
  { accepted: false, reference: "apr-receipt", photos: [] },
  {
    accepted: true,
    reference: "apr-receipt",
    photos: [{ slug: "front", state: "upload_available", upload: null }],
  },
  {
    accepted: true,
    reference: "apr-receipt",
    photos: [{ slug: "front", state: "unknown", upload: null }],
  },
])("malformed receipts reject", async (body) => {
  await expect(
    clientWith(async () => Response.json(body)).appraisals.submit(
      "north",
      fixture.createAppraisal(),
      options,
    ),
  ).rejects.toMatchObject({ kind: "protocol" });
});

test.each([
  { modelYear: 1800 },
  { modelYear: 2020.5 },
  { expectedPriceUsd: "0.00" },
  { expectedPriceUsd: 15000 },
  { expectedPriceUsd: "1.001" },
  { odometerUnit: null },
  { odometerValue: -1 },
  { submittedBrand: "" },
  { brandId: "private-id" },
])("invalid vehicle facts fail before I/O", async (changes) => {
  let calls = 0;
  const client = clientWith(async () => {
    calls++;
    return Response.json({});
  });
  const submission = fixture.createAppraisal();

  await expect(
    client.appraisals.submit(
      "north",
      { ...submission, vehicle: { ...submission.vehicle, ...changes } } as AppraisalSubmission,
      options,
    ),
  ).rejects.toBeInstanceOf(TypeError);
  expect(calls).toBe(0);
});

test("validates current consent and limits without mutating or valuing the vehicle", () => {
  const submission = fixture.createAppraisal();
  const form = fixture.createAppraisalForm();

  expect(() => validateAppraisalSubmission(submission, form)).not.toThrow();
  expect(submission).toEqual(fixture.createAppraisal());
  expect(() => validateAppraisalSubmission(submission, { enabled: false as const })).toThrow(
    TypeError,
  );
  expect(() =>
    validateAppraisalSubmission(submission, {
      ...form,
      privacyNotice: { url: null, version: null },
    }),
  ).toThrow(TypeError);
  expect(() => validateAppraisalSubmission({ ...submission, privacyVersion: "old" }, form)).toThrow(
    TypeError,
  );
  expect(() =>
    validateAppraisalSubmission(submission, {
      ...form,
      limits: { ...form.limits, nameMaxCharacters: 1 },
    }),
  ).toThrow(TypeError);
  const withPhoto = { ...submission, photos: [fixture.createPhotoInput()] };

  expect(() =>
    validateAppraisalSubmission(withPhoto, {
      ...form,
      photos: { enabled: false as const, contentTypes: [] },
    }),
  ).toThrow(TypeError);
  expect(() =>
    validateAppraisalSubmission(withPhoto, {
      ...form,
      photos: {
        enabled: true as const,
        maxPhotos: 1,
        maxUploadBytes: 2,
        uploadSeconds: 30,
        contentTypes: ["image/jpeg" as const],
      },
    }),
  ).toThrow(TypeError);
  expect(() =>
    validateAppraisalSubmission(withPhoto, {
      ...form,
      photos: {
        enabled: true as const,
        maxPhotos: 1,
        maxUploadBytes: 10,
        uploadSeconds: 30,
        contentTypes: ["image/png" as const],
      },
    }),
  ).toThrow(TypeError);
});

test("requires an explicit key and supports cancellation/deadlines", async () => {
  let calls = 0;
  const client = clientWith(() => {
    calls++;
    return new Promise(() => {});
  });

  // @ts-expect-error required key must also be enforced at runtime.
  await expect(client.appraisals.submit("north", fixture.createAppraisal())).rejects.toBeInstanceOf(
    TypeError,
  );
  await expect(
    client.appraisals.submit("north", fixture.createAppraisal(), {
      ...options,
      signal: AbortSignal.abort(),
    }),
  ).rejects.toMatchObject({ name: "AbortError" });
  expect(calls).toBe(0);
  await expect(
    client.appraisals.submit("north", fixture.createAppraisal(), { ...options, timeoutMs: 5 }),
  ).rejects.toMatchObject({ kind: "timeout" });
  expect(calls).toBe(1);
});
