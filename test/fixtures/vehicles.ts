import type { VehicleListing, VehiclePage } from "@sdk";

export const createListing = (): VehicleListing => ({
  slug: "toyota-2024",
  path: "/vehicles/toyota-2024",
  title: "Toyota 2024",
  description: "Published description",
  askingPriceUsd: "25000.00",
  currency: "USD",
  specifications: { year: 2024, mileage: 1500, mileageUnit: "mi", color: null },
  availability: "available",
  company: { name: "Demo", slug: "demo" },
  dealership: {
    name: "North",
    slug: "north",
    address: null,
    publicPhone: null,
    publicEmail: null,
    city: "Quito",
  },
  publishedAt: "2026-01-01T00:00:00Z",
  interestRequestsEnabled: false,
  photos: [
    { slug: "cover", isCover: true, altText: null, path: "/vehicles/toyota-2024/photos/cover" },
  ],
});

export const createPage = (): VehiclePage => ({
  listings: [createListing()],
  limit: 25,
  offset: 0,
  total: 1,
  hasMore: false,
  sort: "newest",
  facets: {
    dealership: [],
    city: [],
    brand: [{ value: "toyota", label: "Toyota", count: 1 }],
    model: [],
    condition: [],
    fuelType: [],
    transmission: [],
    vehicleType: [],
    availability: [],
  },
  ranges: {
    priceUsd: { min: "25000.00", max: "25000.00" },
    year: { min: 2024, max: 2024 },
    mileageKm: { min: null, max: null },
  },
});
