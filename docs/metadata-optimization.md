# Optimizing ChatGPT Metadata for the Pexels Gallery App

Metadata is how ChatGPT decides when, why, and how to call your connector. Treat it like product copy: every word guides the model toward—or away from—your tool. This guide explains how we tune metadata in this repository and how you can apply the same playbook to future apps.

> **Docs to bookmark:**  
> - Tool metadata reference: https://developers.openai.com/docs/apps/sdk/tools#metadata  
> - App manifest guidance: https://developers.openai.com/docs/apps/overview  
> - Model Context Protocol (MCP): https://modelcontextprotocol.io

---

## 1. Understand the Current Metadata

Open `src/tools/pexels.ts` and locate the `registerPexelsSearchTool` call. Key pieces:

- **Tool name:** `"pexels.searchPhotos"` follows the *domain.action* convention.  
- **Title & description:** Communicate when the tool is appropriate. Update these strings whenever the tool scope changes.  
- **Input schema + Zod descriptions:** Each field has a `.describe()` hint, which becomes parameter documentation in ChatGPT’s UI.  
- **`_meta` fields:**  
  - `openai/outputTemplate` links the tool result to our widget (`ui://widget/pexels-gallery.html`).  
  - `openai/toolInvocation/*` copy is what users see before/after execution.  
  - `openai/widgetAccessible` signals the UI is screen-reader friendly.  

When you add more tools, mirror this structure. For read-only tools, set `_meta["openai/readOnlyHint"] = true` so ChatGPT can skip confirmation dialogs.

---

## 2. Build a “Golden” Prompt Set

Before changing copy, create a labelled dataset so you can measure improvements.

| Prompt type | Example | Expected behavior |
|-------------|---------|-------------------|
| Direct | “Show me beach photos from the Pexels gallery.” | Call `pexels.searchPhotos` with `query = "beach"` |
| Direct | “Use the Pexels connector to find neon cityscapes.” | Call `pexels.searchPhotos` with `query = "neon cityscapes"` |
| Indirect | “I need high-res sunrise landscapes for a slide deck.” | Call `pexels.searchPhotos`, infer `orientation = landscape` |
| Indirect | “Grab moody black-and-white portraits we could use for a magazine spread.” | Call `pexels.searchPhotos` with `query` + `color = black` |
| Indirect | “Pull a few calming nature shots that would fit a meditation app onboarding screen.” | Call `pexels.searchPhotos` with a descriptive query |
| Negative | “Book a meeting for Thursday.” | Do **not** call our tool (let built-in calendar win) |
| Negative | “Render a 3D model of a coffee mug.” | Do **not** call our tool (not photography) |

Store this list in your project notes. We reuse it after every metadata tweak.

---

## 3. Draft Metadata That Guides the Model

For each tool:

1. **Name** — keep it predictable: `<namespace>.<verb_noun>`. Example: `pexels.searchPhotos`.  
2. **Description** — start with “Use this when …” and explicitly mention disallowed cases.  
3. **Parameter docs** — expand `.describe()` strings with examples (“e.g. `golden hour mountains`”). Use enums for constrained values so the UI shows dropdowns.  
4. **Read-only hint** — add `_meta["openai/readOnlyHint"] = true` if the tool doesn’t persist changes. Our tool qualifies because it only fetches data.

At the app level, polish your description, icon, starter prompts, and sample conversations in the ChatGPT Apps dashboard so they match the metadata story.

---

## 4. Evaluate in ChatGPT Developer Mode

1. Run `wrangler dev --local --persist` and link the connector in [ChatGPT developer mode](https://developers.openai.com/apps).  
2. Execute each golden prompt and log:
   - Which tool the model chose.  
   - Arguments it sent (compare with expectations).  
   - Whether the widget rendered correctly.  
3. Track metrics:
   - **Precision:** Did the tool run only when it should?  
   - **Recall:** Did the tool run every time it was relevant?  

If the wrong tool fires or parameters are off, tighten the description or input docs. Narrow the scope before widening it; high precision on negative prompts matters most.

---

## 5. Iterate Methodically

- Change one metadata field at a time (e.g., description → parameter docs → invocation copy).  
- Keep a running changelog with timestamps, the prompt set used, and pass/fail notes.  
- Share metadata diffs during review so others can spot ambiguous language.  
- After each revision, replay the golden prompt set to catch regressions.

Example changelog entry:

```
2025-03-15 — Clarified description (“Do not use for videos”).  
Precision: 9/9, Recall: 7/9 (missed two indirect prompts mentioning “footage”).  
Next step: add “Use this when the user wants still photography…” to description.
```

---

## 6. Monitor in Production

Once you deploy with `wrangler deploy`:

- Review tool call analytics weekly in the Apps dashboard. Look for spikes in user confirmations or cancellations—these usually mean metadata drift.  
- Capture qualitative feedback (“I asked for a video and it still called the Pexels tool”) and update descriptions accordingly.  
- Schedule periodic prompt replays, especially after adding new tools or parameters.  
- Treat metadata as a living asset. Update it whenever you adjust structured fields, change the widget experience, or notice new user intents.

---

## 7. How to Apply This in New Apps

1. Copy the structure used in `src/tools/pexels.ts` for every new tool.  
2. Create a matching widget or text response and reference it via `openai/outputTemplate`.  
3. Maintain a prompt set per tool namespace; expand it as you add features.  
4. Automate regression testing where possible (e.g., script the developer-mode prompts).  
5. Document your metadata edits alongside code changes—include links to the latest analytics or test results.

With intentional metadata, your connector becomes easier for ChatGPT to discover and less likely to fire in the wrong scenarios. Keep iterating, log the outcomes, and share learnings with the team so every release gets smarter.***
