import type { ResolvedOptions } from "@shared/configuration/options";
import type { Transport } from "@shared/api/transport";

import type * as t from "@features/organization/types";

import { decodeProfile } from "@features/organization/profile";

import { publicBaseUrl, validateSlug } from "@shared/configuration/urls";

export type {
  DealershipsApi,
  OrganizationApi,
  OrganizationProfile,
  OrganizationProfileOptions,
  PublicContact,
  PublicBranding,
  PublicDealership,
  PublicWebsite,
} from "@features/organization/types";

const validatePagination = (options: t.OrganizationProfileOptions): void => {
  if (
    options.limit !== undefined &&
    (!Number.isInteger(options.limit) || options.limit < 1 || options.limit > 100)
  ) {
    throw new TypeError("limit must be an integer between 1 and 100.");
  }

  if (
    options.offset !== undefined &&
    (!Number.isInteger(options.offset) || options.offset < 0 || options.offset > 100000)
  ) {
    throw new TypeError("offset must be an integer between 0 and 100000.");
  }
};

export const createOrganizationApi = (
  transport: Transport,
  config: ResolvedOptions,
): t.OrganizationApi =>
  Object.freeze({
    logoUrl: () => `${publicBaseUrl(config)}/branding/logo`,
    getProfile: async (options: t.OrganizationProfileOptions = {}) => {
      validatePagination(options);

      return transport.execute(
        {
          send: ({ api, organizationSlug, signal }) =>
            api.GET("/public/o/{organizationSlug}/profile", {
              params: {
                path: { organizationSlug },
                query: {
                  ...(options.limit === undefined ? {} : { limit: options.limit }),
                  ...(options.offset === undefined ? {} : { offset: options.offset }),
                },
              },
              signal,
            }),
          decode: decodeProfile,
        },
        options,
      );
    },
  });

export const createDealershipsApi = (
  transport: Transport,
  config: ResolvedOptions,
): t.DealershipsApi =>
  Object.freeze<t.DealershipsApi>({
    getProfile: async (dealershipSlug, options) => {
      validateSlug(dealershipSlug, "dealershipSlug");

      return transport.execute(
        {
          send: ({ api, organizationSlug, signal }) =>
            api.GET("/public/o/{organizationSlug}/d/{dealershipSlug}/profile", {
              params: { path: { organizationSlug, dealershipSlug } },
              signal,
            }),
          decode: decodeProfile,
        },
        options,
      );
    },
    logoUrl: (dealershipSlug) => {
      validateSlug(dealershipSlug, "dealershipSlug");

      return `${publicBaseUrl(config)}/d/${encodeURIComponent(dealershipSlug)}/branding/logo`;
    },
  });
