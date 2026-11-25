import type { OrganizationApi, OrganizationProfileOptions } from "@features/organization/types";
import type { Transport } from "@shared/api/transport";

import { decodeProfile } from "@features/organization/profile";

export type {
  OrganizationApi,
  OrganizationProfile,
  OrganizationProfileOptions,
  PublicContact,
  PublicBranding,
  PublicDealership,
  PublicWebsite,
} from "@features/organization/types";

const validatePagination = (options: OrganizationProfileOptions): void => {
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

export const createOrganizationApi = (transport: Transport): OrganizationApi =>
  Object.freeze({
    getProfile: async (options: OrganizationProfileOptions = {}) => {
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
