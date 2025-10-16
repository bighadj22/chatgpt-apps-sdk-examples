# Deployment Guide

This guide explains how to deploy changes to your Pexels Gallery MCP server.

## Quick Deploy Command

After making any changes, run this single command to rebuild and deploy:

```bash
npm run deploy
```

This command automatically:
1. Builds the React widget (`cd web && npm run build`)
2. Inlines the React bundle into TypeScript
3. Deploys to Cloudflare Workers

## Step-by-Step Deploy Process

If you prefer to run each step manually:

### 1. Build the React Widget

```bash
cd web
npm run build
cd ..
```

This compiles your React components into a single JavaScript bundle.

### 2. Inline the React Bundle

```bash
node scripts/inline-react-widget.js
```

This embeds the React bundle into `src/components/react-widget-inline.ts`.

### 3. Deploy to Cloudflare

```bash
npx wrangler deploy
```

This uploads your worker to Cloudflare and makes it live.

## Common Scenarios

### After Changing React Components

When you modify any file in `web/src/`:

```bash
npm run deploy
```

### After Changing Server Code

When you modify files in `src/` (but not React components):

```bash
npx wrangler deploy
```

### After Changing CSS/Styles

When you modify styles in `web/src/styles.css`:

```bash
npm run deploy
```

## Development Workflow

### Local Development

To test your worker locally:

```bash
npm run dev
```

This starts a local Cloudflare Workers server at `http://localhost:8787`.

### Watch Mode for React

To automatically rebuild React when you make changes:

```bash
cd web
npm run watch
```

In another terminal, manually inline and deploy when ready:

```bash
node scripts/inline-react-widget.js
npx wrangler deploy
```

## Troubleshooting

### "Module not found" errors

Make sure you've installed dependencies:

```bash
npm install
cd web && npm install && cd ..
```

### "Wrangler not found" errors

Install wrangler globally or use npx:

```bash
npm install -g wrangler
# OR
npx wrangler deploy
```

### Build fails

1. Check TypeScript errors:
   ```bash
   npm run type-check
   ```

2. Check React build:
   ```bash
   cd web
   npm run build
   cd ..
   ```

### Widget not updating in browser

1. Clear browser cache
2. Check deployment succeeded:
   ```bash
   npx wrangler deployments list
   ```
3. Verify the correct version is deployed

## Deployment Checklist

Before deploying to production:

- [ ] Test locally with `npm run dev`
- [ ] Check for TypeScript errors with `npm run type-check`
- [ ] Build React widget successfully
- [ ] Review changes in the widget UI
- [ ] Run `npm run deploy`
- [ ] Verify deployment at your worker URL
- [ ] Test in ChatGPT/Claude (if applicable)

## Your Deployed URL

Your worker is deployed at:
```
https://pexels-app.mcpsplayground.workers.dev
```

## File Structure Reference

```
pexels-app/
├── src/                          # Server code
│   ├── index.ts                 # Main worker entry
│   └── components/
│       ├── react-widget-resource.ts    # Root HTML template for the widget
│       └── react-widget-inline.ts      # Auto-generated JS bundle from web/
├── web/                          # React widget
│   ├── src/                     # React source code
│   │   └── styles.css           # Primary stylesheet for the widget
│   ├── dist/                    # Built bundle
│   └── build.mjs                # esbuild configuration
└── scripts/
    └── inline-react-widget.js   # Inlining script
```

## Quick Reference

| Task | Command |
|------|---------|
| Full deploy | `npm run deploy` |
| Local dev | `npm run dev` |
| Build widget only | `cd web && npm run build` |
| Deploy worker only | `npx wrangler deploy` |
| Type check | `npm run type-check` |
| Watch React | `cd web && npm run watch` |

## Notes

- Always run `npm run deploy` from the project root directory
- The deployment takes ~40-60 seconds
- Changes are live immediately after deployment
- Widget changes require a full rebuild (`npm run deploy`)
- Server-only changes can use `npx wrangler deploy` directly

---

**Last Updated**: October 2025
**MCP Server**: Pexels Gallery
**Platform**: Cloudflare Workers
