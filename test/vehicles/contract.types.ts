import type { VehicleListing, VehiclePage, OrganizationProfile } from "@sdk";
import type { paths } from "@shared/api/generated/schema";

type Listing =
  paths["/public/o/{organizationSlug}/vehicles/{listingSlug}"]["get"]["responses"][200]["content"]["application/json"];

type Page =
  paths["/public/o/{organizationSlug}/vehicles"]["get"]["responses"][200]["content"]["application/json"];

type Profile =
  paths["/public/o/{organizationSlug}/d/{dealershipSlug}/profile"]["get"]["responses"][200]["content"]["application/json"];

type Assert<T extends true> = T;

export type ListingContract = Assert<
  Listing extends VehicleListing ? (VehicleListing extends Listing ? true : false) : false
>;

export type PageContract = Assert<
  Page extends VehiclePage ? (VehiclePage extends Page ? true : false) : false
>;

export type ProfileContract = Assert<
  Profile extends OrganizationProfile ? (OrganizationProfile extends Profile ? true : false) : false
>;
