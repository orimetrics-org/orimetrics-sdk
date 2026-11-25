import type { Client } from "openapi-fetch";
import type { paths } from "@shared/api/generated/schema";
import type { RequestOptions, ResolvedOptions } from "@shared/configuration/options";

import { withDeadline } from "@shared/api/deadline";
import { OrimetricsError } from "@shared/api/error";
import { httpError, responseRequestId } from "@shared/api/response";

import createClient from "openapi-fetch";

export interface OperationContext {
  readonly api: Client<paths>;
  readonly organizationSlug: string;
  readonly signal: AbortSignal;
}

export interface TransportOperation<T> {
  readonly send: (
    context: OperationContext,
  ) => Promise<{ readonly data?: unknown; readonly response: Response }>;
  readonly decode: (data: unknown) => T;
  readonly responseType?: "json" | "binary";
}

export interface Transport {
  readonly execute: <T>(operation: TransportOperation<T>, options?: RequestOptions) => Promise<T>;
}

// Promise settlement is terminal; these phases describe work before settlement.
type RequestPhase =
  | { readonly phase: "sending" }
  | { readonly phase: "reading"; readonly response: Response }
  | { readonly phase: "decoding"; readonly response: Response };

const requestFailure = (error: unknown, state: RequestPhase): unknown => {
  if (error instanceof OrimetricsError && error.kind !== "protocol") {
    return error;
  }

  if (state.phase === "sending") {
    // Configuration/request-construction errors retain their original type.
    return error;
  }

  const requestId = responseRequestId(state.response);
  const kind =
    state.phase === "reading" &&
    !(error instanceof SyntaxError) &&
    !(error instanceof OrimetricsError)
      ? "network"
      : "protocol";

  return new OrimetricsError({ kind, ...(requestId ? { requestId } : {}) });
};

const guardRequest = (request: Request, config: ResolvedOptions, signal: AbortSignal): Request => {
  const prefix = `${config.baseUrl}/public/o/${encodeURIComponent(config.organizationSlug)}/`;

  if (!request.url.startsWith(prefix)) {
    throw new TypeError("Request must use this client's public organization scope.");
  }

  const path = new URL(request.url).pathname;

  const completion =
    request.method === "POST" &&
    /\/d\/[^/]+\/appraisal-requests\/[^/]+\/photos\/[^/]+\/complete$/u.test(path);

  if (request.headers.has("cookie") || (request.headers.has("authorization") && !completion)) {
    throw new TypeError("Credentials are not allowed on this public operation.");
  }

  return new Request(request, {
    credentials: "omit",
    cache: "no-store",
    redirect: "error",
    signal,
  });
};

const execute = async <T>(
  config: ResolvedOptions,
  operation: TransportOperation<T>,
  signal: AbortSignal,
): Promise<T> => {
  let state: RequestPhase = { phase: "sending" };

  const api = createClient<paths>({
    baseUrl: config.baseUrl,
    credentials: "omit",
    cache: "no-store",
    redirect: "error",
    querySerializer: { array: { style: "form", explode: true } },
    fetch: async (request) => {
      signal.throwIfAborted();

      const safeRequest = guardRequest(request, config, signal);

      try {
        return await config.fetch(safeRequest, {
          credentials: "omit",
          cache: "no-store",
          redirect: "error",
          signal,
        });
      } catch {
        throw new OrimetricsError({ kind: "network" });
      }
    },
  });

  api.use({
    onResponse: async (context) => {
      if (signal.aborted) {
        // A custom fetch can resolve after interruption. Release its unused body
        // without waiting on an equally uncooperative stream cancellation.
        void context.response.body?.cancel().catch(() => undefined);
        signal.throwIfAborted();
      }

      const response = context.response;
      state = { phase: "reading", response };

      if (!response.ok) {
        throw await httpError(response);
      }

      if (
        operation.responseType !== "binary" &&
        response.status !== 204 &&
        response.status !== 205
      ) {
        const mediaType = response.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();

        if (
          mediaType !== "application/json" &&
          !(mediaType?.startsWith("application/") && mediaType.endsWith("+json"))
        ) {
          throw new OrimetricsError({ kind: "protocol" });
        }
      }
    },
  });

  try {
    const result = await operation.send({ api, organizationSlug: config.organizationSlug, signal });

    signal.throwIfAborted();
    state = { phase: "decoding", response: result.response };

    return operation.decode(result.data);
  } catch (error) {
    throw requestFailure(error, state);
  }
};

export const createTransport = (config: ResolvedOptions): Transport =>
  Object.freeze({
    execute: <T>(operation: TransportOperation<T>, options: RequestOptions = {}): Promise<T> =>
      withDeadline((signal) => execute(config, operation, signal), options, config.timeoutMs),
  });
