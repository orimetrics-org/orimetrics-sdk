import type { RequestOptions } from "@shared/configuration/options";

export type VehicleSort =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "year_asc"
  | "year_desc"
  | "mileage_asc"
  | "mileage_desc";

export type VehicleCondition = "new" | "used";

export type VehicleAvailability = "available" | "reserved" | "sold";

export type VehiclePhotoVariant = "thumbnail" | "card" | "gallery";

export type VehicleFacetKey =
  | "dealership"
  | "city"
  | "brand"
  | "model"
  | "condition"
  | "fuelType"
  | "transmission"
  | "vehicleType"
  | "availability";

export interface VehicleFilters {
  readonly search?: string;
  readonly dealership?: readonly string[];
  readonly city?: readonly string[];
  readonly brand?: readonly string[];
  readonly model?: readonly string[];
  readonly condition?: readonly VehicleCondition[];
  readonly fuelType?: readonly string[];
  readonly transmission?: readonly string[];
  readonly vehicleType?: readonly string[];
  readonly availability?: readonly Exclude<VehicleAvailability, "sold">[];
  readonly priceMin?: string;
  readonly priceMax?: string;
  readonly yearMin?: number;
  readonly yearMax?: number;
  readonly mileageMinKm?: number;
  readonly mileageMaxKm?: number;
  readonly sort?: VehicleSort;
  readonly limit?: number;
  readonly offset?: number;
}

export type VehicleFilterChanges = {
  readonly [Key in keyof VehicleFilters]?: VehicleFilters[Key] | undefined;
};

export interface VehiclePhoto {
  readonly slug: string;
  readonly isCover: boolean;
  readonly altText: string | null;
  readonly path: string;
}

export interface VehicleListing {
  readonly slug: string;
  readonly path: string;
  readonly title: string;
  readonly description: string;
  readonly askingPriceUsd: string;
  readonly currency: string;
  readonly specifications: Record<string, string | number | null>;
  readonly availability: VehicleAvailability;
  readonly company: { readonly name: string; readonly slug: string };
  readonly dealership: {
    readonly name: string;
    readonly slug: string;
    readonly address: string | null;
    readonly publicPhone: string | null;
    readonly publicEmail: string | null;
    readonly city: string | null;
  };
  readonly publishedAt: string;
  readonly interestRequestsEnabled: boolean;
  readonly photos: VehiclePhoto[];
}

export interface VehicleFacet {
  readonly value: string;
  readonly label: string;
  readonly count: number;
}

export interface VehicleRange<T> {
  readonly min: T | null;
  readonly max: T | null;
}

export interface VehiclePage {
  readonly listings: VehicleListing[];
  readonly limit: number;
  readonly offset: number;
  readonly total: number;
  readonly hasMore: boolean;
  readonly sort: VehicleSort;
  readonly facets: Record<VehicleFacetKey, VehicleFacet[]>;
  readonly ranges: {
    readonly priceUsd: VehicleRange<string>;
    readonly year: VehicleRange<number>;
    readonly mileageKm: VehicleRange<number>;
  };
}

export interface VehiclesApi {
  readonly list: (filters?: VehicleFilters, options?: RequestOptions) => Promise<VehiclePage>;
  readonly get: (listingSlug: string, options?: RequestOptions) => Promise<VehicleListing>;
  readonly photoUrl: (
    listingSlug: string,
    photoSlug: string,
    variant: VehiclePhotoVariant,
  ) => string;
}
