import { expect, test } from "bun:test";
import { parseVehicleFilters, serializeVehicleFilters, updateVehicleFilters } from "@sdk";

test("filter URLs round-trip selections, literal punctuation, decimals and zero bounds", () => {
  const filters = {
    search: "Toyota + ñ & %",
    brand: ["toyota", "mazda"],
    priceMin: "0.00",
    priceMax: "9999999999.99",
    mileageMinKm: 0,
    mileageMaxKm: 123.456789,
    yearMin: 2020,
    limit: 25,
    offset: 0,
  };

  expect(parseVehicleFilters(serializeVehicleFilters(filters))).toEqual(filters);
  expect(parseVehicleFilters(new URLSearchParams("?brand=a%2Cb&brand=unknown"))).toEqual({
    brand: ["a,b", "unknown"],
  });
});

test("changing filters resets offset without losing selections absent from facets", () => {
  const current = { brand: ["unknown"], city: ["quito"], offset: 50, limit: 25 };
  const updated = updateVehicleFilters(current, { city: [] });

  expect(updated).toEqual({ brand: ["unknown"], limit: 25, offset: 0 });
  expect(current.offset).toBe(50);
  expect(current.city).toEqual(["quito"]);
  expect(serializeVehicleFilters({ brand: [] })).toBe("");
});

test.each([
  "sort=wrong",
  "sort=newest&sort=newest",
  "unknown=1",
  "__proto__=x",
  "brand=",
  "search=+",
  "priceMin=1.001",
  "priceMin=2&priceMax=1",
  "yearMin=0",
  "yearMax=32768",
  "mileageMinKm=-1",
  "mileageMaxKm=0.0000001",
  "limit=101",
  "limit=1.0",
  "offset=100001",
  "offset=",
  "limit=Infinity",
  "availability=sold",
  "condition=new&condition=used&condition=new",
])("rejects invalid filter query %s", (query) => {
  expect(() => parseVehicleFilters(query)).toThrow(TypeError);
});

test("scalar filters can be cleared explicitly", () => {
  expect(
    updateVehicleFilters(
      { search: "toyota", priceMin: "100.00", offset: 25 },
      { search: undefined, priceMin: undefined },
    ),
  ).toEqual({ offset: 0 });
});
