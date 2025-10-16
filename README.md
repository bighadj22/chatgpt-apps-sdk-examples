# Pexels ChatGPT App 

A ChatGPT App that brings high-quality, royalty-free photography from [Pexels](https://www.pexels.com) directly into your conversations. Built with the Model Context Protocol (MCP) and powered by Cloudflare Workers.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)

---


## What is This?

This project is a **Model Context Protocol (MCP) server** that integrates the Pexels API into ChatGPT. Users can search for professional stock photos directly in their chat conversations and view results in an interactive, responsive gallery widget.

### Key Features

- **🔍 Advanced Photo Search** - Search by keywords, orientation, color palette, size, and more
- **🎨 Interactive Gallery Widget** - Beautiful carousel interface with photo cards
- **🌓 Theme Aware** - Automatically adapts to light/dark mode
- **♿ Accessible** - Full screen reader support and keyboard navigation
- **⚡ Serverless** - Runs on Cloudflare Workers edge network for global performance
- **📱 Responsive** - Works seamlessly across desktop, tablet, and mobile

---

## Architecture

This project demonstrates a complete MCP application architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                         ChatGPT UI                          │
├─────────────────────────────────────────────────────────────┤
│  React Widget (Embedded Gallery)                            │
│  ↓ Uses OpenAI SDK                                          │
├─────────────────────────────────────────────────────────────┤
│  MCP Protocol (SSE)                                          │
│  ↓ Tool Invocation                                          │
├─────────────────────────────────────────────────────────────┤
│  Cloudflare Worker (Durable Objects)                        │
│  ↓ HTTP Request                                             │
├─────────────────────────────────────────────────────────────┤
│  Pexels API (https://api.pexels.com)                        │
└─────────────────────────────────────────────────────────────┘
```

### Tech Stack

**Backend:**
- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless edge computing
- [Durable Objects](https://developers.cloudflare.com/durable-objects/) - Stateful MCP server instances
- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk) - MCP implementation
- TypeScript 5.9.3

**Frontend:**
- React 18.3.1 - UI framework
- [embla-carousel-react](https://www.embla-carousel.com/) - Carousel functionality
- [lucide-react](https://lucide.dev/) - Icon library
- esbuild - Fast bundler

**External API:**
- [Pexels API](https://www.pexels.com/api/) - Free stock photography

---

## Project Structure

```
pexels-app/
├── src/                              # Backend (Cloudflare Worker)
│   ├── index.ts                      # MCP Durable Object & worker entry
│   ├── types.ts                      # Shared TypeScript types
│   ├── tools/
│   │   └── pexels.ts                 # Pexels search tool implementation
│   └── components/
│       ├── react-widget-inline.ts    # Bundled React widget (auto-generated)
│       └── react-widget-resource.ts  # HTML wrapper for widget
│
├── web/                              # Frontend (React Widget)
│   ├── src/
│   │   ├── component.tsx             # React entry point
│   │   ├── theme.tsx                 # Theme tokens & context
│   │   ├── components/
│   │   │   ├── App.tsx               # Main gallery application
│   │   │   └── cards/                # Photo card components
│   │   └── hooks/
│   │       ├── use-openai-global.ts  # OpenAI SDK integration
│   │       └── use-widget-state.ts   # Persistent state management
│   └── dist/                         # Build output
│
├── scripts/
│   └── inline-react-widget.js        # Bundles React into Worker
│
├── docs/                             # Comprehensive documentation
│   ├── ARCHITECTURE.md               # System design
│   ├── DEPLOYMENT-GUIDE.md           # Deployment instructions
│   └── ...                           # More guides
│
├── wrangler.jsonc                    # Cloudflare Worker config
├── .dev.vars.example                 # Environment variable template
└── package.json                      # Dependencies & scripts
```

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- [Pexels API key](https://www.pexels.com/api/) (free)
- [Cloudflare account](https://dash.cloudflare.com/sign-up/workers-and-pages) (free tier available)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/pexels-app.git
   cd pexels-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd web && npm install && cd ..
   ```

3. **Configure environment variables:**
   ```bash
   cp .dev.vars.example .dev.vars
   ```

   Edit `.dev.vars` and add your Pexels API key:
   ```
   PEXELS_API_KEY=your_actual_api_key_here
   ```

4. **Build and run locally:**
   ```bash
   npm run dev
   ```

   The MCP server will be available at `http://localhost:8787`

### Deployment

1. **Authenticate with Cloudflare:**
   ```bash
   npx wrangler login
   ```

2. **Set production secrets:**
   ```bash
   npx wrangler secret put PEXELS_API_KEY
   # Enter your API key when prompted
   ```

3. **Deploy to Cloudflare:**
   ```bash
   npm run deploy
   ```

   Your app will be live at `https://your-worker-name.workers.dev`

---

## Usage

### MCP Tool: `pexels.searchPhotos`

Search the Pexels library with powerful filtering options:

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search keywords (1-120 characters) |
| `page` | number | No | Page number (1-50, default: 1) |
| `perPage` | number | No | Results per page (1-30, default: 12) |
| `orientation` | string | No | `landscape`, `portrait`, or `square` |
| `size` | string | No | `large`, `medium`, or `small` |
| `color` | string | No | Hex code or color keyword |
| `locale` | string | No | ISO locale code (e.g., `en-US`) |

**Example in ChatGPT:**

```
User: Show me portrait photos of mountain landscapes

[ChatGPT invokes: pexels.searchPhotos({
  query: "mountain landscapes",
  orientation: "portrait",
  perPage: 15
})]

[Interactive gallery widget displays with 15 photos]
```

**Output:**

- Text summary: "Found X Pexels photos for 'query'"
- Interactive gallery widget with photo cards
- Each card shows:
  - High-quality photo preview
  - Photographer attribution
  - "View on Pexels" button (opens in new tab)

---

## Development

### NPM Scripts

```bash
# Development
npm start                 # Start local dev server
npm run dev              # Same as start

# Building
npm run build:widget     # Build React widget only
npm run deploy           # Build everything and deploy

# React Development (in web/ directory)
cd web
npm run build            # Build React bundle
npm run watch            # Watch mode for React changes

# Type Checking
npm run type-check       # Check TypeScript types
```

### Development Workflow

1. **Make changes to React widget** (`web/src/`)
2. **Build widget:** `cd web && npm run build`
3. **Inline bundle:** `node scripts/inline-react-widget.js`
4. **Test locally:** `npm run dev`
5. **Deploy:** `npm run deploy`

For faster iteration, use watch mode in a separate terminal:
```bash
cd web && npm run watch
```

---

## Configuration

### Environment Variables

**Development (`.dev.vars`):**
```bash
PEXELS_API_KEY=your_api_key_here
```

**Production (Cloudflare Secrets):**
```bash
npx wrangler secret put PEXELS_API_KEY
npx wrangler secret list  # View configured secrets
```

### Wrangler Configuration

Key settings in `wrangler.jsonc`:

```json
{
  "name": "pexels",
  "main": "src/index.ts",
  "compatibility_date": "2025-03-10",
  "durable_objects": {
    "bindings": [{
      "class_name": "MyMCP",
      "name": "MCP_OBJECT"
    }]
  },
  "vars": {
    "PEXELS_API_BASE_URL": "https://api.pexels.com/v1"
  }
}
```

---

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - How frontend and backend connect
- **[DEPLOYMENT-GUIDE.md](docs/DEPLOYMENT-GUIDE.md)** - Complete deployment instructions
- **[PROJECT-TOUR.md](docs/PROJECT-TOUR.md)** - File-by-file walkthrough
- **[APP_DESIGN_GUIDELINES.md](docs/APP_DESIGN_GUIDELINES.md)** - OpenAI design principles
- **[METADATA-OPTIMIZATION.md](docs/METADATA-OPTIMIZATION.md)** - MCP metadata tuning
- **[FUTURE-UI-UX-GUIDE.md](docs/FUTURE-UI-UX-GUIDE.md)** - UI styling best practices
- **[WRANGLER-SECRET-COMMANDS.md](docs/WRANGLER-SECRET-COMMANDS.md)** - Secret management

---

## Design Philosophy

This project follows OpenAI's ChatGPT App design guidelines:

1. **Conversational** - Seamlessly integrated into chat flow
2. **Intelligent** - Context-aware tool invocation
3. **Simple** - Focused, single-purpose interactions
4. **Responsive** - Fast, lightweight, edge-optimized
5. **Accessible** - Screen reader support, keyboard navigation

### UI/UX Principles

- **System-First Design** - Inherits ChatGPT's colors, fonts, and spacing
- **Theme Tokens** - Dynamic light/dark theme support
- **Transparent Backgrounds** - Blends naturally with host environment
- **Component-Scoped Styles** - No global CSS to avoid conflicts
- **Minimal Branding** - Only subtle accent colors on CTAs

---

## API Reference

### Pexels API Integration

The tool makes requests to the Pexels API v1:

**Endpoint:** `GET https://api.pexels.com/v1/search`

**Authentication:** Bearer token via `Authorization` header

**Rate Limits:** 200 requests/hour (free tier)

**Response Format:** Normalized from snake_case to camelCase for TypeScript

For full Pexels API documentation, visit: https://www.pexels.com/api/documentation/

---

## Advanced Features

### Custom React Hooks

**`useOpenAiGlobal(key)`** - Access OpenAI SDK globals
```typescript
const theme = useOpenAiGlobal('theme'); // 'light' | 'dark'
const toolOutput = useOpenAiGlobal('toolOutput'); // Tool result data
```

**`useWidgetState(defaultState)`** - Persistent widget state
```typescript
const [state, setState] = useWidgetState({ page: 1 });
// State survives widget remounts
```

**`useThemeTokens()`** - Access theme design tokens
```typescript
const tokens = useThemeTokens();
// tokens.colors.background, tokens.fonts.body, etc.
```

### Type Safety

- Full TypeScript coverage with strict mode
- Zod validation for all tool inputs
- Shared types between frontend and backend
- Automatic type inference from OpenAI SDK

### Error Handling

Graceful handling of:
- API authentication failures
- Network errors
- Missing configuration
- Invalid parameters
- Empty search results
- User-friendly error messages in widget

---

## Security

### Content Security Policy

The widget enforces a strict CSP:

```
default-src 'none';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https://images.pexels.com;
frame-ancestors 'none';
```

### Best Practices

- API keys stored as Cloudflare secrets (never in code)
- `.dev.vars.example` provided as template
- Input validation with Zod schemas

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **[Pexels](https://www.pexels.com)** - For providing free, high-quality stock photography
- **[Cloudflare Workers](https://workers.cloudflare.com/)** - For serverless infrastructure
- **[OpenAI](https://openai.com)** - For ChatGPT and the MCP specification
- **[Model Context Protocol](https://modelcontextprotocol.io/)** - For the protocol specification

---


## Learn More

### MCP Resources
- [Model Context Protocol Docs](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

### Cloudflare Resources
- [Workers Documentation](https://developers.cloudflare.com/workers/)
- [Durable Objects Guide](https://developers.cloudflare.com/durable-objects/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### ChatGPT App Development
- [OpenAI App Guidelines](https://platform.openai.com/docs/guides/apps)
- [ChatGPT App Design](docs/APP_DESIGN_GUIDELINES.md)

---

**Built with ❤️ using the Model Context Protocol**
