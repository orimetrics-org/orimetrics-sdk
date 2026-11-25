# Orimetrics SDK

Framework-independent TypeScript SDK foundations for Orimetrics public APIs.
The intended scope is public vehicle discovery, inquiries, and appraisal information submitted into
Orimetrics ERP. Appraisals do not calculate a valuation. React helpers will be optional and separate.

## Development

Install Bun **1.4.4** (also recorded in `.bun-version` and `packageManager`), then:

```sh
bun install --frozen-lockfile
bun run check:ci
```

Installation configures Husky. The pre-commit hook checks formatting, lint and types without rewriting
files. Pre-push builds and tests the package. CI runs all checks plus dependency auditing.
Git hooks require Bun on the shell's PATH. CI uses `HUSKY=0`.

```sh
bun run dev          # Watch the ESM and declaration build
bun run fmt          # Apply Oxfmt formatting
bun run check        # Read-only formatting, Oxlint and TypeScript checks
bun run test         # Build, then test the actual packed package
bun run test:watch   # Watch tests; keep bun run dev running for fresh build output
bun run build        # Browser-targeted ESM and bundled declarations in dist/
bun run audit        # Dependency vulnerability audit
```

Bun is development tooling, not a consumer runtime requirement. The library targets ES2022 and browser
Web APIs. Source type checking deliberately excludes Bun and Node globals. Tooling/tests use a separate
TypeScript configuration. tsdown runs under Bun and bundles declarations with Oxc; TypeScript checks
remain mandatory and separate from emission.

## Current status

This is a development foundation, not a working API client. The only public export is the
`OrimetricsOptions` configuration type (`baseUrl`, `organizationSlug`, optional custom `fetch`).
There are no network calls, fake endpoint methods, or hardcoded deployment URLs. `openapi-fetch` and
`openapi-typescript` are installed for the next implementation step.

The package is intentionally marked `private: true` until its API and release policy are ready.
Builds produce `dist/index.js` and `dist/index.d.ts`; package exports expose only the deliberate root
entry point. Development aliases are bundled away. `sideEffects: false` requires all future modules
to remain free of import-time side effects.

The package test packs and extracts the artifact into a temporary consumer outside this repository,
checks browser bundling and strict TypeScript consumption without path aliases or Bun types, and
checks that development files are excluded. It runs locally without publishing or contacting the API.
The smoke test uses the local installed compiler; Linux/macOS `tar` must be available (as in CI).

## Architecture and generation

Read [src/README.md](src/README.md) for module boundaries and [AGENTS.md](AGENTS.md) for agent guidance.
Repository skills under `.agents/skills/` encode clean-code and personal style conventions, adapted
from Orimetrics Engine without backend-specific rules.

Before endpoint implementation, introduce an explicitly approved public OpenAPI artifact. The sibling
Engine repository's `contracts/openapi.json` is a development reference, not a runtime dependency.
Select only supported public operations and their reachable schemas, record the source contract version,
and commit the public artifact plus reproducible generation and drift-check scripts. Never hand-edit
generated transport types or import Engine's Elysia declarations into the published SDK.

Keep generated transport details internal behind Orimetrics functions. Implement authoritative domain
rules on the server; share client serialization, cancellation, error handling and submission workflows.
Add feature subpath exports and React helpers only when those modules exist.
