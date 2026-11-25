import type { OrganizationProfile } from "@features/organization/types";

import { isRecord } from "@shared/api/response";
import { OrimetricsError } from "@shared/api/error";

const CONTACT_FIELDS = [
  "publicPhone",
  "publicEmail",
  "address",
  "facebookUrl",
  "instagramUrl",
  "tiktokUrl",
  "youtubeUrl",
  "whatsappNumber",
  "whatsappMessage",
] as const;

const nullableString = (value: unknown): boolean => value === null || typeof value === "string";

const contact = (value: unknown): boolean =>
  isRecord(value) && CONTACT_FIELDS.every((field) => nullableString(value[field]));

const branding = (value: unknown): boolean =>
  isRecord(value) &&
  nullableString(value.primaryColor) &&
  nullableString(value.accentColor) &&
  (value.logo === null || (isRecord(value.logo) && typeof value.logo.path === "string"));

const website = (value: unknown): boolean => {
  if (!isRecord(value)) {
    return false;
  }

  if (value.source === "unconfigured") {
    return value.origin === null;
  }

  return (
    (value.source === "registered" || value.source === "fallback") &&
    typeof value.origin === "string"
  );
};

const dealership = (value: unknown): boolean =>
  isRecord(value) &&
  typeof value.name === "string" &&
  typeof value.slug === "string" &&
  typeof value.path === "string" &&
  nullableString(value.city) &&
  contact(value.contact) &&
  branding(value.branding);

const finiteNumber = (value: unknown): boolean =>
  typeof value === "number" && Number.isFinite(value);

const isProfile = (value: unknown): value is OrganizationProfile => {
  if (!isRecord(value) || !isRecord(value.company) || !isRecord(value.dealerships)) {
    return false;
  }

  const page = value.dealerships;

  return (
    typeof value.company.name === "string" &&
    typeof value.company.slug === "string" &&
    website(value.website) &&
    contact(value.contact) &&
    branding(value.branding) &&
    Array.isArray(page.items) &&
    page.items.every(dealership) &&
    finiteNumber(page.total) &&
    finiteNumber(page.limit) &&
    finiteNumber(page.offset) &&
    typeof page.hasMore === "boolean"
  );
};

export const decodeProfile = (value: unknown): OrganizationProfile => {
  if (!isProfile(value)) {
    throw new OrimetricsError({ kind: "protocol" });
  }

  return value;
};
