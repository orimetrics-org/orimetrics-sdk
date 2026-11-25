import { OrimetricsError } from "@shared/api/error";

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const identifier = (value: unknown): string | undefined => {
  if (typeof value === "string" && /^[\w.:-]{1,128}$/u.test(value)) {
    return value;
  }

  return undefined;
};

export const responseRequestId = (response: Response): string | undefined =>
  identifier(response.headers.get("X-Request-ID"));

const retryAfter = (value: string | null): number | undefined => {
  if (!value) {
    return undefined;
  }

  if (/^\d+$/u.test(value)) {
    const milliseconds = Number(value) * 1000;

    return Number.isSafeInteger(milliseconds) ? milliseconds : undefined;
  }

  if (!/^[A-Za-z]{3},/u.test(value)) {
    return undefined;
  }

  const timestamp = Date.parse(value);

  return Number.isFinite(timestamp) ? Math.max(0, timestamp - Date.now()) : undefined;
};

export const httpError = async (response: Response): Promise<OrimetricsError> => {
  let problem: unknown;

  try {
    problem = await response.json();
  } catch {
    problem = undefined;
  }

  const code = identifier(isRecord(problem) ? problem.code : undefined);

  const requestId =
    responseRequestId(response) ?? identifier(isRecord(problem) ? problem.requestId : undefined);

  const retryAfterMs = retryAfter(response.headers.get("Retry-After"));

  return new OrimetricsError({
    kind: "http",
    status: response.status,
    ...(code === undefined ? {} : { code }),
    ...(requestId === undefined ? {} : { requestId }),
    ...(retryAfterMs === undefined ? {} : { retryAfterMs }),
  });
};
