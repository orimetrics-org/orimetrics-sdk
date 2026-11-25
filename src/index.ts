export type { OrimetricsClient } from "@client/create-client";

export type { OrimetricsErrorDetails, OrimetricsErrorKind } from "@shared/api/error";

export type {
  OrimetricsFetch,
  OrimetricsOptions,
  RequestOptions,
} from "@shared/configuration/options";

export type {
  DealershipsApi,
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

export type {
  VehiclesApi,
  VehicleFilters,
  VehicleFilterChanges,
  VehicleSort,
  VehicleCondition,
  VehicleAvailability,
  VehiclePhotoVariant,
  VehicleFacetKey,
  VehiclePhoto,
  VehicleListing,
  VehicleFacet,
  VehicleRange,
  VehiclePage,
} from "@features/vehicles/index.vehicles";

export {
  parseVehicleFilters,
  serializeVehicleFilters,
  updateVehicleFilters,
} from "@features/vehicles/index.vehicles";

export type {
  InquiriesApi,
  InquiryContact,
  InquiryCustomer,
  InquirySubmission,
  InquiryLimits,
  EnabledInquiryForm,
  InquiryForm,
  InquiryReceipt,
  InquirySubmitOptions,
} from "@features/inquiries/index.inquiries";
export { validateInquirySubmission } from "@features/inquiries/index.inquiries";
