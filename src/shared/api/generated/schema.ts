/** Generated from contracts/openapi.json. Do not edit; run bun run contracts:generate. */
export interface paths {
  "/public/o/{organizationSlug}/branding/logo": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * GET /public/o/:organizationSlug/branding/logo
     * @description Public SDK transport contract. See contracts/README.md for workflow semantics.
     */
    get: operations["get_public_o_by_organizationSlug_branding_logo"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/public/o/{organizationSlug}/d/{dealershipSlug}/appraisal-requests": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * POST /public/o/:organizationSlug/d/:dealershipSlug/appraisal-requests
     * @description Public SDK transport contract. See contracts/README.md for workflow semantics.
     */
    post: operations["post_public_o_by_organizationSlug_d_by_dealershipSlug_appraisal_requests"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/public/o/{organizationSlug}/d/{dealershipSlug}/appraisal-requests/{requestReference}/photos/{photoSlug}/complete": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * POST /public/o/:organizationSlug/d/:dealershipSlug/appraisal-requests/:requestReference/photos/:photoSlug/complete
     * @description Public SDK transport contract. See contracts/README.md for workflow semantics.
     */
    post: operations["post_public_o_by_organizationSlug_d_by_dealershipSlug_appraisal_requests_by_requestReference_photos_by_photoSlug_complete"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/public/o/{organizationSlug}/d/{dealershipSlug}/appraisal-requests/form": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * GET /public/o/:organizationSlug/d/:dealershipSlug/appraisal-requests/form
     * @description Public SDK transport contract. See contracts/README.md for workflow semantics.
     */
    get: operations["get_public_o_by_organizationSlug_d_by_dealershipSlug_appraisal_requests_form"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/public/o/{organizationSlug}/d/{dealershipSlug}/branding/logo": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * GET /public/o/:organizationSlug/d/:dealershipSlug/branding/logo
     * @description Public SDK transport contract. See contracts/README.md for workflow semantics.
     */
    get: operations["get_public_o_by_organizationSlug_d_by_dealershipSlug_branding_logo"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/public/o/{organizationSlug}/d/{dealershipSlug}/profile": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * GET /public/o/:organizationSlug/d/:dealershipSlug/profile
     * @description Public SDK transport contract. See contracts/README.md for workflow semantics.
     */
    get: operations["get_public_o_by_organizationSlug_d_by_dealershipSlug_profile"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/public/o/{organizationSlug}/profile": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * GET /public/o/:organizationSlug/profile
     * @description Public SDK transport contract. See contracts/README.md for workflow semantics.
     */
    get: operations["get_public_o_by_organizationSlug_profile"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/public/o/{organizationSlug}/vehicles": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * GET /public/o/:organizationSlug/vehicles
     * @description Public SDK transport contract. See contracts/README.md for workflow semantics.
     */
    get: operations["get_public_o_by_organizationSlug_vehicles"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/public/o/{organizationSlug}/vehicles/{listingSlug}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * GET /public/o/:organizationSlug/vehicles/:listingSlug
     * @description Public SDK transport contract. See contracts/README.md for workflow semantics.
     */
    get: operations["get_public_o_by_organizationSlug_vehicles_by_listingSlug"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/public/o/{organizationSlug}/vehicles/{listingSlug}/interest-requests": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * POST /public/o/:organizationSlug/vehicles/:listingSlug/interest-requests
     * @description Public SDK transport contract. See contracts/README.md for workflow semantics.
     */
    post: operations["post_public_o_by_organizationSlug_vehicles_by_listingSlug_interest_requests"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/public/o/{organizationSlug}/vehicles/{listingSlug}/interest-requests/form": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * GET /public/o/:organizationSlug/vehicles/:listingSlug/interest-requests/form
     * @description Public SDK transport contract. See contracts/README.md for workflow semantics.
     */
    get: operations["get_public_o_by_organizationSlug_vehicles_by_listingSlug_interest_requests_form"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/public/o/{organizationSlug}/vehicles/{listingSlug}/photos/{photoSlug}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * GET /public/o/:organizationSlug/vehicles/:listingSlug/photos/:photoSlug
     * @description Public SDK transport contract. See contracts/README.md for workflow semantics.
     */
    get: operations["get_public_o_by_organizationSlug_vehicles_by_listingSlug_photos_by_photoSlug"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    GetOOrganizationDDealershipPublicProfileResponse200Overrides: {
      address: null | string;
      facebookUrl: null | string;
      instagramUrl: null | string;
      publicEmail: null | string;
      publicPhone: null | string;
      tiktokUrl: null | string;
      whatsappMessage: null | string;
      whatsappNumber: null | string;
      youtubeUrl: null | string;
    };
    GetOOrganizationVehiclesVehicleSlugListingResponse200HistoryItemContentSpecifications: {
      [key: string]: null | string | number;
    };
    GetOOrganizationWebsiteResponse200Resolved:
      | components["schemas"]["GetOOrganizationWebsiteResponse200ResolvedVariant1"]
      | components["schemas"]["GetOOrganizationWebsiteResponse200ResolvedVariant2"]
      | components["schemas"]["GetOOrganizationWebsiteResponse200ResolvedVariant3"];
    GetOOrganizationWebsiteResponse200ResolvedVariant1: {
      origin: string;
      /** @constant */
      source: "registered";
    };
    GetOOrganizationWebsiteResponse200ResolvedVariant2: {
      origin: string;
      /** @constant */
      source: "fallback";
    };
    GetOOrganizationWebsiteResponse200ResolvedVariant3: {
      origin: null;
      /** @constant */
      source: "unconfigured";
    };
    GetPublicOOrganizationDDealershipAppraisalRequestsFormResponse200Variant2Limits: {
      maxEmails: number;
      maxPhones: number;
      messageMaxCharacters: number;
      nameMaxCharacters: number;
    };
    GetPublicOOrganizationDDealershipAppraisalRequestsFormResponse200Variant2PhotosVariant1ContentTypes: components["schemas"]["PostOOrganizationDDealershipAppraisalRequestsRequestReferencePhotosBodyContentType"][];
    GetPublicOOrganizationDDealershipProfileResponse200: {
      branding: components["schemas"]["GetPublicOOrganizationDDealershipProfileResponse200Branding"];
      company: {
        name: string;
        slug: string;
      };
      contact: components["schemas"]["GetOOrganizationDDealershipPublicProfileResponse200Overrides"];
      dealerships: components["schemas"]["GetPublicOOrganizationDDealershipProfileResponse200Dealerships"];
      website: components["schemas"]["GetOOrganizationWebsiteResponse200Resolved"];
    };
    GetPublicOOrganizationDDealershipProfileResponse200Branding: {
      accentColor: null | string;
      logo: null | {
        path: string;
      };
      primaryColor: null | string;
    };
    GetPublicOOrganizationDDealershipProfileResponse200Dealerships: {
      hasMore: boolean;
      items: components["schemas"]["GetPublicOOrganizationDDealershipProfileResponse200DealershipsItems"];
      limit: number;
      offset: number;
      total: number;
    };
    GetPublicOOrganizationDDealershipProfileResponse200DealershipsItems: components["schemas"]["GetPublicOOrganizationDDealershipProfileResponse200DealershipsItemsItem"][];
    GetPublicOOrganizationDDealershipProfileResponse200DealershipsItemsItem: {
      branding: components["schemas"]["GetPublicOOrganizationDDealershipProfileResponse200Branding"];
      city: null | string;
      contact: components["schemas"]["GetOOrganizationDDealershipPublicProfileResponse200Overrides"];
      name: string;
      path: string;
      slug: string;
    };
    GetPublicOOrganizationVehiclesResponse200FacetsDealership: components["schemas"]["GetPublicOOrganizationVehiclesResponse200FacetsDealershipItem"][];
    GetPublicOOrganizationVehiclesResponse200FacetsDealershipItem: {
      count: number;
      label: string;
      value: string;
    };
    GetPublicOOrganizationVehiclesResponse200ListingsItem: {
      askingPriceUsd: string;
      availability: "available" | "reserved" | "sold";
      company: {
        name: string;
        slug: string;
      };
      currency: string;
      dealership: components["schemas"]["GetPublicOOrganizationVehiclesResponse200ListingsItemDealership"];
      description: string;
      interestRequestsEnabled: boolean;
      path: string;
      photos: components["schemas"]["GetPublicOOrganizationVehiclesResponse200ListingsItemPhotos"];
      /** Format: date-time */
      publishedAt: string;
      slug: string;
      specifications: components["schemas"]["GetOOrganizationVehiclesVehicleSlugListingResponse200HistoryItemContentSpecifications"];
      title: string;
    };
    GetPublicOOrganizationVehiclesResponse200ListingsItemDealership: {
      address: null | string;
      city: null | string;
      name: string;
      publicEmail: null | string;
      publicPhone: null | string;
      slug: string;
    };
    GetPublicOOrganizationVehiclesResponse200ListingsItemPhotos: components["schemas"]["GetPublicOOrganizationVehiclesResponse200ListingsItemPhotosItem"][];
    GetPublicOOrganizationVehiclesResponse200ListingsItemPhotosItem: {
      altText: null | string;
      isCover: boolean;
      path: string;
      slug: string;
    };
    GetPublicOOrganizationVehiclesResponse200RangesYear: {
      max: null | number;
      min: null | number;
    };
    PostOOrganizationCustomersBodyContacts: components["schemas"]["PostOOrganizationCustomersBodyContactsItem"][];
    PostOOrganizationCustomersBodyContactsItem:
      | components["schemas"]["PostOOrganizationCustomersBodyContactsItemVariant1"]
      | components["schemas"]["PostOOrganizationCustomersBodyContactsItemVariant2"];
    PostOOrganizationCustomersBodyContactsItemVariant1: {
      countryCode?: null | string;
      /** @constant */
      kind: "phone";
      label?: null | string;
      value: string;
    };
    PostOOrganizationCustomersBodyContactsItemVariant2: {
      /** @constant */
      kind: "email";
      label?: null | string;
      value: string;
    };
    PostOOrganizationCustomersBodyPreferredContactChannel: null | "email" | "phone" | "whatsapp";
    PostOOrganizationDDealershipAppraisalRequestsRequestReferencePhotosBody: {
      altText?: string;
      byteSize: number;
      contentType: components["schemas"]["PostOOrganizationDDealershipAppraisalRequestsRequestReferencePhotosBodyContentType"];
      filename: string;
    };
    PostOOrganizationDDealershipAppraisalRequestsRequestReferencePhotosBodyContentType:
      | "image/heic"
      | "image/jpeg"
      | "image/png"
      | "image/webp";
    PostPublicOOrganizationDDealershipAppraisalRequestsBodyCustomer: {
      contacts: components["schemas"]["PostOOrganizationCustomersBodyContacts"];
      displayName: string;
      preferredContactChannel?: components["schemas"]["PostOOrganizationCustomersBodyPreferredContactChannel"];
    };
    Problem400: {
      /** @constant */
      code: "BAD_REQUEST";
      detail?: string;
      /** Format: uri */
      instance: string;
      /** Format: uuid */
      requestId: string;
      /** @constant */
      status: 400;
      /** @constant */
      title: "Bad Request";
      /** @constant */
      type: "about:blank";
    };
    Problem403: {
      /** @constant */
      code: "FORBIDDEN";
      detail?: string;
      /** Format: uri */
      instance: string;
      /** Format: uuid */
      requestId: string;
      /** @constant */
      status: 403;
      /** @constant */
      title: "Forbidden";
      /** @constant */
      type: "about:blank";
    };
    Problem404: {
      /** @constant */
      code: "NOT_FOUND";
      detail?: string;
      /** Format: uri */
      instance: string;
      /** Format: uuid */
      requestId: string;
      /** @constant */
      status: 404;
      /** @constant */
      title: "Not Found";
      /** @constant */
      type: "about:blank";
    };
    Problem409: {
      /** @constant */
      code: "CONFLICT";
      detail?: string;
      /** Format: uri */
      instance: string;
      /** Format: uuid */
      requestId: string;
      /** @constant */
      status: 409;
      /** @constant */
      title: "Conflict";
      /** @constant */
      type: "about:blank";
    };
    Problem412: {
      /** @constant */
      code: "PRECONDITION_FAILED";
      detail?: string;
      /** Format: uri */
      instance: string;
      /** Format: uuid */
      requestId: string;
      /** @constant */
      status: 412;
      /** @constant */
      title: "Precondition Failed";
      /** @constant */
      type: "about:blank";
    };
    Problem413: {
      /** @constant */
      code: "PAYLOAD_TOO_LARGE";
      detail?: string;
      /** Format: uri */
      instance: string;
      /** Format: uuid */
      requestId: string;
      /** @constant */
      status: 413;
      /** @constant */
      title: "Content Too Large";
      /** @constant */
      type: "about:blank";
    };
    Problem422: {
      /** @constant */
      code: "VALIDATION_FAILED";
      detail?: string;
      /** Format: uri */
      instance: string;
      /** Format: uuid */
      requestId: string;
      /** @constant */
      status: 422;
      /** @constant */
      title: "Unprocessable Content";
      /** @constant */
      type: "about:blank";
    };
    Problem428: {
      /** @constant */
      code: "PRECONDITION_REQUIRED";
      detail?: string;
      /** Format: uri */
      instance: string;
      /** Format: uuid */
      requestId: string;
      /** @constant */
      status: 428;
      /** @constant */
      title: "Precondition Required";
      /** @constant */
      type: "about:blank";
    };
    Problem429: {
      /** @constant */
      code: "RATE_LIMITED";
      detail?: string;
      /** Format: uri */
      instance: string;
      /** Format: uuid */
      requestId: string;
      /** @constant */
      status: 429;
      /** @constant */
      title: "Too Many Requests";
      /** @constant */
      type: "about:blank";
    };
    Problem499: {
      /** @constant */
      code: "REQUEST_CANCELLED";
      detail?: string;
      /** Format: uri */
      instance: string;
      /** Format: uuid */
      requestId: string;
      /** @constant */
      status: 499;
      /** @constant */
      title: "Client Closed Request";
      /** @constant */
      type: "about:blank";
    };
    Problem500: {
      /** @constant */
      code: "INTERNAL_ERROR";
      detail?: string;
      /** Format: uri */
      instance: string;
      /** Format: uuid */
      requestId: string;
      /** @constant */
      status: 500;
      /** @constant */
      title: "Internal Server Error";
      /** @constant */
      type: "about:blank";
    };
    Problem503: {
      /** @constant */
      code: "UNAVAILABLE";
      detail?: string;
      /** Format: uri */
      instance: string;
      /** Format: uuid */
      requestId: string;
      /** @constant */
      status: 503;
      /** @constant */
      title: "Service Unavailable";
      /** @constant */
      type: "about:blank";
    };
    Problem504: {
      /** @constant */
      code: "TIMEOUT";
      detail?: string;
      /** Format: uri */
      instance: string;
      /** Format: uuid */
      requestId: string;
      /** @constant */
      status: 504;
      /** @constant */
      title: "Gateway Timeout";
      /** @constant */
      type: "about:blank";
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  get_public_o_by_organizationSlug_branding_logo: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        organizationSlug: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Success. See the feature guide for lifecycle and representation rules. */
      200: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "image/webp": string;
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      400: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem400"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      404: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem404"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      413: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem413"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      422: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem422"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      499: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem499"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      500: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem500"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      503: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem503"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      504: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem504"];
        };
      };
    };
  };
  post_public_o_by_organizationSlug_d_by_dealershipSlug_appraisal_requests: {
    parameters: {
      query?: never;
      header: {
        /** @description Stable key for one logical operation. UUID for public submissions, financial and inventory workflows; staff appraisal keys accept 8–200 safe characters. See the feature guide for exact matching and retention rules. */
        "Idempotency-Key": string;
      };
      path: {
        dealershipSlug: string;
        organizationSlug: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": {
          customer: components["schemas"]["PostPublicOOrganizationDDealershipAppraisalRequestsBodyCustomer"];
          message?: null | string;
          photos?: components["schemas"]["PostOOrganizationDDealershipAppraisalRequestsRequestReferencePhotosBody"][];
          /** @constant */
          privacyAcknowledged: true;
          privacyVersion: string;
          turnstileToken: string;
          vehicle: {
            conditionDescription: string;
            expectedPriceUsd?: null | string;
            licensePlate?: null | string;
            modelYear: number;
            odometerUnit?: null | "km" | "mi";
            odometerValue?: null | number;
            submittedBrand: string;
            submittedCity: string;
            submittedModel: string;
            vin?: null | string;
          };
        };
      };
    };
    responses: {
      /** @description Success. See the feature guide for lifecycle and representation rules. */
      202: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @constant */
            accepted: true;
            photos: (
              | {
                  slug: string;
                  /** @constant */
                  state: "upload_closed";
                  upload: null;
                }
              | {
                  slug: string;
                  /** @constant */
                  state: "temporarily_unavailable";
                  upload: null;
                }
              | {
                  slug: string;
                  /** @constant */
                  state: "completion_accepted";
                  upload: null;
                }
              | {
                  slug: string;
                  /** @constant */
                  state: "upload_available";
                  upload: {
                    completePath: string;
                    /** Format: date-time */
                    completionExpiresAt: string;
                    completionToken: string;
                    /** Format: date-time */
                    expiresAt: string;
                    headers: {
                      [key: string]: string;
                    };
                    method: "GET" | "PUT";
                    url: string;
                  };
                }
            )[];
            reference: string;
          };
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      400: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem400"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      403: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem403"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      404: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem404"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      409: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem409"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      412: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem412"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      413: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem413"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      422: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem422"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      428: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem428"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      429: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Seconds to wait before retrying. */
          "Retry-After"?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem429"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      499: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem499"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      500: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem500"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      503: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem503"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      504: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem504"];
        };
      };
    };
  };
  post_public_o_by_organizationSlug_d_by_dealershipSlug_appraisal_requests_by_requestReference_photos_by_photoSlug_complete: {
    parameters: {
      query?: never;
      header: {
        /** @description Bearer completionToken returned for this exact photo by the public submission receipt. It expires with the original upload window and grants no read access. */
        Authorization: string;
      };
      path: {
        dealershipSlug: string;
        organizationSlug: string;
        photoSlug: string;
        requestReference: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Success. See the feature guide for lifecycle and representation rules. */
      202: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @constant */
            accepted: true;
          };
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      400: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem400"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      403: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem403"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      404: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem404"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      409: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem409"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      412: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem412"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      413: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem413"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      422: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem422"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      428: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem428"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      429: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Seconds to wait before retrying. */
          "Retry-After"?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem429"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      499: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem499"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      500: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem500"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      503: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem503"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      504: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem504"];
        };
      };
    };
  };
  get_public_o_by_organizationSlug_d_by_dealershipSlug_appraisal_requests_form: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        dealershipSlug: string;
        organizationSlug: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Success. See the feature guide for lifecycle and representation rules. */
      200: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json":
            | {
                company?: never;
                dealership?: never;
                enabled: boolean;
                limits?: never;
                photos?: never;
                privacyNotice?: never;
                turnstile?: never;
              }
            | {
                company: {
                  name: string;
                  slug: string;
                };
                dealership: {
                  name: string;
                  slug: string;
                };
                enabled: boolean;
                limits: components["schemas"]["GetPublicOOrganizationDDealershipAppraisalRequestsFormResponse200Variant2Limits"];
                photos:
                  | {
                      contentTypes: components["schemas"]["GetPublicOOrganizationDDealershipAppraisalRequestsFormResponse200Variant2PhotosVariant1ContentTypes"];
                      /** @constant */
                      enabled: false;
                      maxPhotos?: never;
                      maxUploadBytes?: never;
                      uploadSeconds?: never;
                    }
                  | {
                      contentTypes: components["schemas"]["GetPublicOOrganizationDDealershipAppraisalRequestsFormResponse200Variant2PhotosVariant1ContentTypes"];
                      /** @constant */
                      enabled: true;
                      maxPhotos: number;
                      maxUploadBytes: number;
                      uploadSeconds: number;
                    };
                privacyNotice: {
                  url: null | string;
                  version: null | string;
                };
                turnstile: {
                  action: string;
                  siteKey: string;
                };
              };
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      400: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem400"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      404: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem404"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      413: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem413"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      422: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem422"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      499: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem499"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      500: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem500"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      503: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem503"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      504: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem504"];
        };
      };
    };
  };
  get_public_o_by_organizationSlug_d_by_dealershipSlug_branding_logo: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        dealershipSlug: string;
        organizationSlug: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Success. See the feature guide for lifecycle and representation rules. */
      200: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "image/webp": string;
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      400: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem400"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      404: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem404"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      413: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem413"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      422: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem422"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      499: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem499"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      500: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem500"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      503: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem503"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      504: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem504"];
        };
      };
    };
  };
  get_public_o_by_organizationSlug_d_by_dealershipSlug_profile: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        dealershipSlug: string;
        organizationSlug: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Success. See the feature guide for lifecycle and representation rules. */
      200: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["GetPublicOOrganizationDDealershipProfileResponse200"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      400: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem400"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      404: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem404"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      413: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem413"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      422: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem422"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      499: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem499"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      500: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem500"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      503: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem503"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      504: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem504"];
        };
      };
    };
  };
  get_public_o_by_organizationSlug_profile: {
    parameters: {
      query?: {
        limit?: unknown;
        offset?: unknown;
      };
      header?: never;
      path: {
        organizationSlug: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Success. See the feature guide for lifecycle and representation rules. */
      200: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["GetPublicOOrganizationDDealershipProfileResponse200"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      400: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem400"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      404: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem404"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      413: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem413"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      422: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem422"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      499: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem499"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      500: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem500"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      503: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem503"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      504: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem504"];
        };
      };
    };
  };
  get_public_o_by_organizationSlug_vehicles: {
    parameters: {
      query?: {
        availability?: ("available" | "reserved")[];
        brand?: string[];
        city?: string[];
        condition?: ("new" | "used")[];
        dealership?: string[];
        fuelType?: string[];
        limit?: string | number;
        mileageMaxKm?: string | number;
        mileageMinKm?: string | number;
        model?: string[];
        offset?: string | number;
        priceMax?: string;
        priceMin?: string;
        search?: string;
        sort?:
          | "mileage_asc"
          | "mileage_desc"
          | "newest"
          | "price_asc"
          | "price_desc"
          | "year_asc"
          | "year_desc";
        transmission?: string[];
        vehicleType?: string[];
        yearMax?: string | number;
        yearMin?: string | number;
      };
      header?: never;
      path: {
        organizationSlug: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Success. See the feature guide for lifecycle and representation rules. */
      200: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            facets: {
              availability: components["schemas"]["GetPublicOOrganizationVehiclesResponse200FacetsDealership"];
              brand: components["schemas"]["GetPublicOOrganizationVehiclesResponse200FacetsDealership"];
              city: components["schemas"]["GetPublicOOrganizationVehiclesResponse200FacetsDealership"];
              condition: components["schemas"]["GetPublicOOrganizationVehiclesResponse200FacetsDealership"];
              dealership: components["schemas"]["GetPublicOOrganizationVehiclesResponse200FacetsDealership"];
              fuelType: components["schemas"]["GetPublicOOrganizationVehiclesResponse200FacetsDealership"];
              model: components["schemas"]["GetPublicOOrganizationVehiclesResponse200FacetsDealership"];
              transmission: components["schemas"]["GetPublicOOrganizationVehiclesResponse200FacetsDealership"];
              vehicleType: components["schemas"]["GetPublicOOrganizationVehiclesResponse200FacetsDealership"];
            };
            hasMore: boolean;
            limit: number;
            listings: components["schemas"]["GetPublicOOrganizationVehiclesResponse200ListingsItem"][];
            offset: number;
            ranges: {
              mileageKm: components["schemas"]["GetPublicOOrganizationVehiclesResponse200RangesYear"];
              priceUsd: {
                max: null | string;
                min: null | string;
              };
              year: components["schemas"]["GetPublicOOrganizationVehiclesResponse200RangesYear"];
            };
            sort:
              | "mileage_asc"
              | "mileage_desc"
              | "newest"
              | "price_asc"
              | "price_desc"
              | "year_asc"
              | "year_desc";
            total: number;
          };
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      400: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem400"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      404: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem404"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      413: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem413"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      422: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem422"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      499: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem499"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      500: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem500"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      503: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem503"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      504: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem504"];
        };
      };
    };
  };
  get_public_o_by_organizationSlug_vehicles_by_listingSlug: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        listingSlug: string;
        organizationSlug: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Success. See the feature guide for lifecycle and representation rules. */
      200: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["GetPublicOOrganizationVehiclesResponse200ListingsItem"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      400: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem400"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      404: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem404"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      413: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem413"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      422: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem422"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      499: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem499"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      500: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem500"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      503: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem503"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      504: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem504"];
        };
      };
    };
  };
  post_public_o_by_organizationSlug_vehicles_by_listingSlug_interest_requests: {
    parameters: {
      query?: never;
      header: {
        /** @description Stable key for one logical operation. UUID for public submissions, financial and inventory workflows; staff appraisal keys accept 8–200 safe characters. See the feature guide for exact matching and retention rules. */
        "Idempotency-Key": string;
      };
      path: {
        listingSlug: string;
        organizationSlug: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": {
          customer: components["schemas"]["PostPublicOOrganizationDDealershipAppraisalRequestsBodyCustomer"];
          message?: null | string;
          /** @constant */
          privacyAcknowledged: true;
          privacyVersion: string;
          turnstileToken: string;
        };
      };
    };
    responses: {
      /** @description Success. See the feature guide for lifecycle and representation rules. */
      202: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @constant */
            accepted: true;
          };
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      400: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem400"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      403: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem403"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      404: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem404"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      409: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem409"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      412: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem412"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      413: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem413"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      422: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem422"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      428: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem428"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      429: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Seconds to wait before retrying. */
          "Retry-After"?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem429"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      499: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem499"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      500: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem500"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      503: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem503"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      504: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem504"];
        };
      };
    };
  };
  get_public_o_by_organizationSlug_vehicles_by_listingSlug_interest_requests_form: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        listingSlug: string;
        organizationSlug: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Success. See the feature guide for lifecycle and representation rules. */
      200: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json":
            | {
                enabled: boolean;
                limits?: never;
                privacyNotice?: never;
                turnstile?: never;
              }
            | {
                enabled: boolean;
                limits: components["schemas"]["GetPublicOOrganizationDDealershipAppraisalRequestsFormResponse200Variant2Limits"];
                privacyNotice: {
                  url: string;
                  version: string;
                };
                turnstile: {
                  action: string;
                  siteKey: string;
                };
              };
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      400: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem400"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      404: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem404"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      413: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem413"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      422: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem422"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      499: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem499"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      500: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem500"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      503: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem503"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      504: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem504"];
        };
      };
    };
  };
  get_public_o_by_organizationSlug_vehicles_by_listingSlug_photos_by_photoSlug: {
    parameters: {
      query: {
        variant: "card" | "gallery" | "thumbnail";
      };
      header?: never;
      path: {
        listingSlug: string;
        organizationSlug: string;
        photoSlug: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Success. See the feature guide for lifecycle and representation rules. */
      200: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "image/webp": string;
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      400: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem400"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      404: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem404"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      413: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem413"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      422: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem422"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      499: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem499"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      500: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem500"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      503: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem503"];
        };
      };
      /** @description Failure; inspect the status and stable problem code. Readiness also returns its health payload. */
      504: {
        headers: {
          /** @description Present on versioned resource/account/gallery responses. Use the correct version source documented for the command. */
          ETag?: string;
          /** @description Request correlation identifier. */
          "X-Request-ID"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/problem+json": components["schemas"]["Problem504"];
        };
      };
    };
  };
}
