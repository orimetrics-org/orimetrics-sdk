import type { RequestOptions } from "@shared/configuration/options";

export interface PublicContact {
  readonly publicPhone: string | null;
  readonly publicEmail: string | null;
  readonly address: string | null;
  readonly facebookUrl: string | null;
  readonly instagramUrl: string | null;
  readonly tiktokUrl: string | null;
  readonly youtubeUrl: string | null;
  readonly whatsappNumber: string | null;
  readonly whatsappMessage: string | null;
}

export interface PublicBranding {
  readonly primaryColor: string | null;
  readonly accentColor: string | null;
  readonly logo: { readonly path: string } | null;
}

export type PublicWebsite =
  | { readonly source: "registered" | "fallback"; readonly origin: string }
  | { readonly source: "unconfigured"; readonly origin: null };

export interface PublicDealership {
  readonly name: string;
  readonly slug: string;
  readonly city: string | null;
  readonly path: string;
  readonly contact: PublicContact;
  readonly branding: PublicBranding;
}

export interface OrganizationProfile {
  readonly company: { readonly name: string; readonly slug: string };
  readonly website: PublicWebsite;
  readonly contact: PublicContact;
  readonly branding: PublicBranding;
  readonly dealerships: {
    readonly items: PublicDealership[];
    readonly total: number;
    readonly limit: number;
    readonly offset: number;
    readonly hasMore: boolean;
  };
}

export interface OrganizationProfileOptions extends RequestOptions {
  readonly limit?: number;
  readonly offset?: number;
}

export interface DealershipsApi {
  readonly getProfile: (
    dealershipSlug: string,
    options?: RequestOptions,
  ) => Promise<OrganizationProfile>;
  readonly logoUrl: (dealershipSlug: string) => string;
}

export interface OrganizationApi {
  readonly logoUrl: () => string;
  readonly getProfile: (options?: OrganizationProfileOptions) => Promise<OrganizationProfile>;
}
