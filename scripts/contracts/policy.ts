export interface PublicOperation {
  readonly method: "get" | "post";
  readonly path: string;
}

export const PUBLIC_OPERATIONS = [
  { method: "get", path: "/public/o/{organizationSlug}/profile" },
  { method: "get", path: "/public/o/{organizationSlug}/branding/logo" },
  { method: "get", path: "/public/o/{organizationSlug}/d/{dealershipSlug}/profile" },
  { method: "get", path: "/public/o/{organizationSlug}/d/{dealershipSlug}/branding/logo" },
  { method: "get", path: "/public/o/{organizationSlug}/vehicles" },
  { method: "get", path: "/public/o/{organizationSlug}/vehicles/{listingSlug}" },
  { method: "get", path: "/public/o/{organizationSlug}/vehicles/{listingSlug}/photos/{photoSlug}" },
  {
    method: "get",
    path: "/public/o/{organizationSlug}/vehicles/{listingSlug}/interest-requests/form",
  },
  { method: "post", path: "/public/o/{organizationSlug}/vehicles/{listingSlug}/interest-requests" },
  {
    method: "get",
    path: "/public/o/{organizationSlug}/d/{dealershipSlug}/appraisal-requests/form",
  },
  { method: "post", path: "/public/o/{organizationSlug}/d/{dealershipSlug}/appraisal-requests" },
  {
    method: "post",
    path: "/public/o/{organizationSlug}/d/{dealershipSlug}/appraisal-requests/{requestReference}/photos/{photoSlug}/complete",
  },
] as const satisfies readonly PublicOperation[];
