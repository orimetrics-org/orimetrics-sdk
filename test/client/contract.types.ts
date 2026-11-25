import type { OrganizationProfile } from "@sdk";
import type { paths } from "@shared/api/generated/schema";

type ContractProfile =
  paths["/public/o/{organizationSlug}/profile"]["get"]["responses"][200]["content"]["application/json"];
type Assert<Condition extends true> = Condition;

export type ProfileAcceptsContract = Assert<
  ContractProfile extends OrganizationProfile ? true : false
>;
export type ProfileMatchesContract = Assert<
  OrganizationProfile extends ContractProfile ? true : false
>;
