# Orimetrics SDK

Framework-independent TypeScript SDK for Orimetrics public APIs, under development.
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

Client and transport are implemented, with `organization.getProfile()` as the first real operation.
The public OpenAPI snapshot and generated transport types are pinned and verified in CI. Vehicle,
inquiry and appraisal APIs are next; React helpers remain deferred until the core is complete.

```ts
import { createOrimetricsClient } from "@orimetrics/sdk";

const client = createOrimetricsClient({
  baseUrl: "https://your-api.example",
  organizationSlug: "your-company",
});

const profile = await client.organization.getProfile({ timeoutMs: 5_000 });
```

See [client and transport](docs/transport.md) for configuration, cancellation, errors, credential rules,
custom fetch adapters and the implemented API. Construction performs no network requests.

The package is intentionally marked `private: true` until its API and release policy are ready.
Builds produce `dist/index.js` and `dist/index.d.ts`; package exports expose only the deliberate root
entry point. Development aliases are bundled away. `sideEffects: false` requires all future modules
to remain free of import-time side effects.

The package test packs and extracts the artifact into a temporary consumer outside this repository,
checks browser bundling and strict TypeScript consumption without path aliases or Bun types, and
checks that development files are excluded. It runs locally without publishing or contacting the API.
The smoke test installs the packed package and runtime dependencies from Bun’s local cache with
`--offline --ignore-scripts`, then uses the local installed compiler; Linux/macOS `tar` must be available (as in CI).

## Architecture and generation

Read [src/README.md](src/README.md) for module boundaries and [AGENTS.md](AGENTS.md) for agent guidance.
Repository skills under `.agents/skills/` encode clean-code and personal style conventions, adapted
from Orimetrics Engine without backend-specific rules.

The public contract is selected from a verified Engine contract artifact through an explicit allowlist.
Read [contracts/README.md](contracts/README.md) for provenance, operation scope, generation commands,
workflow semantics and update review. Normal checks use the committed snapshot without a backend checkout.

```sh
bun run contracts:check
bun run contracts:generate
bun run contracts:update --source ../orimetrics-engine/contracts
```

Read [docs/public-api.md](docs/public-api.md) for the intended SDK interface and error conventions.
The core SDK comes first; a minimalist demo website will follow the initial implementation steps,
and optional React helpers come after the core is complete.

Keep generated transport details internal behind Orimetrics functions. Implement authoritative domain
rules on the server; share client serialization, cancellation, error handling and submission workflows.
Add feature subpath exports only when those modules exist.
