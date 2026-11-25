# Source ownership

The initial source tree contains only implemented foundation types:

```text
src/
  index.ts                       Deliberate consumer exports
  shared/
    configuration/options.ts     Public client configuration type
```

Add `src/features/<feature>/` when implementing vehicles, inquiries or appraisals. Each feature owns
its transport mapping, workflow functions and domain types. Expose its supported integration surface
through `index.<feature>.ts`; private implementation files stay private. Add generated public transport
types under `src/shared/api/generated/` when contract generation is implemented.
Do not create empty folders or generic repositories/services/hooks layers in advance.

## Dependency direction

- `src/index.ts` composes deliberate public exports.
- Features depend on shared infrastructure and another feature's explicit public surface when needed.
- Shared modules never depend on features or the root SDK entry point.
- Feature internals never import their own barrel or the root SDK entry point.
- Cross-feature imports use `index.<feature>`; when adding a feature, add ownership-specific Oxlint
  restrictions following the existing shared/feature overrides. Generic aliases alone do not enforce
  private feature ownership.

Oxlint enforces source aliases, shared-to-feature restrictions and imports of Bun/Node/React in core.
Source-only TypeScript excludes development globals. No module may perform requests, read environment
variables, access browser storage, or register global listeners at import time.

## Aliases and exports

- `@sdk` → `src/index.ts`, for consumer-facing source tests only.
- `@shared/*` → `src/shared/*`.
- `@features/*` → `src/features/*`.

Use aliases for source imports. Keep their definitions in `tsconfig.json`; Bun and tsdown consume that
configuration. Internal modules import defining files, not broad shared barrels. Export public types
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
