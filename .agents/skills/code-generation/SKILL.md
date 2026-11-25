---
name: code-generation
description: Generate or refactor Orimetrics SDK TypeScript modules, public operations, and workflow helpers using the repository's modular architecture and public API boundaries.
---

# SDK code generation

Read `src/README.md` and the relevant owner before editing. Apply the companion
`.agents/skills/personal-styles/SKILL.md` for formatting and imports.

Keep one responsibility per module and use descriptive names. Prefer focused functions with explicit
inputs and dependencies over classes, global singletons, or speculative abstraction layers. Extract
shared logic only when its reuse or invariant is concrete. Use `unknown` and narrowing at untrusted
boundaries; do not silence errors with `any`, non-null assertions or unchecked response casts.

Use the approved generated public OpenAPI types internally. Do not import the backend checkout,
Elysia types, authenticated ERP routes or backend schemas into consumer code. Do not invent endpoint
contracts. Read the public contract and feature documentation before implementing an operation.

Keep transport infrastructure in `shared`, domain workflows in their feature, and explicit exports in
feature entry points. Add directories only with implementation. Follow alias and dependency restrictions.
When introducing a feature, add its private-import lint boundary and consumer tests for any new export.
Keep external declarations independent of local path aliases and Bun/Node ambient types.

Preserve the source guide's API invariants, especially repeated filter parameters, string money,
no-store behavior, privacy versions and stable submission keys. Client validation improves UX but does
not replace the server. Keep React and DOM widget rendering outside core workflow functions.

Verify changed behavior with focused tests. Run `bun run fmt`, then `bun run check:ci`. Check that new
public runtime exports work in the isolated package fixture, not just through source aliases.
