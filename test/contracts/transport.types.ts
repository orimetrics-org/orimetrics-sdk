import type { paths } from "@shared/api/generated/schema";

import createClient from "openapi-fetch";

type Assert<Condition extends true> = Condition;
type Listings = paths["/public/o/{organizationSlug}/vehicles"]["get"];
type Inquiry =
  paths["/public/o/{organizationSlug}/vehicles/{listingSlug}/interest-requests"]["post"];
type Appraisal =
  paths["/public/o/{organizationSlug}/d/{dealershipSlug}/appraisal-requests"]["post"];
type Completion =
  paths["/public/o/{organizationSlug}/d/{dealershipSlug}/appraisal-requests/{requestReference}/photos/{photoSlug}/complete"]["post"];
type AppraisalBody = Appraisal["requestBody"]["content"]["application/json"];

export type PublicPathsOnly = Assert<
  Exclude<keyof paths, `/public/${string}`> extends never ? true : false
>;
export type IdempotencyRequired = Assert<
  Inquiry["parameters"]["header"]["Idempotency-Key"] extends string ? true : false
>;
export type CompletionTokenRequired = Assert<
  Completion["parameters"]["header"]["Authorization"] extends string ? true : false
>;
export type MoneyIsString = Assert<
  Exclude<AppraisalBody["vehicle"]["expectedPriceUsd"], null | undefined> extends string
    ? true
    : false
>;
export type FiltersRepeat = Assert<
  NonNullable<NonNullable<Listings["parameters"]["query"]>["brand"]> extends string[] ? true : false
>;

// Compile-only fixture: the function is never invoked and performs no requests in tests.
export const verifyTypedTransport = (): void => {
  const client = createClient<paths>({ baseUrl: "https://example.test" });

  void client.GET("/public/o/{organizationSlug}/vehicles", {
    params: { path: { organizationSlug: "demo" }, query: { brand: ["toyota", "mazda"] } },
  });
  // @ts-expect-error Private ERP routes cannot be called through this contract.
  void client.GET("/o/{organizationSlug}/vehicles");
  // @ts-expect-error Public inquiry submission requires the idempotency header.
  const missingHeader: Inquiry["parameters"]["header"] = {};

  void missingHeader;
};
