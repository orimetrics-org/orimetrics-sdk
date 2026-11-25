# Public API contract

This directory pins the SDK's public transport contract independently of Engine deployment and SDK
versions. `openapi.json` contains 12 explicitly selected operations and their 41 reachable schemas,
initially imported from `@orimetrics/api-contract` **1.0.59**. It contains no session security schemes,
backend types, deployment URLs, or unselected endpoints. The snapshot remains development input;
transport types are internal and are not re-exported from the SDK root.

## Commands

From the SDK repository:

```sh
# Explicitly update from a generated Engine contract directory or extracted contract archive.
bun run contracts:update --source ../orimetrics-engine/contracts

# Regenerate TypeScript using only the pinned public snapshot.
bun run contracts:generate

# Read-only local/CI integrity and drift check; no backend checkout or network access required.
bun run contracts:check

# Optional: also compare the snapshot and provenance against a particular upstream artifact.
bun run contracts:check --source ../orimetrics-engine/contracts
```

The source directory must contain `openapi.json`, `manifest.json`, and `package.json`. Import verifies
that OpenAPI bytes match the Engine manifest's SHA-256 and that all source versions agree. Hashes
provide integrity and reproducibility, not a signature or proof of publisher identity. Use a trusted
Engine artifact. Its other files are neither loaded nor copied.

`manifest.json` records the source package/version/hash, the public-operation policy hash, generator
versions, and hashes of the snapshot and generated types. No timestamp, local path or deployment
configuration enters the artifact. It intentionally records the hash of the full upstream OpenAPI,
so optional upstream checks also flag an upstream change that only affects private endpoints.

The operation allowlist lives in `scripts/contracts/policy.ts`. Review changes to that list explicitly;
a newly added public backend route does not become an SDK operation automatically. Imports fail for
missing operations, duplicate IDs, inherited/session security, unsupported composition, unresolved
references or external references. The current projection supports local named schema references,
including cycles. Other OpenAPI reference categories and discriminator mappings need explicit support
before import; they are never silently fetched or discarded.

Projection keeps operation payloads, responses and parameters unchanged, including required headers.
It removes upstream operation `externalDocs` links and replaces their generic description because
those refer to full-backend guides not shipped here. Root metadata is intentionally reconstructed;
only reachable schemas are retained. Shared backend response helpers may list statuses broader than
an individual handler actually returns. Structural types do not encode all runtime limits/refinements.

Generation uses exact versions of `openapi-typescript`, TypeScript and Oxfmt. TypeScript **5.9.3** is
pinned because the generator requires the JavaScript compiler API; the previously installed TypeScript
7.0.2 package does not expose that API. The additional `@types/js-yaml` and `json-schema-to-ts`
development dependencies resolve the generator's upstream declaration dependencies without disabling
library type checking. None of these packages becomes a consumer runtime dependency.

Generated output is `src/shared/api/generated/schema.ts`. Do not edit it or the snapshot manually.
`contracts:generate` can repair generated-type drift, but refuses a changed snapshot/policy; use
`contracts:update` to select and verify a new source. CI regenerates in memory and compares bytes;
it never repairs tracked files. A matching check establishes consistency with the pinned artifact,
not compatibility with an independently deployed API.

## Included operations

Organization scope is `/public/o/{organizationSlug}`:

- `GET /profile` and `GET /branding/logo`.
- `GET /d/{dealershipSlug}/profile` and `GET /d/{dealershipSlug}/branding/logo`.
- `GET /vehicles`, `GET /vehicles/{listingSlug}`, and `GET /vehicles/{listingSlug}/photos/{photoSlug}`.
- `GET /vehicles/{listingSlug}/interest-requests/form` and `POST /vehicles/{listingSlug}/interest-requests`.
- `GET /d/{dealershipSlug}/appraisal-requests/form` and `POST /d/{dealershipSlug}/appraisal-requests`.
- `POST /d/{dealershipSlug}/appraisal-requests/{requestReference}/photos/{photoSlug}/complete`.

## Semantics for future SDK operations

- Inventory filters repeat categorical parameters (`brand=toyota&brand=mazda`). The server computes
  search, facets, ranges and pagination. Money is a decimal string, dates remain transport strings,
  and null differs from omission. Listings may become unavailable between requests.
- Binary branding and photo responses are `image/webp`; image URL helpers or an explicit binary
  response mode must be used rather than assuming all successful responses contain JSON.
- Form endpoints supply enabled state, limits, privacy versions and Turnstile site/action settings.
  They do not disclose private customer or staff workflow state. Respect `Cache-Control: no-store`.
- Both public submission endpoints require `Idempotency-Key`. Preserve the key and business payload
  for an uncertain retry; a refreshed Turnstile token may accompany it. HTTP 202 is acceptance, not
  proof of a completed staff workflow. Inquiry acceptance does not reserve a vehicle or send a message.
- Appraisal receipt references grant no public status access. Appraisals collect information for staff
  review; they do not calculate a valuation. Optional photo uploads use returned signed URLs and raw
  File/Blob bodies. Upload completion requires the scoped token in `Authorization`; this header must
  not be removed merely because the route is public. It is not an ERP session or a permanent API key.
- Keep accepted appraisal submission separate from upload/completion state. Do not submit a second
  appraisal to recover a failed photo. Do not log contact data, tokens or signed URLs.
- Errors use Problem Details; retain stable code/status/request ID. Respect `Retry-After`. Runtime
  validation and deployment configuration remain authoritative; TypeScript is not runtime validation.

The original source behavior is documented in Engine's versioned listing, public-profile, branding,
interest-request and public-appraisal feature guides. Review the matching guides during an update,
especially for changes to retry semantics, publication rules, permissions and deployment limits.

## Review and verification

Review the public snapshot and generated type diff together. Treat removed fields, required inputs,
changed enums, nullability and response semantics as compatibility changes requiring SDK review;
this milestone does not implement an automated semantic breaking-change classifier.

Run `bun run check:ci`. Tests exercise method/path selection, schema pruning, cyclic references,
authentication exclusions, provenance checks, deliberate drift, offline standalone checking, and
compile-time use with `openapi-fetch`. No test needs the Engine checkout or a running API.
