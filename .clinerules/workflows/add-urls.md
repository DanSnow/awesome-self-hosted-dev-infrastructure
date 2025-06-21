# Workflow: Process Inbox URLs

This workflow describes the steps the AI will take to process URLs listed in `inbox.md`, categorize them, and add them to the appropriate list files in the `lists/` directory.

## Steps

1.  **Read Inbox:** The AI will read the content of the `inbox.md` file located at the project root to get the list of URLs.
2.  **Get Categories:** The AI will list the files in the `lists/` directory to determine the currently available categories (YAML files).
3.  **Process URLs:** The AI will iterate through each URL found in `inbox.md`.
    *   For each URL, the AI will use the `searxng` MCP server's `web_url_read` tool to fetch the content of the webpage.
    *   The AI will analyze the fetched content to determine a suitable title and a concise, neutral, one-sentence description for the URL.
    *   Before modifying or creating any YAML files, the AI will examine existing files in the `lists/` directory to understand the required structure (e.g., `category` block, `name`, `url`, `description` fields).
    *   Based on the content and the list of available categories obtained in step 2, the AI will attempt to find the best matching category among the existing YAML files in the `lists/` directory.
    *   **If a suitable category is found:** The AI will read the content of the corresponding YAML file and append the new entry (using the correct structure and field names like `name`, `url`, `description`) to it. The AI will ensure the `$schema` field is retained and the new entry follows the existing structure.
    *   **If no suitable category is found:** The AI will propose a new category name and a brief description based on the URL content using the `ask_followup_question` tool. The AI will wait for user confirmation or suggestion for a different name/description. Once confirmed, the AI will create a new YAML file in the `lists/` directory with the proposed category name, including the correct `$schema` comment and the first entry following the required structure.
4.  **Clear Inbox:** After all URLs have been processed (either added to an existing category or a new category has been discussed/created), the AI will clear the `inbox.md` file by writing empty content to it.
5.  **Update readme**: Finally, run `pnpm run generate-readme` to update the `README.md`
