import type { VehicleFilters, VehicleFilterChanges } from "@features/vehicles/types";

import { FACET_KEYS, NUMBER_KEYS, SORTS, STRING_KEYS } from "@features/vehicles/constants";
import { isRecord } from "@shared/api/response";

const invalidFilter: (key: string) => never = (key) => {
  throw new TypeError(`Invalid vehicle filter: ${key}.`);
};

const assertFilters: (value: unknown) => asserts value is VehicleFilters = (value) => {
  if (!isRecord(value)) {
    invalidFilter("filters");
  }

  for (const [key, entry] of Object.entries(value)) {
    if (![...FACET_KEYS, ...NUMBER_KEYS, ...STRING_KEYS].some((known) => known === key)) {
      invalidFilter(key);
    }

    if (entry === undefined) {
      continue;
    }

    if (FACET_KEYS.some((facet) => facet === key)) {
      const choices = key === "condition" ? ["new", "used"] : undefined;
      const allowed = key === "availability" ? ["available", "reserved"] : choices;

      if (
        !Array.isArray(entry) ||
        entry.length > (allowed ? 2 : 20) ||
        !entry.every(
          (item: unknown) =>
            typeof item === "string" &&
            item.trim().length > 0 &&
            item.trim().length <= 500 &&
            (!allowed || allowed.includes(item)),
        )
      ) {
        invalidFilter(key);
      }
    } else if (key === "search") {
      if (typeof entry !== "string" || !entry.trim() || entry.trim().length > 200) {
        invalidFilter(key);
      }
    } else if (key === "sort") {
      if (!SORTS.some((sort) => sort === entry)) {
        invalidFilter(key);
      }
    } else if (key === "priceMin" || key === "priceMax") {
      if (typeof entry !== "string" || !/^\d{1,10}(?:\.\d{1,2})?$/u.test(entry)) {
        invalidFilter(key);
      }
    } else {
      if (typeof entry !== "number" || !Number.isFinite(entry)) {
        invalidFilter(key);
      }

      if (key === "mileageMinKm" || key === "mileageMaxKm") {
        if (entry < 0 || entry > 9999999999 || !/^\d{1,10}(?:\.\d{1,6})?$/u.test(String(entry))) {
          invalidFilter(key);
        }
      } else {
        const maximum = key === "limit" ? 100 : 32767;

        if (
          !Number.isInteger(entry) ||
          entry < (key === "offset" ? 0 : 1) ||
          entry > (key === "offset" ? 100000 : maximum)
        ) {
          invalidFilter(key);
        }
      }
    }
  }

  for (const [min, max] of [
    ["priceMin", "priceMax"],
    ["yearMin", "yearMax"],
    ["mileageMinKm", "mileageMaxKm"],
  ] as const) {
    if (
      value[min] !== undefined &&
      value[max] !== undefined &&
      Number(value[min]) > Number(value[max])
    ) {
      invalidFilter(max);
    }
  }
};

/** Serializes only inventory state; arrays use repeated parameters. Empty arrays clear a filter. */
export const serializeVehicleFilters = (filters: VehicleFilters = {}): string => {
  assertFilters(filters);

  const params = new URLSearchParams();

  for (const key of [...STRING_KEYS, ...FACET_KEYS, ...NUMBER_KEYS]) {
    const value = filters[key];

    if (value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, item);
      }
    } else {
      params.set(key, String(value));
    }
  }

  return params.toString();
};

/** Parses an inventory query (not a whole URL). Unknown keys and repeated scalars throw TypeError. */
export const parseVehicleFilters = (query: string | URLSearchParams): VehicleFilters => {
  const params = new URLSearchParams(query);
  const filters: Record<string, unknown> = {};

  for (const key of new Set(params.keys())) {
    if (![...FACET_KEYS, ...NUMBER_KEYS, ...STRING_KEYS].some((known) => known === key)) {
      invalidFilter(key);
    }

    const values = params.getAll(key);

    if (FACET_KEYS.some((facet) => facet === key)) {
      filters[key] = values;
    } else {
      const value = values[0];

      if (values.length !== 1 || value === undefined) {
        invalidFilter(key);
      }

      if (NUMBER_KEYS.some((numberKey) => numberKey === key)) {
        const pattern =
          key === "mileageMinKm" || key === "mileageMaxKm"
            ? /^\d{1,10}(?:\.\d{1,6})?$/u
            : /^\d{1,10}$/u;

        if (!pattern.test(value)) {
          invalidFilter(key);
        }
        filters[key] = Number(value);
      } else {
        filters[key] = value;
      }
    }
  }

  assertFilters(filters);

  return filters;
};

/** Applies changed filters, clearing offset. Use list directly to move between pages. */
export const updateVehicleFilters = (
  current: VehicleFilters,
  changes: VehicleFilterChanges,
): VehicleFilters => {
  const updated = { ...current, ...changes, offset: 0 };
  assertFilters(updated);

  return parseVehicleFilters(serializeVehicleFilters(updated));
};
