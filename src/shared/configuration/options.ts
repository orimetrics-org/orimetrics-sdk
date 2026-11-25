export interface OrimetricsOptions {
  readonly baseUrl: string;
  readonly organizationSlug: string;
  readonly fetch?: typeof globalThis.fetch;
}
