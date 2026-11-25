import type { OrimetricsFetch } from "@sdk";

import { expect, test } from "bun:test";
import { createTransport } from "@shared/api/transport";
import { resolveOptions } from "@shared/configuration/resolve";

const setup = (fetch: OrimetricsFetch) =>
  createTransport(
    resolveOptions({ baseUrl: "https://example.test/prefix", organizationSlug: "demo", fetch }),
  );

test("arrays serialize as repeated query parameters and money retains decimal strings", async () => {
  let request: Request | undefined;
  const transport = setup(async (input) => {
    request = input;
    return Response.json({});
  });

  await transport.execute({
    send: ({ api, organizationSlug, signal }) =>
      api.GET("/public/o/{organizationSlug}/vehicles", {
        params: {
          path: { organizationSlug },
          query: { brand: ["toyota", "mazda"], priceMax: "25000.00", search: "café & SUV" },
        },
        signal,
      }),
    decode: () => undefined,
  });

  const url = new URL(request?.url ?? "");

  expect(url.searchParams.getAll("brand")).toEqual(["toyota", "mazda"]);
  expect(url.searchParams.get("priceMax")).toBe("25000.00");
  expect(url.searchParams.get("search")).toBe("café & SUV");
});

test("POST preserves explicit idempotency keys and makes no retries", async () => {
  const requests: Request[] = [];
  const transport = setup(async (request) => {
    requests.push(request);
    return Response.json({ code: "conflict" }, { status: 409 });
  });

  await expect(
    transport.execute({
      send: ({ api, organizationSlug, signal }) =>
        api.POST("/public/o/{organizationSlug}/vehicles/{listingSlug}/interest-requests", {
          params: {
            path: { organizationSlug, listingSlug: "vehicle" },
            header: { "Idempotency-Key": "12345678-1234-1234-1234-123456789abc" },
          },
          body: {
            customer: {
              displayName: "Demo",
              contacts: [{ kind: "email", value: "demo@example.test" }],
            },
            privacyVersion: "v1",
            privacyAcknowledged: true,
            turnstileToken: "challenge",
          },
          signal,
        }),
      decode: () => undefined,
    }),
  ).rejects.toMatchObject({ kind: "http", status: 409 });
  expect(requests).toHaveLength(1);
  expect(requests[0]?.headers.get("Idempotency-Key")).toBe("12345678-1234-1234-1234-123456789abc");
  expect(await requests[0]?.json()).toMatchObject({
    turnstileToken: "challenge",
    privacyVersion: "v1",
  });
});

test("completion token is allowed only on scoped photo completion", async () => {
  const requests: Request[] = [];
  const inits: RequestInit[] = [];
  const transport = setup(async (request, init) => {
    requests.push(request);
    inits.push(init);

    return Response.json({ accepted: true });
  });

  await transport.execute({
    send: ({ api, organizationSlug, signal }) =>
      api.POST(
        "/public/o/{organizationSlug}/d/{dealershipSlug}/appraisal-requests/{requestReference}/photos/{photoSlug}/complete",
        {
          params: {
            path: {
              organizationSlug,
              dealershipSlug: "main",
              requestReference: "apr-example",
              photoSlug: "front",
            },
            header: { Authorization: "Bearer scoped-token" },
          },
          signal,
        },
      ),
    decode: () => undefined,
  });
  expect(requests[0]?.headers.get("Authorization")).toBe("Bearer scoped-token");
  expect(inits[0]?.credentials).toBe("omit");
  await expect(
    transport.execute({
      send: ({ api, organizationSlug, signal }) =>
        api.GET("/public/o/{organizationSlug}/profile", {
          params: { path: { organizationSlug } },
          headers: { Authorization: "Bearer private-token" },
          signal,
        }),
      decode: () => undefined,
    }),
  ).rejects.toThrow("Credentials are not allowed");
  expect(requests).toHaveLength(1);
});

test("rejects a different tenant before fetch", async () => {
  let calls = 0;
  const transport = setup(async () => {
    calls += 1;
    return Response.json({});
  });

  await expect(
    transport.execute({
      send: ({ api, signal }) =>
        api.GET("/public/o/{organizationSlug}/profile", {
          params: { path: { organizationSlug: "other" } },
          signal,
        }),
      decode: () => undefined,
    }),
  ).rejects.toThrow("organization scope");
  expect(calls).toBe(0);
});

test("binary and no-content operations can select appropriate decoders", async () => {
  const binary = setup(
    async () =>
      new Response(new Uint8Array([1, 2, 3]), { headers: { "content-type": "image/webp" } }),
  );
  const bytes = await binary.execute({
    send: ({ api, organizationSlug, signal }) =>
      api.GET("/public/o/{organizationSlug}/branding/logo", {
        params: { path: { organizationSlug } },
        signal,
        parseAs: "arrayBuffer",
      }),
    responseType: "binary",
    decode: (value) => {
      if (!(value instanceof ArrayBuffer)) {
        throw new Error("Invalid bytes");
      }
      return value;
    },
  });

  expect(new Uint8Array(bytes)).toEqual(new Uint8Array([1, 2, 3]));

  const empty = setup(async () => new Response(null, { status: 204 }));

  expect(
    await empty.execute({
      send: ({ api, organizationSlug, signal }) =>
        api.GET("/public/o/{organizationSlug}/profile", {
          params: { path: { organizationSlug } },
          signal,
        }),
      decode: (value) => value,
    }),
  ).toBeUndefined();
});
