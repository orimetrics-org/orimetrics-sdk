export type OrimetricsErrorKind = "http" | "network" | "timeout" | "protocol";

export interface OrimetricsErrorDetails {
  readonly kind: OrimetricsErrorKind;
  readonly status?: number;
  readonly code?: string;
  readonly requestId?: string;
  readonly retryAfterMs?: number;
}

const MESSAGES = {
  http: "The API request was not successful.",
  network: "The API could not be reached.",
  timeout: "The API request exceeded its deadline.",
  protocol: "The API returned an unexpected response.",
} as const;

export class OrimetricsError extends Error {
  readonly kind: OrimetricsErrorKind;
  readonly status: number | undefined;
  readonly code: string | undefined;
  readonly requestId: string | undefined;
  readonly retryAfterMs: number | undefined;

  constructor(details: OrimetricsErrorDetails) {
    super(MESSAGES[details.kind]);
    this.name = "OrimetricsError";
    this.kind = details.kind;
    this.status = details.status;
    this.code = details.code;
    this.requestId = details.requestId;
    this.retryAfterMs = details.retryAfterMs;
  }
}
