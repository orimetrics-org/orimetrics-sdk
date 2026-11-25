import type { InquiriesApi } from "@features/inquiries/index.inquiries";
import type { VehiclesApi } from "@features/vehicles/index.vehicles";
import type { DealershipsApi, OrganizationApi } from "@features/organization/index.organization";
import type { OrimetricsOptions } from "@shared/configuration/options";

import { createInquiriesApi } from "@features/inquiries/index.inquiries";
import { createTransport } from "@shared/api/transport";
import { resolveOptions } from "@shared/configuration/resolve";
import { createVehiclesApi } from "@features/vehicles/index.vehicles";

import * as organization from "@features/organization/index.organization";

export interface OrimetricsClient {
  readonly organization: OrganizationApi;
  readonly dealerships: DealershipsApi;
  readonly vehicles: VehiclesApi;
  readonly inquiries: InquiriesApi;
}

export const createOrimetricsClient = (options: OrimetricsOptions): OrimetricsClient => {
  const config = resolveOptions(options);
  const transport = createTransport(config);

  return Object.freeze({
    organization: organization.createOrganizationApi(transport, config),
    dealerships: organization.createDealershipsApi(transport, config),
    vehicles: createVehiclesApi(transport, config),
    inquiries: createInquiriesApi(transport),
  });
};
