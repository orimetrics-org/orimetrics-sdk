export type OrimetricsFetch = (request: Request, init: RequestInit) => Promise<Response>;

export interface OrimetricsOptions {
  readonly baseUrl: string;
  readonly organizationSlug: string;
  readonly fetch?: OrimetricsFetch;
  readonly timeoutMs?: number;
}

export interface RequestOptions {
  readonly signal?: AbortSignal;
  readonly timeoutMs?: number;
}

export interface ResolvedOptions {
  readonly baseUrl: string;
  readonly organizationSlug: string;
  readonly fetch: OrimetricsFetch;
  readonly timeoutMs: number;
}
