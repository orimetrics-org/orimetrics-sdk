import type { OrganizationProfile } from "@sdk";

export const createProfile = (): OrganizationProfile => ({
  company: { name: "Demo Motors", slug: "demo" },
  website: { source: "unconfigured", origin: null },
  contact: {
    publicPhone: null,
    publicEmail: null,
    address: null,
    facebookUrl: null,
    instagramUrl: null,
    tiktokUrl: null,
    youtubeUrl: null,
    whatsappNumber: null,
    whatsappMessage: null,
  },
  branding: { primaryColor: null, accentColor: null, logo: null },
  dealerships: { items: [], total: 0, limit: 25, offset: 0, hasMore: false },
});
