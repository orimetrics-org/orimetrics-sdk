import type { OrimetricsOptions, ResolvedOptions } from "@shared/configuration/options";

import { validateSlug } from "@shared/configuration/urls";

export const DEFAULT_TIMEOUT_MS = 15_000 as const;

export const validateTimeout = (timeoutMs: number): number => {
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 2_147_483_647) {
    throw new TypeError("timeoutMs must be an integer between 1 and 2147483647.");
  }

  return timeoutMs;
};

export const resolveOptions = (options: OrimetricsOptions): ResolvedOptions => {
  const url = new URL(options.baseUrl);
  const slug = options.organizationSlug;

  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new TypeError("baseUrl must be an HTTP(S) URL without credentials, query or fragment.");
  }

  validateSlug(slug, "organizationSlug");

  if (options.fetch !== undefined && typeof options.fetch !== "function") {
    throw new TypeError("fetch must be a function.");
  }

  const fetch = options.fetch ?? globalThis.fetch?.bind(globalThis);

  if (!fetch) {
    throw new TypeError("A Fetch implementation is required.");
  }

  return Object.freeze({
    baseUrl: url.href.replace(/\/+$/u, ""),
    organizationSlug: slug,
    timeoutMs: validateTimeout(options.timeoutMs ?? DEFAULT_TIMEOUT_MS),
    fetch,
  });
};
