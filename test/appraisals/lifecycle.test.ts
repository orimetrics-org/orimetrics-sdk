import type { AppraisalPhoto, OrimetricsFetch } from "@sdk";

import { expect, test } from "bun:test";
import { createOrimetricsClient, validateAppraisalSubmission } from "@sdk";
import { INQUIRY_KEY } from "../fixtures/inquiries";

import * as fixture from "../fixtures/appraisals";

const clientWith = (fetch: OrimetricsFetch) =>
  createOrimetricsClient({ baseUrl: "https://api.example", organizationSlug: "demo", fetch });
const FILE = new Blob(["abc"], { type: "image/jpeg" });
const OPTIONS = { idempotencyKey: INQUIRY_KEY } as const;

test.each([200, 412])(
  "storage status %s settles without waiting for unused body cleanup",
  async (status) => {
    let cancelled = false;
    const response = new Response(
      new ReadableStream({
        cancel() {
          cancelled = true;
          return new Promise(() => {});
        },
      }),
      { status },
    );
    const client = clientWith(async () => response);
    const pending = client.appraisals.uploadPhoto(
      fixture.createPhoto(),
      FILE,
      fixture.createPhotoInput(),
      { timeoutMs: 20 },
    );

    if (status === 200) {
      await expect(pending).resolves.toBeUndefined();
    } else {
      await expect(pending).rejects.toMatchObject({ kind: "http", status: 412 });
    }

    expect(cancelled).toBe(true);
  },
);

test("acceptance survives an upload failure and completion remains an explicit recoverable step", async () => {
  const photo = fixture.createPhoto();
  const receipt = { accepted: true as const, reference: "apr-receipt", photos: [photo] };
  const methods: string[] = [];
  let completions = 0;
  const client = clientWith(async (request) => {
    methods.push(`${request.method} ${new URL(request.url).pathname}`);

    if (request.method === "PUT") {
      return new Response("write already exists", { status: 412 });
    }

    if (request.url.endsWith("/complete")) {
      completions++;

      if (completions === 1) {
        throw new Error("Completion response lost");
      }

      return Response.json({ accepted: true }, { status: 202 });
    }

    return Response.json(receipt, { status: 202 });
  });
  const accepted = await client.appraisals.submit(
    "north",
    { ...fixture.createAppraisal(), photos: [fixture.createPhotoInput()] },
    OPTIONS,
  );

  await expect(
    client.appraisals.uploadPhoto(photo, FILE, fixture.createPhotoInput()),
  ).rejects.toMatchObject({ kind: "http", status: 412 });
  expect(methods).toHaveLength(2);
  expect(accepted).toEqual(receipt);
  await expect(
    client.appraisals.completePhoto("north", accepted.reference, photo),
  ).rejects.toMatchObject({ kind: "network" });
  expect(methods).toHaveLength(3);
  expect(await client.appraisals.completePhoto("north", accepted.reference, photo)).toEqual({
    accepted: true,
  });
  expect(methods).toHaveLength(4);
  expect(accepted).toEqual(receipt);
  expect(photo.state).toBe("upload_available");
});

test("receipt recovery can change photo state without changing acceptance or mutating prior snapshots", async () => {
  const available = fixture.createPhoto();
  const states: AppraisalPhoto[] = [
    { slug: available.slug, state: "temporarily_unavailable", upload: null },
    available,
    { slug: available.slug, state: "completion_accepted", upload: null },
    { slug: available.slug, state: "upload_closed", upload: null },
  ];
  let calls = 0;
  const submission = { ...fixture.createAppraisal(), photos: [fixture.createPhotoInput()] };
  const client = clientWith(async (request) => {
    expect(request.headers.get("Idempotency-Key")).toBe(INQUIRY_KEY);
    expect(await request.json()).toEqual(submission);

    return Response.json(
      { accepted: true, reference: "apr-receipt", photos: [states[calls++]] },
      { status: 202 },
    );
  });
  const original = await client.appraisals.submit("north", submission, OPTIONS);

  for (const state of states.slice(1)) {
    const replay = await client.appraisals.submit("north", submission, OPTIONS);

    expect(replay.accepted).toBe(true);
    expect(replay.reference).toBe(original.reference);
    expect(replay.photos).toEqual([state]);
    expect(original.photos).toEqual(states.slice(0, 1));
  }
});

test("closed admission blocks new-form validation but not explicit replay of an uncertain operation", async () => {
  const submission = fixture.createAppraisal();
  let posts = 0;
  const client = clientWith(async (request) => {
    if (request.method === "GET") {
      return Response.json({ enabled: false });
    }

    posts++;
    expect(request.headers.get("Idempotency-Key")).toBe(INQUIRY_KEY);
    expect(await request.json()).toEqual(submission);

    if (posts === 1) {
      throw new Error("Lost response");
    }

    return Response.json({ accepted: true, reference: "apr-receipt", photos: [] }, { status: 202 });
  });

  await expect(client.appraisals.submit("north", submission, OPTIONS)).rejects.toMatchObject({
    kind: "network",
  });
  const current = await client.appraisals.getForm("north");

  expect(() => validateAppraisalSubmission(submission, current)).toThrow(TypeError);
  expect(await client.appraisals.submit("north", submission, OPTIONS)).toEqual({
    accepted: true,
    reference: "apr-receipt",
    photos: [],
  });
  expect(posts).toBe(2);
});

test("completion uses its own expiry instead of requiring another valid PUT", async () => {
  const original = fixture.createPhoto();
  const photo = { ...original, upload: { ...original.upload, expiresAt: "2000-01-01T00:00:00Z" } };
  let calls = 0;
  const client = clientWith(async (request) => {
    calls++;
    expect(request.method).toBe("POST");

    return Response.json({ accepted: true }, { status: 202 });
  });

  await expect(
    client.appraisals.uploadPhoto(photo, FILE, fixture.createPhotoInput()),
  ).rejects.toBeInstanceOf(TypeError);
  expect(calls).toBe(0);
  expect(await client.appraisals.completePhoto("north", "apr-receipt", photo)).toEqual({
    accepted: true,
  });
  expect(calls).toBe(1);
});
