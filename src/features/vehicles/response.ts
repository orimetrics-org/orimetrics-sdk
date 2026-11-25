import type { VehicleListing, VehiclePage } from "@features/vehicles/types";

import { FACET_KEYS, SORTS } from "@features/vehicles/constants";
import { OrimetricsError } from "@shared/api/error";
import { isRecord } from "@shared/api/response";

const finiteNumber = (value: unknown): boolean =>
  typeof value === "number" && Number.isFinite(value);

const nullableString = (value: unknown): boolean => value === null || typeof value === "string";

const identity = (value: unknown): boolean =>
  isRecord(value) && typeof value.name === "string" && typeof value.slug === "string";

const isListing = (value: unknown): value is VehicleListing => {
  if (!isRecord(value) || !isRecord(value.dealership) || !isRecord(value.specifications)) {
    return false;
  }

  const dealership = value.dealership;

  return (
    ["slug", "path", "title", "description", "askingPriceUsd", "currency", "publishedAt"].every(
      (key) => typeof value[key] === "string",
    ) &&
    ["available", "reserved", "sold"].some((availability) => availability === value.availability) &&
    identity(value.company) &&
    identity(value.dealership) &&
    ["address", "publicPhone", "publicEmail", "city"].every((key) =>
      nullableString(dealership[key]),
    ) &&
    Object.values(value.specifications).every(
      (entry) => nullableString(entry) || finiteNumber(entry),
    ) &&
    typeof value.interestRequestsEnabled === "boolean" &&
    Array.isArray(value.photos) &&
    value.photos.every(
      (photo: unknown) =>
        isRecord(photo) &&
        typeof photo.slug === "string" &&
        typeof photo.path === "string" &&
        typeof photo.isCover === "boolean" &&
        nullableString(photo.altText),
    )
  );
};

const range = (value: unknown, bound: (value: unknown) => boolean): boolean =>
  isRecord(value) &&
  (value.min === null || bound(value.min)) &&
  (value.max === null || bound(value.max));

const isPage = (value: unknown): value is VehiclePage => {
  if (!isRecord(value) || !isRecord(value.facets) || !isRecord(value.ranges)) {
    return false;
  }

  const facets = value.facets;

  return (
    Array.isArray(value.listings) &&
    value.listings.every(isListing) &&
    [value.limit, value.offset, value.total].every(finiteNumber) &&
    typeof value.hasMore === "boolean" &&
    SORTS.some((sort) => sort === value.sort) &&
    FACET_KEYS.every((key) => {
      const options = facets[key];

      return (
        Array.isArray(options) &&
        options.every(
          (option: unknown) =>
            isRecord(option) &&
            typeof option.value === "string" &&
            typeof option.label === "string" &&
            finiteNumber(option.count),
        )
      );
    }) &&
    range(value.ranges.priceUsd, (bound) => typeof bound === "string") &&
    range(value.ranges.year, finiteNumber) &&
    range(value.ranges.mileageKm, finiteNumber)
  );
};

export const decodeListing = (value: unknown): VehicleListing => {
  if (!isListing(value)) {
    throw new OrimetricsError({ kind: "protocol" });
  }

  return value;
};

export const decodeVehiclePage = (value: unknown): VehiclePage => {
  if (!isPage(value)) {
    throw new OrimetricsError({ kind: "protocol" });
  }

  return value;
};
