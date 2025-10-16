# Future UI/UX Guide for ChatGPT Widgets

This guide captures the styling principles we just applied to the Pexels gallery widget so we can reuse the same approach in future ChatGPT Apps without ever overriding ChatGPT’s native UI.

## Honor the Host Surface
- Leave the document body/background untouched; let ChatGPT control all root colors.
- Keep widget containers transparent (`background: 'transparent'`) so the host theme shows through in both light and dark modes.
- Avoid global stylesheets whenever possible—prefer component-scoped styles or inline objects so nothing leaks into ChatGPT.

## Use Theme Tokens, Not Hardcoded Colors
- Derive presentation values from `window.openai.theme` via a small theme helper (e.g., `createThemeTokens(theme)`).
- Define colors for headlines, secondary text, and action accents inside those tokens; switch values for dark mode there only.
- Never modify system text/background colors globally; only apply tokens directly to components that we own.

## Keep Components Lightweight
- Build cards with simple flex layouts and inline styles; omit borders/shadows unless absolutely necessary so cards blend into the conversation.
- Size imagery and typography for readability (`~16px body copy`, multi-line clamping for long titles) while respecting the host’s default font stack.
- Limit branding to accent CTAs (a single primary button color); everything else should inherit host colors.

## Respect Platform Layout Rules
- Pull in `safeArea` and `maxHeight` from `window.openai` and apply padding/height directly on the root container.
- Avoid additional wrappers that might interfere with ChatGPT’s scroll; use `maxHeight` + `overflowY: 'auto'` instead of fixed heights.
- Keep carousel buttons small, unobtrusive, and semi-transparent so they hover over content without blocking ChatGPT UI.

## Verification Checklist
- 🔁 Test in both light and dark themes inside the ChatGPT Apps Playground before shipping.
- 🧭 Confirm the widget still responds to `displayMode` changes (inline/fullscreen).
- ♿ Check contrast for primary text and buttons after theme updates.
- ⚠️ Ensure there are no console warnings about missing `window.openai` APIs.

Reusing these guidelines keeps our future widgets consistent with OpenAI’s SDK expectations and guarantees we never override or fight against native ChatGPT styling.***
