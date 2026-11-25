import type { RequestOptions } from "@shared/configuration/options";

import { OrimetricsError } from "@shared/api/error";
import { validateTimeout } from "@shared/configuration/resolve";

export const withDeadline = async <T>(
  run: (signal: AbortSignal) => Promise<T>,
  options: RequestOptions,
  defaultTimeoutMs: number,
): Promise<T> => {
  const timeoutMs = validateTimeout(options.timeoutMs ?? defaultTimeoutMs);
  const callerSignal = options.signal;
  const controller = new AbortController();

  let rejectInterrupt: (reason: Error) => void = () => {};

  const interrupted = new Promise<never>((_, reject) => {
    rejectInterrupt = reject;
  });

  const interrupt = (reason: Error): void => {
    if (!controller.signal.aborted) {
      rejectInterrupt(reason);
      controller.abort(reason);
    }
  };

  const onAbort = (): void =>
    interrupt(new DOMException("The request was cancelled.", "AbortError"));

  if (callerSignal?.aborted) {
    throw new DOMException("The request was cancelled.", "AbortError");
  }

  callerSignal?.addEventListener("abort", onAbort, { once: true });

  const timer = setTimeout(() => interrupt(new OrimetricsError({ kind: "timeout" })), timeoutMs);

  try {
    return await Promise.race([interrupted, run(controller.signal)]);
  } finally {
    clearTimeout(timer);
    callerSignal?.removeEventListener("abort", onAbort);
  }
};
