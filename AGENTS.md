# Orimetrics SDK conventions

Read [the source guide](src/README.md) before changing architecture or public exports.
Use the repository skills when generating or refactoring TypeScript:

- [.agents/skills/code-generation/SKILL.md](.agents/skills/code-generation/SKILL.md)
- [.agents/skills/personal-styles/SKILL.md](.agents/skills/personal-styles/SKILL.md)

Use Bun and the committed lockfile. Run `bun run check:ci` before handing off implementation changes.
Keep checks read-only; run `bun run fmt` explicitly to format.
The SDK is browser-first and framework-independent. Do not add private ERP APIs, secret credentials,
appraisal valuation, framework dependencies, or automatic persistent caching to the core.
