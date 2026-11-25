export const FACET_KEYS = [
  "dealership",
  "city",
  "brand",
  "model",
  "condition",
  "fuelType",
  "transmission",
  "vehicleType",
  "availability",
] as const;

export const SORTS = [
  "newest",
  "price_asc",
  "price_desc",
  "year_asc",
  "year_desc",
  "mileage_asc",
  "mileage_desc",
] as const;

export const NUMBER_KEYS = [
  "yearMin",
  "yearMax",
  "mileageMinKm",
  "mileageMaxKm",
  "limit",
  "offset",
] as const;

export const STRING_KEYS = ["search", "priceMin", "priceMax", "sort"] as const;
