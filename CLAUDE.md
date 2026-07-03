# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An "awesome list" of self-hosted tools/services for dev infrastructure, similar in spirit to other `awesome-*` repos, but data-driven: the curated entries live as structured YAML under `lists/`, and `README.md` is a generated artifact — never edit it by hand.

## Commands

```bash
pnpm run generate-readme   # Regenerate README.md from lists/*.yaml via templates/readme.edge
pnpm run generate-schema   # Regenerate schemas/list-schema.json from the Effect schema in scripts/lib/schemas.ts
pnpm run lint              # oxlint
pnpm run format            # oxfmt --write .
pnpm run format:check      # oxfmt --check .
```

There is no test suite. Scripts are run directly with `tsx` (see `package.json`).

## Architecture

- `lists/*.yaml` — one file per category (e.g. `webhook.yaml`, `crm.yaml`), each a `category.name` plus an `items` array of `{ name, url, description? }`. Shape is defined by `scripts/lib/schemas.ts` (an `effect` `Schema`).
- `schemas/list-schema.json` — JSON Schema generated from `scripts/lib/schemas.ts` via `scripts/generate-schema.ts`. Regenerate after changing the Effect schema — don't hand-edit.
- `scripts/generate-readme.ts` — reads and validates all `lists/*.yaml` against the schema, sorts categories alphabetically, and renders `templates/readme.edge` (Edge.js) to produce `README.md`. Written in `effect` style (`pipe`/`Effect.gen`, `@effect/platform` `FileSystem`).

### Adding/editing entries

To triage URLs queued in `inbox.md` into `lists/`, use the `ingest-url` skill (`.claude/skills/ingest-url/SKILL.md`). To add an entry by hand, mirror an existing file like `lists/webhook.yaml`.

## Code style

- Formatting/linting is via oxfmt/oxlint (migrated from Biome — see `.oxfmtrc.json`, `.oxlintrc.json`), not Prettier/ESLint.
- TypeScript scripts use `effect` idioms throughout (`Effect.gen`, `pipe`, `Effect.fn`) rather than plain async/await — follow this pattern when touching `scripts/`.
- `README.md` is excluded from oxfmt formatting (`ignorePatterns`), since it's generated.
