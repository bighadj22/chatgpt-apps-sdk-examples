# Project File Tour

This guide walks through the key directories and files in the Pexels gallery project, explaining what each one does and how they relate to one another.

## `web/` – React Widget Source

### `web/src/`
- **Purpose:** Houses the React widget that renders inside ChatGPT.
- **Key files:**
  - `web/src/components/App.tsx` – Entry point for the gallery UI.
  - `web/src/components/cards/` – Lightweight shared UI for empty/loading states.
- **Relationship:** After building, the output is inlined into the Worker via `scripts/inline-react-widget.js`.

### `web/build.mjs`
- **Purpose:** ESBuild script that compiles the React widget (TypeScript + JSX) into plain JavaScript.
- **Relationship:** Called by `npm run build:widget` before inlining.

### `web/dist/`
- **Purpose:** Build artifacts (e.g., `component.js`).
- **Relationship:** `scripts/inline-react-widget.js` reads `web/dist/component.js` and injects it into `src/components/react-widget-inline.ts`.

## Worker Source (`src/`)

### `src/types.ts`
- **Purpose:** Shared TypeScript types for the Worker (env bindings, tool payloads, etc.).
- **Relationship:** Imported by tools and other Worker-side code.

### `src/types/`
- **Purpose:** Additional type definitions generated or shared across the Worker.
- **Relationship:** Used where domain-specific types need to stay organized.

### `src/index.ts`
- **Purpose:** Durable Object entry point; registers resources and tools with the MCP server.
- **Relationship:** Imports the React widget resource and the Pexels tool registration.

### `src/components/`
- `react-widget-resource.ts` – Wraps the inlined React bundle in HTML/CSS and exposes it as a `ui://` resource via `registerResource`.
- `react-widget-inline.ts` – Auto-generated string containing the compiled widget (do not edit manually).
- **Relationship:** `src/index.ts` serves `react-widget-resource.ts` to ChatGPT; generated from the `web/` build output.

### `src/tools/`
- **Purpose:** Collection of MCP tools the Worker exposes.
- **Key files:**
  - `src/tools/pexels.ts` – Calls the Pexels API, normalizes results, and returns structured content.
  - `src/tools/index.ts` – Barrel file exporting all tool registration helpers.
- **Relationship:** `src/index.ts` imports from this folder to register the Pexels tool.

## Toolchain & Configuration

### `scripts/`
- **Purpose:** Utility scripts for the project.
- **Key script:**
  - `scripts/inline-react-widget.js` – Copies the compiled widget into `src/components/react-widget-inline.ts`.

### `wrangler.jsonc`
- **Purpose:** Cloudflare Wrangler configuration.
- **Relationship:** Defines bindings, Durable Object class, and environment variables (e.g., base URL).

### `worker-configuration.d.ts`
- **Purpose:** Type definitions for the Worker’s environment bindings.
- **Relationship:** Keeps TypeScript aware of the custom env variables (`PEXELS_API_KEY`, etc.).

## How Everything Fits Together
1. React widget lives in `web/src` and is built via `web/build.mjs` → `web/dist/component.js`.
2. `scripts/inline-react-widget.js` inlines that bundle into `src/components/react-widget-inline.ts`.
3. `src/components/react-widget-resource.ts` packages the widget HTML and CSS.
4. `src/index.ts` registers the widget resource and the Pexels tool defined in `src/tools/pexels.ts`.
5. Wrangler configuration and type definitions ensure the Worker deploys correctly with the right bindings.

Keep this flow in mind when making changes or recording walkthroughs—you’ll know exactly where to look and what needs rebuilding after each edit.
