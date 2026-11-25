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
  let response: Response | undefined;
  let decoding = false;

  const api = createClient<paths>({
    baseUrl: config.baseUrl,
    credentials: "omit",
    cache: "no-store",
    redirect: "error",
    querySerializer: { array: { style: "form", explode: true } },
    fetch: async (request) => {
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
      response = context.response;

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

    decoding = true;

    return operation.decode(result.data);
  } catch (error) {
    if (error instanceof OrimetricsError && error.kind !== "protocol") {
      throw error;
    }

    const requestId = response ? responseRequestId(response) : undefined;

    if (!response) {
      throw error;
    }

    const kind =
      !decoding && !(error instanceof SyntaxError) && !(error instanceof OrimetricsError)
        ? "network"
        : "protocol";

    throw new OrimetricsError({ kind, ...(requestId ? { requestId } : {}) });
  }
};

export const createTransport = (config: ResolvedOptions): Transport =>
  Object.freeze({
    execute: <T>(operation: TransportOperation<T>, options: RequestOptions = {}): Promise<T> =>
      withDeadline((signal) => execute(config, operation, signal), options, config.timeoutMs),
  });
