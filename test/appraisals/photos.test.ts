import type { AppraisalPhoto, OrimetricsFetch } from "@sdk";

import { expect, test } from "bun:test";
import { createOrimetricsClient } from "@sdk";

import * as fixture from "../fixtures/appraisals";

const clientWith = (fetch: OrimetricsFetch) =>
  createOrimetricsClient({ baseUrl: "https://api.example/v1", organizationSlug: "demo", fetch });
const file = new Blob(["abc"], { type: "image/jpeg" });

test("uploads raw bytes with signed headers, then completes only at the scoped API endpoint", async () => {
  let calls = 0;
  const photo = fixture.createPhoto();
  const client = clientWith(async (request, init) => {
    calls++;
    expect(init.credentials).toBe("omit");
    expect(init.redirect).toBe("error");

    if (calls === 1) {
      expect(request.method).toBe("PUT");
      expect(request.url).toBe(photo.upload.url);
      expect(request.headers.get("content-type")).toBe("image/jpeg");
      expect(request.headers.get("if-none-match")).toBe("*");
      expect(request.headers.has("authorization")).toBe(false);
      expect(new Headers(init.headers).has("content-length")).toBe(false);
      expect(await request.text()).toBe("abc");

      return new Response(null, { status: 200 });
    }

    expect(request.method).toBe("POST");
    expect(request.url).toBe(
      "https://api.example/v1/public/o/demo/d/north/appraisal-requests/apr-receipt/photos/front/complete",
    );
    expect(request.headers.get("authorization")).toBe(`Bearer ${photo.upload.completionToken}`);
    expect(request.url).not.toContain(photo.upload.completionToken);
    expect(await request.text()).toBe("");

    return Response.json({ accepted: true }, { status: 202 });
  });

  await client.appraisals.uploadPhoto(photo, file, fixture.createPhotoInput());
  expect(calls).toBe(1);
  expect(await client.appraisals.completePhoto("north", "apr-receipt", photo)).toEqual({
    accepted: true,
  });
  expect(await client.appraisals.completePhoto("north", "apr-receipt", photo)).toEqual({
    accepted: true,
  });
});

test.each(["upload_closed", "temporarily_unavailable", "completion_accepted"] as const)(
  "does not upload or complete photo in %s state",
  async (state) => {
    const photo: AppraisalPhoto = { slug: "front", state, upload: null };
    const client = clientWith(async () => {
      throw new Error("unexpected request");
    });

    await expect(
      client.appraisals.uploadPhoto(photo, file, fixture.createPhotoInput()),
    ).rejects.toBeInstanceOf(TypeError);
    await expect(
      client.appraisals.completePhoto("north", "apr-receipt", photo),
    ).rejects.toBeInstanceOf(TypeError);
  },
);

test.each([
  { method: "GET" as const },
  { url: "http://storage.example/photo" },
  { url: "https://user:secret@storage.example/photo" },
  { url: "bad-url" },
  { expiresAt: "2000-01-01T00:00:00Z" },
  {
    headers: { "Content-Type": "image/jpeg", "If-None-Match": "*", Authorization: "Bearer secret" },
  },
  { headers: { "Content-Type": "image/png", "If-None-Match": "*" } },
])("rejects invalid upload instructions before dispatch", async (changes) => {
  const original = fixture.createPhoto();
  let calls = 0;
  const client = clientWith(async () => {
    calls++;
    return new Response(null);
  });

  await expect(
    client.appraisals.uploadPhoto(
      { ...original, upload: { ...original.upload, ...changes } },
      file,
      fixture.createPhotoInput(),
    ),
  ).rejects.toBeInstanceOf(TypeError);
  expect(calls).toBe(0);
});

test("enforces declared byte size and MIME type", async () => {
  const client = clientWith(async () => {
    throw new Error("unexpected request");
  });

  await expect(
    client.appraisals.uploadPhoto(
      fixture.createPhoto(),
      new Blob(["abcd"], { type: "image/jpeg" }),
      fixture.createPhotoInput(),
    ),
  ).rejects.toBeInstanceOf(TypeError);
  await expect(
    client.appraisals.uploadPhoto(
      fixture.createPhoto(),
      new Blob(["abc"], { type: "image/png" }),
      fixture.createPhotoInput(),
    ),
  ).rejects.toBeInstanceOf(TypeError);
});

test.each([
  "https://evil.example/complete",
  "/public/o/other/d/north/appraisal-requests/apr-receipt/photos/front/complete",
  "/public/o/demo/d/other/appraisal-requests/apr-receipt/photos/front/complete",
  "/public/o/demo/d/north/appraisal-requests/other/photos/front/complete",
  "/public/o/demo/d/north/appraisal-requests/apr-receipt/photos/other/complete",
])("rejects completion target outside exact receipt scope", async (completePath) => {
  const photo = fixture.createPhoto();
  let calls = 0;
  const client = clientWith(async () => {
    calls++;
    return Response.json({ accepted: true });
  });

  await expect(
    client.appraisals.completePhoto("north", "apr-receipt", {
      ...photo,
      upload: { ...photo.upload, completePath },
    }),
  ).rejects.toBeInstanceOf(TypeError);
  expect(calls).toBe(0);
});

test("storage failures expose only safe status and never auto-complete or retry", async () => {
  let calls = 0;
  const client = clientWith(async () => {
    calls++;
    return new Response("signature=secret", { status: 412 });
  });

  await expect(
    client.appraisals.uploadPhoto(fixture.createPhoto(), file, fixture.createPhotoInput()),
  ).rejects.toMatchObject({ kind: "http", status: 412 });
  expect(calls).toBe(1);
});

test("upload deadlines and caller abort work even if fetch ignores the signal", async () => {
  let calls = 0;
  const client = clientWith(() => {
    calls++;
    return new Promise(() => {});
  });

  await expect(
    client.appraisals.uploadPhoto(fixture.createPhoto(), file, fixture.createPhotoInput(), {
      signal: AbortSignal.abort(),
    }),
  ).rejects.toMatchObject({ name: "AbortError" });
  expect(calls).toBe(0);
  await expect(
    client.appraisals.uploadPhoto(fixture.createPhoto(), file, fixture.createPhotoInput(), {
      timeoutMs: 5,
    }),
  ).rejects.toMatchObject({ kind: "timeout" });
  expect(calls).toBe(1);
});

test("completion validates expiry and response acknowledgment", async () => {
  const photo = fixture.createPhoto();
  const client = clientWith(async () => Response.json({ accepted: false }, { status: 202 }));

  await expect(
    client.appraisals.completePhoto("north", "apr-receipt", {
      ...photo,
      upload: { ...photo.upload, completionExpiresAt: "2000-01-01T00:00:00Z" },
    }),
  ).rejects.toBeInstanceOf(TypeError);
  await expect(
    client.appraisals.completePhoto("north", "apr-receipt", photo),
  ).rejects.toMatchObject({ kind: "protocol" });
});
