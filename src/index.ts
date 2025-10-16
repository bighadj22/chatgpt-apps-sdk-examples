import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import type { Props, State } from "./types";
import { REACT_WIDGET_HTML } from "./components/react-widget-resource";
import { registerPexelsSearchTool } from "./tools";

/**
 * Minimal MCP agent showcasing the Pexels image search tool.
 */
export class MyMCP extends McpAgent<Env, State, Props> {
    server = new McpServer({
        name: "pexels-gallery",
        version: "1.0.0",
    });

    async init() {

        this.server.registerResource(
            "pexels-gallery",
            "ui://widget/pexels-gallery.html",
            {
                title: "Pexels Gallery Widget",
                description: "Interactive gallery for browsing Pexels photo search results.",
                mimeType: "text/html+skybridge",
                _meta: {
                    "openai/widgetCSP":
                        "default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.pexels.com; frame-ancestors 'none';",
                },
            },
            async () => ({
                contents: [
                    {
                        uri: "ui://widget/pexels-gallery.html",
                        mimeType: "text/html+skybridge",
                        text: REACT_WIDGET_HTML,
                    },
                ],
            }),
        );

        registerPexelsSearchTool(this.server, () => this.env);
    }
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const handler = MyMCP.mount("/sse");
        return handler.fetch(request, env, ctx);
    }
};
