---
name: personal-styles
description: Apply Orimetrics personal TypeScript style to SDK source, tests and configuration, including import grouping, aliases, constants, braces and statement spacing.
---

# Personal styles

Adapted from Orimetrics Engine's personal-styles skill; these rules take precedence over general style advice.

Order imports: type-only imports first; named runtime imports; runtime namespace imports; default runtime
imports last. Separate nonempty groups with one blank line. Keep type and runtime imports separate.
Preserve side-effect import order. Use named imports when the declaration fits within 100 columns;
otherwise use a namespace. For third-party namespaces use a recognizable library name; for local
namespaces use a short alias such as `t` or `s`. Use source aliases, not relative source imports.

Prefer arrow functions and named exports for SDK operations and types. Keep public signatures explicit.
Name fixed constants in UPPER_SNAKE_CASE, with `as const` for literal fixed values when appropriate.
Ordinary runtime values remain camelCase. Never apply `as const` to function calls.

Always use braces for control flow. Separate control-flow statements, multiline declarations and
returns from neighboring statements with a blank line. Keep attached else/catch/finally clauses together.
Do not add blank lines just inside blocks. Explicitly type variables without initializers or initialized
to undefined; include undefined when it is a possible value.

Use names and structure to explain implementation; document important consumer behavior with concise
public API documentation. Keep tests under `test/` grouped by owner. Run Oxfmt and inspect its output;
do not enable an import sorter that contradicts these groups or changes side-effect execution order.
