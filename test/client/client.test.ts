import { expect, test } from "bun:test";
import { createOrimetricsClient, OrimetricsError } from "@sdk";
import { createProfile } from "../fixtures/profile";

test("construction is inert, configuration is copied, and instances stay scoped", async () => {
  const requests: Request[] = [];
  const inits: RequestInit[] = [];
  const options = {
    baseUrl: "https://example.test/api/",
    organizationSlug: "demo",
    fetch: async (request: Request, init: RequestInit) => {
      requests.push(request);
      inits.push(init);

      return Response.json(createProfile());
    },
  };
  const first = createOrimetricsClient(options);

  options.organizationSlug = "second";

  const second = createOrimetricsClient(options);

  expect(requests).toHaveLength(0);
  expect(Object.isFrozen(first)).toBe(true);
  expect(Object.isFrozen(first.organization)).toBe(true);
  await Promise.all([
    first.organization.getProfile({ limit: 10, offset: 20 }),
    second.organization.getProfile(),
  ]);
  expect(requests.map((request) => request.url)).toEqual([
    "https://example.test/api/public/o/demo/profile?limit=10&offset=20",
    "https://example.test/api/public/o/second/profile",
  ]);
  expect(
    inits.every(
      (init) =>
        init.credentials === "omit" && init.cache === "no-store" && init.redirect === "error",
    ),
  ).toBe(true);
});

test.each([
  "ftp://example.test",
  "https://user:password@example.test",
  "https://example.test?x=y",
  "https://example.test#fragment",
  "/relative",
])("rejects invalid base URL %s", (baseUrl) => {
  expect(() => createOrimetricsClient({ baseUrl, organizationSlug: "demo" })).toThrow();
});

test.each(["", ".", "..", "a/b", "a\\b", "a%2fb", " demo", "a?b"])(
  "rejects invalid organization segment %s",
  (organizationSlug) => {
    expect(() =>
      createOrimetricsClient({ baseUrl: "https://example.test", organizationSlug }),
    ).toThrow(TypeError);
  },
);

test.each([0, -1, Infinity, NaN, 1.5, 2147483648])("rejects invalid deadline %s", (timeoutMs) => {
  expect(() =>
    createOrimetricsClient({
      baseUrl: "https://example.test",
      organizationSlug: "demo",
      timeoutMs,
    }),
  ).toThrow(TypeError);
});

test("profile preserves nullable fields and validates malformed nested responses", async () => {
  const profile = createProfile();
  const client = createOrimetricsClient({
    baseUrl: "https://example.test",
    organizationSlug: "demo",
    fetch: async () => Response.json(profile),
  });

  expect(await client.organization.getProfile()).toEqual(profile);

  const malformed = createOrimetricsClient({
    baseUrl: "https://example.test",
    organizationSlug: "demo",
    fetch: async () => Response.json({ ...profile, contact: {} }),
  });

  await expect(malformed.organization.getProfile()).rejects.toMatchObject({ kind: "protocol" });
});

test("HTTP errors preserve safe diagnostics and never expose backend details", async () => {
  let calls = 0;
  const client = createOrimetricsClient({
    baseUrl: "https://example.test",
    organizationSlug: "demo",
    fetch: async () => {
      calls += 1;

      return Response.json(
        {
          status: 500,
          code: "rate_limited",
          requestId: "body-id",
          detail: "secret contact data",
          title: "secret",
        },
        { status: 429, headers: { "X-Request-ID": "header-id", "Retry-After": "2" } },
      );
    },
  });

  try {
    await client.organization.getProfile();
    throw new Error("Expected request failure");
  } catch (error) {
    expect(error).toBeInstanceOf(OrimetricsError);
    expect(error).toMatchObject({
      kind: "http",
      status: 429,
      code: "rate_limited",
      requestId: "header-id",
      retryAfterMs: 2000,
    });
    expect(JSON.stringify(error)).not.toContain("secret");
    expect(String(error)).not.toContain("secret");
  }

  expect(calls).toBe(1);
});

test.each([401, 403, 404, 409, 422, 500, 503])(
  "non-JSON HTTP %s stays an HTTP error",
  async (status) => {
    const client = createOrimetricsClient({
      baseUrl: "https://example.test",
      organizationSlug: "demo",
      fetch: async () => new Response("<html>upstream details</html>", { status }),
    });

    await expect(client.organization.getProfile()).rejects.toMatchObject({
      kind: "http",
      status,
      code: undefined,
    });
  },
);

test.each([
  new Response("broken json", {
    headers: { "content-type": "application/json", "x-request-id": "parse-id" },
  }),
  new Response("<html>proxy</html>", {
    headers: { "content-type": "text/html", "x-request-id": "parse-id" },
  }),
  new Response(null, { status: 204, headers: { "x-request-id": "parse-id" } }),
])("malformed or unexpected success becomes a protocol error", async (response) => {
  const client = createOrimetricsClient({
    baseUrl: "https://example.test",
    organizationSlug: "demo",
    fetch: async () => response,
  });

  await expect(client.organization.getProfile()).rejects.toMatchObject({
    kind: "protocol",
    requestId: "parse-id",
    status: undefined,
  });
});

test("network errors discard potentially sensitive underlying messages", async () => {
  const client = createOrimetricsClient({
    baseUrl: "https://example.test",
    organizationSlug: "demo",
    fetch: async () => {
      throw new Error("https://signed-secret.test");
    },
  });

  await expect(client.organization.getProfile()).rejects.toMatchObject({
    kind: "network",
    status: undefined,
    message: "The API could not be reached.",
  });
});

test("HTTP date Retry-After and body request ID remain available", async () => {
  const later = new Date(Date.now() + 60000).toUTCString();
  const client = createOrimetricsClient({
    baseUrl: "https://example.test",
    organizationSlug: "demo",
    fetch: async () =>
      Response.json(
        { requestId: "body-request", code: "unavailable" },
        { status: 503, headers: { "retry-after": later } },
      ),
  });

  try {
    await client.organization.getProfile();
    throw new Error("Expected HTTP error");
  } catch (error) {
    expect(error).toBeInstanceOf(OrimetricsError);

    if (error instanceof OrimetricsError) {
      expect(error.requestId).toBe("body-request");
      expect(error.retryAfterMs).toBeGreaterThan(58000);
      expect(error.retryAfterMs).toBeLessThanOrEqual(60000);
    }
  }
});

test("invalid per-request options reject without sending a request", async () => {
  let calls = 0;
  const client = createOrimetricsClient({
    baseUrl: "https://example.test",
    organizationSlug: "demo",
    fetch: async () => {
      calls += 1;
      return Response.json(createProfile());
    },
  });

  await expect(client.organization.getProfile({ limit: 101 })).rejects.toBeInstanceOf(TypeError);
  await expect(client.organization.getProfile({ offset: -1 })).rejects.toBeInstanceOf(TypeError);
  await expect(client.organization.getProfile({ timeoutMs: 0 })).rejects.toBeInstanceOf(TypeError);
  expect(calls).toBe(0);
});

test("interrupted response bodies are network failures, not JSON protocol failures", async () => {
  const client = createOrimetricsClient({
    baseUrl: "https://example.test",
    organizationSlug: "demo",
    fetch: async () =>
      new Response(
        new ReadableStream({
          start(controller) {
            controller.error(new TypeError("private upstream details"));
          },
        }),
        { headers: { "content-type": "application/json", "x-request-id": "stream-request" } },
      ),
  });

  await expect(client.organization.getProfile()).rejects.toMatchObject({
    kind: "network",
    status: undefined,
    requestId: "stream-request",
  });
});
