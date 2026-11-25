import type { TransportOperation } from "@shared/api/transport";

import { expect, test, spyOn } from "bun:test";
import { createTransport } from "@shared/api/transport";
import { withDeadline } from "@shared/api/deadline";
import { resolveOptions } from "@shared/configuration/resolve";

const operation = (decode: (data: unknown) => unknown): TransportOperation<unknown> => ({
  send: ({ api, organizationSlug, signal }) =>
    api.GET("/public/o/{organizationSlug}/profile", {
      params: { path: { organizationSlug } },
      signal,
    }),
  decode,
});

// Drain late promise continuations without waiting for a real network or deadline.
const nextTurn = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

test("synchronous abort followed by throw settles as cancellation without orphaned rejections", async () => {
  const controller = new AbortController();
  const remove = spyOn(controller.signal, "removeEventListener");

  try {
    await expect(
      withDeadline(
        () => {
          controller.abort("private reason");
          throw new TypeError("synchronous failure");
        },
        { signal: controller.signal },
        1000,
      ),
    ).rejects.toMatchObject({ name: "AbortError", message: "The request was cancelled." });
    await nextTurn();
    expect(remove).toHaveBeenCalledTimes(1);
  } finally {
    remove.mockRestore();
  }
});

test("synchronous failure retains its identity and releases caller listeners", async () => {
  const error = new TypeError("invalid operation");
  const controller = new AbortController();
  const remove = spyOn(controller.signal, "removeEventListener");

  try {
    await expect(
      withDeadline(
        () => {
          throw error;
        },
        { signal: controller.signal },
        1000,
      ),
    ).rejects.toBe(error);
    expect(remove).toHaveBeenCalledTimes(1);
  } finally {
    remove.mockRestore();
  }
});

test.each(["abort", "timeout"] as const)(
  "late fetch success after %s discards the body without parsing or decoding",
  async (interrupt) => {
    const controller = new AbortController();
    let finish: (response: Response) => void = () => {};
    let decodes = 0;
    const transport = createTransport(
      resolveOptions({
        baseUrl: "https://example.test",
        organizationSlug: "demo",
        fetch: () =>
          new Promise((resolve) => {
            finish = resolve;
          }),
      }),
    );
    const response = Response.json({});
    const read = spyOn(response, "json");
    const pending = transport.execute(
      operation(() => {
        decodes++;
      }),
      { signal: controller.signal, timeoutMs: interrupt === "timeout" ? 5 : 1000 },
    );

    if (interrupt === "abort") {
      controller.abort();
    }

    await expect(pending).rejects.toMatchObject(
      interrupt === "abort" ? { name: "AbortError" } : { kind: "timeout" },
    );
    finish(response);
    await nextTurn();
    expect(response.bodyUsed).toBe(true);
    expect(read).not.toHaveBeenCalled();
    read.mockRestore();
    expect(decodes).toBe(0);
  },
);

test("cancellation during body reading prevents late feature decoding", async () => {
  const controller = new AbortController();
  let body: ReadableStreamDefaultController<Uint8Array> | undefined;
  let decodes = 0;
  const response = new Response(
    new ReadableStream<Uint8Array>({
      start(stream) {
        body = stream;
      },
    }),
    { headers: { "content-type": "application/json" } },
  );
  const transport = createTransport(
    resolveOptions({
      baseUrl: "https://example.test",
      organizationSlug: "demo",
      fetch: async () => response,
    }),
  );
  const pending = transport.execute(
    operation(() => {
      decodes++;
    }),
    { signal: controller.signal },
  );
  await nextTurn();
  expect(response.bodyUsed).toBe(true);
  controller.abort();
  await expect(pending).rejects.toMatchObject({ name: "AbortError" });
  body?.enqueue(new TextEncoder().encode("{}"));
  body?.close();
  await nextTurn();
  expect(decodes).toBe(0);
});

test("decoder TypeErrors are protocol failures, not response-stream failures", async () => {
  const transport = createTransport(
    resolveOptions({
      baseUrl: "https://example.test",
      organizationSlug: "demo",
      fetch: async () => Response.json({}, { headers: { "X-Request-ID": "decoder-request" } }),
    }),
  );

  await expect(
    transport.execute(
      operation(() => {
        throw new TypeError("private payload");
      }),
    ),
  ).rejects.toMatchObject({
    kind: "protocol",
    requestId: "decoder-request",
    message: "The API returned an unexpected response.",
  });
});

test("caller abort after success does not abort the completed operation signal", async () => {
  const controller = new AbortController();
  let signal: AbortSignal | undefined;

  expect(
    await withDeadline(
      async (current) => {
        signal = current;
        return "done";
      },
      { signal: controller.signal },
      1000,
    ),
  ).toBe("done");
  controller.abort();
  expect(signal?.aborted).toBe(false);
});
