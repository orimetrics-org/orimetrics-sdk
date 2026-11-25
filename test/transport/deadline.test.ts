import { expect, test, spyOn } from "bun:test";
import { createOrimetricsClient } from "@sdk";
import { createProfile } from "../fixtures/profile";

const OPTIONS = { baseUrl: "https://example.test", organizationSlug: "demo" } as const;

test("pre-aborted requests do not call fetch and normalize custom abort reasons", async () => {
  let calls = 0;
  const controller = new AbortController();
  const client = createOrimetricsClient({
    ...OPTIONS,
    fetch: async () => {
      calls += 1;
      return Response.json(createProfile());
    },
  });

  controller.abort("private reason");
  await expect(client.organization.getProfile({ signal: controller.signal })).rejects.toMatchObject(
    { name: "AbortError", message: "The request was cancelled." },
  );
  expect(calls).toBe(0);
});

test("in-flight abort settles even when injected fetch ignores its signal", async () => {
  const controller = new AbortController();
  let request: Request | undefined;
  const client = createOrimetricsClient({
    ...OPTIONS,
    fetch: (input) => {
      request = input;
      return new Promise(() => {});
    },
  });
  const pending = client.organization.getProfile({ signal: controller.signal });

  controller.abort(new Error("private reason"));
  await expect(pending).rejects.toMatchObject({ name: "AbortError" });
  expect(request?.signal.aborted).toBe(true);
});

test("deadline covers uncooperative fetch and per-request override", async () => {
  let request: Request | undefined;
  const client = createOrimetricsClient({
    ...OPTIONS,
    timeoutMs: 10000,
    fetch: (input) => {
      request = input;
      return new Promise(() => {});
    },
  });

  await expect(client.organization.getProfile({ timeoutMs: 10 })).rejects.toMatchObject({
    kind: "timeout",
    status: undefined,
  });
  expect(request?.signal.aborted).toBe(true);
});

test("deadline also covers a response body that never completes", async () => {
  const client = createOrimetricsClient({
    ...OPTIONS,
    timeoutMs: 10,
    fetch: async () =>
      new Response(new ReadableStream(), { headers: { "content-type": "application/json" } }),
  });

  await expect(client.organization.getProfile()).rejects.toMatchObject({ kind: "timeout" });
});

test("one cancelled request does not cancel another; caller listeners are removed", async () => {
  const controller = new AbortController();
  const remove = spyOn(controller.signal, "removeEventListener");
  let calls = 0;
  const client = createOrimetricsClient({
    ...OPTIONS,
    fetch: async () => {
      calls += 1;
      if (calls === 1) {
        return new Promise(() => {});
      }
      return Response.json(createProfile());
    },
  });
  const cancelled = client.organization.getProfile({ signal: controller.signal });
  const successful = client.organization.getProfile();

  controller.abort();
  await expect(cancelled).rejects.toMatchObject({ name: "AbortError" });
  expect(await successful).toEqual(createProfile());
  expect(remove).toHaveBeenCalledWith("abort", expect.any(Function));
  remove.mockRestore();
});
