---
name: ingest-url
description: Process URLs queued in inbox.md, categorize them against lists/*.yaml, and add entries to the right category file. Use when the user asks to process the inbox, add URLs to the list, or triage new tool links into this repo's categories.
---

Process the URLs queued in `inbox.md`, categorize each one, and add it to the matching category file under `lists/`.

## Steps

1. Read `inbox.md` for the URLs to process, and list `lists/` for the available categories (one YAML file each).
2. For each URL, fetch its content to write a name and a concise, neutral, one-sentence description.
3. Find the best-matching category file and append the entry there, matching the structure of its existing items (see `lists/webhook.yaml` for the format). If no category fits, propose a new one to the user and wait for confirmation before creating the file.
4. Clear `inbox.md` and run `pnpm run generate-readme` to rebuild `README.md`.
