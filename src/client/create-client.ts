import type { OrganizationApi } from "@features/organization/index.organization";
import type { OrimetricsOptions } from "@shared/configuration/options";

import { createOrganizationApi } from "@features/organization/index.organization";
import { createTransport } from "@shared/api/transport";
import { resolveOptions } from "@shared/configuration/resolve";

export interface OrimetricsClient {
  readonly organization: OrganizationApi;
}

export const createOrimetricsClient = (options: OrimetricsOptions): OrimetricsClient => {
  const config = resolveOptions(options);
  const transport = createTransport(config);

  return Object.freeze({ organization: createOrganizationApi(transport) });
};
