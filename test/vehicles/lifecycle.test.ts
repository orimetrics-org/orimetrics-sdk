import type { VehicleFilterChanges } from "@sdk";

import { expect, test } from "bun:test";
import { createOrimetricsClient, parseVehicleFilters, updateVehicleFilters } from "@sdk";
import { createPage } from "../fixtures/vehicles";

const OPTIONS = { baseUrl: "https://example.test", organizationSlug: "demo" } as const;

test("filter updates reset pagination even for an empty patch or explicit offset", () => {
  const current = { brand: ["toyota"], offset: 50, limit: 25 };
  const patches: VehicleFilterChanges[] = [
    {},
    { offset: 75 },
    { sort: "price_asc" },
    { limit: 50 },
  ];

  for (const patch of patches) {
    const updated = updateVehicleFilters(current, patch);

    expect(updated.offset).toBe(0);
    expect(updated.brand).toEqual(["toyota"]);
  }

  // URL restoration is a separate transition and preserves its requested page.
  expect(parseVehicleFilters("brand=toyota&offset=50&limit=25")).toEqual(current);
});

test("failed range edits are atomic and valid edits detach all category arrays", () => {
  const current = { brand: ["toyota"], priceMin: "100.00", priceMax: "200.00", offset: 25 };
  const changes = { city: ["quito"] };

  expect(() => updateVehicleFilters(current, { priceMin: "300.00" })).toThrow(TypeError);
  expect(current).toEqual({
    brand: ["toyota"],
    priceMin: "100.00",
    priceMax: "200.00",
    offset: 25,
  });
  const updated = updateVehicleFilters(current, changes);
  current.brand.push("mazda");
  changes.city.push("cuenca");

  expect(updated).toEqual({
    brand: ["toyota"],
    city: ["quito"],
    priceMin: "100.00",
    priceMax: "200.00",
    offset: 0,
  });
});

test("clearing selections preserves zero bounds and never infers choices from facets", () => {
  const updated = updateVehicleFilters(
    {
      brand: ["unknown"],
      city: ["quito"],
      search: "toyota",
      mileageMinKm: 0,
      priceMin: "0.00",
      offset: 25,
    },
    { city: [], search: undefined },
  );

  expect(updated).toEqual({ brand: ["unknown"], mileageMinKm: 0, priceMin: "0.00", offset: 0 });
});

test("concurrent requests snapshot filters and resolve independently in arrival order", async () => {
  const requests: { url: URL; finish: (response: Response) => void }[] = [];
  const client = createOrimetricsClient({
    ...OPTIONS,
    fetch: (request) =>
      new Promise((finish) => {
        requests.push({ url: new URL(request.url), finish });
      }),
  });
  const filters = { brand: ["toyota"], offset: 25 };
  const older = client.vehicles.list(filters);
  filters.brand.push("mazda");
  filters.offset = 50;
  const newer = client.vehicles.list(filters);
  const first = requests[0];
  const second = requests[1];

  if (!first || !second) {
    throw new Error("Expected two independent requests.");
  }

  expect(first.url.searchParams.getAll("brand")).toEqual(["toyota"]);
  expect(first.url.searchParams.get("offset")).toBe("25");
  expect(second.url.searchParams.getAll("brand")).toEqual(["toyota", "mazda"]);
  expect(second.url.searchParams.get("offset")).toBe("50");
  const newerPage = { ...createPage(), offset: 50, total: 51 };
  second.finish(Response.json(newerPage));

  expect(await newer).toEqual(newerPage);
  const olderPage = { ...createPage(), offset: 25, total: 26 };
  first.finish(Response.json(olderPage));

  // The SDK must not cancel or overwrite another component's request on the same client.
  expect(await older).toEqual(olderPage);
});

test("an empty page is successful data, preserving selections and available navigation metadata", async () => {
  const filters = { brand: ["unknown"], offset: 50 };
  const page = { ...createPage(), listings: [], total: 1, offset: 50, hasMore: false };
  const client = createOrimetricsClient({ ...OPTIONS, fetch: async () => Response.json(page) });

  expect(await client.vehicles.list(filters)).toEqual(page);
  expect(filters).toEqual({ brand: ["unknown"], offset: 50 });
});
