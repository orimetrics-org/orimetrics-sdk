# Vehicle browsing

The core uses public inventory endpoints in the pinned contract. All reads inherit the shared
transport's deadlines, cancellation, safe errors, omitted credentials and no-store behavior.
No filtering, availability calculation, caching or automatic retries run on the client.

```ts
import {
  createOrimetricsClient,
  parseVehicleFilters,
  serializeVehicleFilters,
  updateVehicleFilters,
} from "@orimetrics/sdk";

const client = createOrimetricsClient({
  baseUrl: "https://your-api.example",
  organizationSlug: "your-company",
});

const filters = parseVehicleFilters("brand=toyota&brand=mazda&sort=price_asc");
const controller = new AbortController();
const page = await client.vehicles.list(filters, { signal: controller.signal });
const changed = updateVehicleFilters(filters, { city: ["quito"], priceMax: "25000.00" });
const query = serializeVehicleFilters(changed); // No leading question mark.
const next = page.hasMore
  ? await client.vehicles.list({ ...filters, limit: page.limit, offset: page.offset + page.limit })
  : undefined;
```

`list(filters?, options?)` returns `VehiclePage`: listings, total, limit, offset, hasMore, sort,
facets and ranges. Defaults remain server-owned (25 items, offset 0, newest first). Limit is 1–100;
offset is 0–100000. Check the offset bound before advancing unusually large catalogs. Inventory can
change between pages; cancel superseded requests and avoid rendering stale results in the website.

Filters include search, dealership, city, brand, model, condition, fuelType, transmission, vehicleType,
availability, priceMin/Max, yearMin/Max, mileageMinKm/MaxKm, sort, limit and offset. Category arrays
serialize as repeated parameters. Use facet `value` fields, not labels or private catalog IDs.
Selections use OR within a category and AND across categories. The server owns search normalization,
sorting and facet counts. Retain selections independently when options disappear from a response.

Money remains decimal strings with at most two decimal places. Year, mileage, limit and offset are
numbers in the SDK; URL parsing converts them. Mileage filters are kilometers with at most six decimal
places; published specification values and units remain unchanged. Ranges are inclusive. Null response
bounds mean no known matching values. Sort accepts `newest`, `price_asc`, `price_desc`, `year_asc`,
`year_desc`, `mileage_asc` and `mileage_desc`.

The pure query helpers do not access location, history or storage. Parsing accepts a query string or
URLSearchParams, not a complete URL. Unknown keys, duplicate scalar keys, empty selections and invalid
bounds throw TypeError. Extract inventory parameters before parsing a URL containing tracking or other
website state. Serialization omits empty arrays. `updateVehicleFilters` resets offset to zero,
preserves other selections, and accepts undefined to clear a scalar or an empty array to clear a category.
These checks improve feedback; server validation remains authoritative.

## Details and images

```ts
const listing = await client.vehicles.get("published-listing-slug", { timeoutMs: 5000 });
const cover = listing.photos.find((photo) => photo.isCover) ?? listing.photos[0];
const imageUrl = cover ? client.vehicles.photoUrl(listing.slug, cover.slug, "card") : null;
```

Detail results include string prices/dates, specifications, dealership contact information, photos,
availability and interestRequestsEnabled. Sold listings can still have a detail page; discovery only
includes available/reserved listings. A hidden, withdrawn or missing listing produces an HTTP 404
OrimetricsError. Unexpected response shapes produce a protocol error, including numeric money values.
The SDK preserves additional server fields and nullable fields without translating them.

`photoUrl(listingSlug, photoSlug, variant)` requires `thumbnail`, `card` or `gallery`. It constructs a
scoped absolute URL with encoded slugs and no network request. It does not prove the photo exists.
Use returned altText and handle missing images in the website. These URL builders do not fetch images
through the SDK transport; browser image elements control their own requests. For credential omission
on image elements use `crossOrigin="anonymous"` and configure the API's CORS response appropriately.
Do not bypass server visibility checks with persistent image caching.

## Public profiles and branding

`organization.getProfile({ limit?, offset?, signal?, timeoutMs? })` returns the public organization
profile. `dealerships.getProfile(slug, { signal?, timeoutMs? })` returns the same contract shape with
resolved dealership profile data. The organization feature owns both APIs.

`organization.logoUrl()` and `dealerships.logoUrl(slug)` build absolute branding URLs without requests.
Check `profile.branding.logo` before rendering; a URL helper does not imply a configured logo.
Contact values, website configuration, branding colors and logo availability remain nullable as defined
by the contract. The SDK does not choose website layouts or fallback images.
