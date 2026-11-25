# Source ownership

The source tree separates client composition, feature operations and transport infrastructure:

```text
src/
  index.ts                       Deliberate consumer exports
  client/create-client.ts        Inert client factory and feature composition
  features/organization/         Organization/dealership profiles and branding URLs
  features/vehicles/             Inventory operations, query helpers, types and decoders
  features/inquiries/            Public inquiry forms, submission and validation
  features/appraisals/           Appraisal forms, submissions and explicit photo workflow
  shared/
    configuration/options.ts     Public client configuration type
    api/generated/schema.ts      Generated transport types; never edit manually
    api/                         Deadlines, errors and scoped openapi-fetch transport
    submissions/                 Shared public contact/consent types and validation
```

Add `src/features/<feature>/` for new feature owners. Each feature owns
its transport mapping, workflow functions and domain types. Expose its supported integration surface
through `index.<feature>.ts`; private implementation files stay private. Generated public transport types live under `src/shared/api/generated/`; regenerate them with
`bun run contracts:generate`. See `contracts/README.md` for snapshot updates and verification.
Do not create empty folders or generic repositories/services/hooks layers in advance.

## Dependency direction

- `src/index.ts` exposes deliberate public exports; `client` composes features and transport.
- Features depend on shared infrastructure and another feature's explicit public surface when needed.
- Shared modules never depend on features, client composition or the root SDK entry point.
- Feature internals never import their own barrel or the root SDK entry point.
- Cross-feature imports use `index.<feature>`; when adding a feature, add ownership-specific Oxlint
  restrictions following the existing shared/feature overrides. Generic aliases alone do not enforce
  private feature ownership.

Oxlint enforces source aliases, shared-to-feature restrictions and imports of Bun/Node/React in core.
Source-only TypeScript excludes development globals. No module may perform requests, read environment
variables, access browser storage, or register global listeners at import time.

## Aliases and exports

- `@client/*` → `src/client/*`, used by the root entry point and composition internals.
- `@sdk` → `src/index.ts`, for consumer-facing source tests only.
- `@shared/*` → `src/shared/*`.
- `@features/*` → `src/features/*`.

Use aliases for source imports. Keep their definitions in `tsconfig.json`; Bun and tsdown consume that
configuration. Tooling uses `tsconfig.tools.json`, which mirrors these aliases and adds `@contracts/*`
for generation scripts only; keep its source mappings synchronized when adding aliases. Internal modules import defining files, not broad shared barrels. Export public types
explicitly with `export type`. Public functions need explicit signatures because declaration emission
uses `isolatedDeclarations`. Avoid exporting third-party transport types as part of our stable API.
Package subpath exports belong in `package.json` and must have a corresponding build entry and consumer test.

## API invariants

The server owns visibility, permissions, validation, filtering, facets and availability. Public reads
must not send ERP session credentials. Respect current no-store responses; no stale-result cache by
default. Keep money as decimal strings and transport dates as strings. Preserve null versus omission.
Forms use server-provided limits, privacy notice versions and Turnstile settings. Preserve idempotency
keys for uncertain retries. Accepted submissions and photo upload completion are separate outcomes.
Never log contact data, challenge tokens, completion tokens or signed upload URLs.

## Testing and support

Tests live in `test/`, grouped by owning module. Prefer public surfaces; narrow unit tests may import
an owner's defining module. Test behavior and failure boundaries rather than duplicating implementation.
Use injected fetch functions for transport tests; ordinary tests need no live server or credentials.
Keep the packed-package smoke test working so declarations and browser output are verified independently
of local aliases and ambient developer types. Extend the fixture when public runtime operations arrive.

See [transport behavior](../docs/transport.md) before adding a feature operation or response decoder.
