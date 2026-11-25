import type { OrimetricsFetch } from "@sdk";

import { expect, test } from "bun:test";
import { createOrimetricsClient } from "@sdk";
import { createListing, createPage } from "../fixtures/vehicles";
import { createProfile } from "../fixtures/profile";

const clientWith = (fetch: OrimetricsFetch) =>
  createOrimetricsClient({
    baseUrl: "https://api.example.test/v1/",
    organizationSlug: "demo",
    fetch,
  });

test("lists with repeated selections, exact money, ranges and pagination", async () => {
  const page = createPage();
  const client = clientWith(async (request, init) => {
    const url = new URL(request.url);

    expect(url.pathname).toBe("/v1/public/o/demo/vehicles");
    expect(url.searchParams.getAll("brand")).toEqual(["toyota", "mazda"]);
    expect(url.searchParams.get("search")).toBe("a+b & ñ");
    expect(url.searchParams.get("priceMin")).toBe("10000.00");
    expect(url.searchParams.get("mileageMaxKm")).toBe("1500.123456");
    expect(url.searchParams.get("offset")).toBe("25");
    expect(url.searchParams.get("sort")).toBe("price_asc");
    expect(init.credentials).toBe("omit");

    return Response.json(page);
  });

  expect(
    await client.vehicles.list({
      brand: ["toyota", "mazda"],
      search: "a+b & ñ",
      priceMin: "10000.00",
      mileageMaxKm: 1500.123456,
      sort: "price_asc",
      offset: 25,
    }),
  ).toEqual(page);
});

test("keeps empty-page metadata and nullable ranges", async () => {
  const page = { ...createPage(), listings: [], offset: 100, total: 1 };
  const client = clientWith(async () => Response.json(page));

  expect(await client.vehicles.list({ offset: 100 })).toEqual(page);
});

test("sold details retain published prices, units and nullable fields", async () => {
  const listing = { ...createListing(), availability: "sold" as const };
  const client = clientWith(async (request) => {
    expect(new URL(request.url).pathname).toBe("/v1/public/o/demo/vehicles/toyota-%C3%B1");

    return Response.json(listing);
  });

  expect(await client.vehicles.get("toyota-ñ")).toEqual(listing);
});

test.each([
  { ...createListing(), askingPriceUsd: 25000 },
  { ...createListing(), availability: "hidden" },
  { ...createListing(), photos: [{ slug: "cover" }] },
  { ...createListing(), specifications: { year: true } },
])("rejects malformed detail responses", async (listing) => {
  const client = clientWith(async () => Response.json(listing));

  await expect(client.vehicles.get("listing")).rejects.toMatchObject({ kind: "protocol" });
});

test.each([
  { ...createPage(), facets: {} },
  { ...createPage(), ranges: { priceUsd: { min: 100, max: 200 } } },
  { ...createPage(), listings: [{}] },
])("rejects malformed collection responses", async (page) => {
  await expect(clientWith(async () => Response.json(page)).vehicles.list()).rejects.toMatchObject({
    kind: "protocol",
  });
});

test("unavailable listings use the existing safe HTTP error boundary", async () => {
  await expect(
    clientWith(async () => new Response("private details", { status: 404 })).vehicles.get(
      "missing",
    ),
  ).rejects.toMatchObject({ kind: "http", status: 404 });
});

test("supports request deadlines and caller cancellation", async () => {
  const client = clientWith(() => new Promise(() => {}));

  await expect(client.vehicles.list({}, { timeoutMs: 5 })).rejects.toMatchObject({
    kind: "timeout",
  });
  await expect(
    client.vehicles.get("listing", { signal: AbortSignal.abort() }),
  ).rejects.toMatchObject({ name: "AbortError" });
});

test("image and branding helpers are scoped, encoded and perform no requests", () => {
  const client = clientWith(async () => {
    throw new Error("Unexpected request");
  });

  expect(client.vehicles.photoUrl("toyota-ñ", "café", "card")).toBe(
    "https://api.example.test/v1/public/o/demo/vehicles/toyota-%C3%B1/photos/caf%C3%A9?variant=card",
  );
  expect(client.organization.logoUrl()).toBe(
    "https://api.example.test/v1/public/o/demo/branding/logo",
  );
  expect(client.dealerships.logoUrl("norte")).toBe(
    "https://api.example.test/v1/public/o/demo/d/norte/branding/logo",
  );
});

test.each(["..", ".", "%2e%2e", "a/b", "a\\b", "a?b", "a#b", ""])(
  "rejects unsafe path segments before fetching",
  async (slug) => {
    const client = clientWith(async () => {
      throw new Error("Unexpected request");
    });

    await expect(client.vehicles.get(slug)).rejects.toBeInstanceOf(TypeError);
    await expect(client.dealerships.getProfile(slug)).rejects.toBeInstanceOf(TypeError);
    expect(() => client.vehicles.photoUrl("listing", slug, "gallery")).toThrow(TypeError);
    expect(() => client.dealerships.logoUrl(slug)).toThrow(TypeError);
  },
);

test("dealership profiles reuse the contract profile shape", async () => {
  const profile = createProfile();
  const client = clientWith(async (request) => {
    expect(new URL(request.url).pathname).toBe("/v1/public/o/demo/d/norte/profile");

    return Response.json(profile);
  });

  expect(await client.dealerships.getProfile("norte")).toEqual(profile);
});
