export type { OrimetricsClient } from "@client/create-client";

export type { OrimetricsErrorDetails, OrimetricsErrorKind } from "@shared/api/error";

export type {
  OrimetricsFetch,
  OrimetricsOptions,
  RequestOptions,
} from "@shared/configuration/options";

export type {
  OrganizationApi,
  OrganizationProfile,
  OrganizationProfileOptions,
  PublicContact,
  PublicBranding,
  PublicDealership,
  PublicWebsite,
} from "@features/organization/index.organization";

export { createOrimetricsClient } from "@client/create-client";
export { OrimetricsError } from "@shared/api/error";
