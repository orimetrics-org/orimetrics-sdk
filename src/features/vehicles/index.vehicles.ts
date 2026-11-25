import type { VehiclesApi, VehicleFilters } from "@features/vehicles/types";
import type { Transport } from "@shared/api/transport";
import type { ResolvedOptions } from "@shared/configuration/options";

import { serializeVehicleFilters } from "@features/vehicles/filters";
import { decodeListing, decodeVehiclePage } from "@features/vehicles/response";
import { publicBaseUrl, validateSlug } from "@shared/configuration/urls";

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
} from "@features/vehicles/types";

export {
  parseVehicleFilters,
  serializeVehicleFilters,
  updateVehicleFilters,
} from "@features/vehicles/filters";

export const createVehiclesApi = (transport: Transport, config: ResolvedOptions): VehiclesApi =>
  Object.freeze<VehiclesApi>({
    list: async (filters: VehicleFilters = {}, options) => {
      const query = serializeVehicleFilters(filters);

      return transport.execute(
        {
          send: ({ api, organizationSlug, signal }) =>
            api.GET("/public/o/{organizationSlug}/vehicles", {
              params: { path: { organizationSlug } },
              querySerializer: () => query,
              signal,
            }),
          decode: decodeVehiclePage,
        },
        options,
      );
    },
    get: async (listingSlug, options) => {
      validateSlug(listingSlug, "listingSlug");

      return transport.execute(
        {
          send: ({ api, organizationSlug, signal }) =>
            api.GET("/public/o/{organizationSlug}/vehicles/{listingSlug}", {
              params: { path: { organizationSlug, listingSlug } },
              signal,
            }),
          decode: decodeListing,
        },
        options,
      );
    },
    photoUrl: (listingSlug, photoSlug, variant) => {
      validateSlug(listingSlug, "listingSlug");
      validateSlug(photoSlug, "photoSlug");

      if (!["thumbnail", "card", "gallery"].includes(variant)) {
        throw new TypeError("Invalid photo variant.");
      }

      return `${publicBaseUrl(config)}/vehicles/${encodeURIComponent(listingSlug)}/photos/${encodeURIComponent(photoSlug)}?variant=${variant}`;
    },
  });
