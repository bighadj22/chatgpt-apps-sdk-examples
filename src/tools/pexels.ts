import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type {
	PexelsPhoto,
	PexelsSearchInput,
	PexelsSearchStructuredContent,
} from "../types";

const DEFAULT_PER_PAGE = 12;
const MAX_PER_PAGE = 30;

type PexelsApiPhoto = {
	id: number;
	width: number;
	height: number;
	url: string;
	alt?: string;
	avg_color?: string | null;
	photographer: string;
	photographer_url?: string;
	src: {
		original: string;
		large2x: string;
		large: string;
		medium: string;
		small: string;
		portrait: string;
		landscape: string;
		tiny: string;
	};
};

type PexelsApiResponse =
	| {
			page: number;
			per_page: number;
			total_results: number;
			photos: PexelsApiPhoto[];
	  }
	| {
			error: string;
	  };

/**
 * Clamp the per-page value so a user can't pull more results than the UI is ready to render.
 */
function coercePerPage(value: number | undefined) {
	if (!value) return DEFAULT_PER_PAGE;
	return Math.min(MAX_PER_PAGE, Math.max(1, Math.floor(value)));
}

/**
 * Normalize raw API photo payloads into the widget-friendly shape exported from `types.ts`.
 */
function mapPhoto(photo: PexelsApiPhoto): PexelsPhoto {
	return {
		id: photo.id,
		width: photo.width,
		height: photo.height,
		url: photo.url,
		alt: photo.alt,
		avgColor: photo.avg_color ?? null,
		photographer: photo.photographer,
		photographerUrl: photo.photographer_url,
		src: {
			original: photo.src.original,
			large2x: photo.src.large2x,
			large: photo.src.large,
			medium: photo.src.medium,
			small: photo.src.small,
			portrait: photo.src.portrait,
			landscape: photo.src.landscape,
			tiny: photo.src.tiny,
		},
	};
}

function buildStructuredContent(
	request: PexelsSearchInput,
	response: PexelsApiResponse,
): PexelsSearchStructuredContent {
	if ("error" in response) {
		return {
			status: "error",
			message: response.error || "The Pexels API returned an error.",
			query: request.query,
		};
	}

	return {
		status: "ok",
		query: request.query,
		page: response.page,
		perPage: response.per_page,
		totalResults: response.total_results,
		photos: response.photos.map(mapPhoto),
	};
}

function getBaseUrl(env: Env) {
	const value = env.PEXELS_API_BASE_URL ?? "https://api.pexels.com/v1";
	return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function registerPexelsSearchTool(server: McpServer, getEnv: () => Env) {
	/**
	 * The handler below is invoked when ChatGPT (or the widget itself) calls `pexels.searchPhotos`.
	 * We validate the inputs with Zod, call the Pexels REST API with the server’s API key, and return
	 * a short text summary alongside rich `structuredContent` so the React widget can paint the gallery.
	 */
	server.registerTool(
		"pexels.searchPhotos",
		{
			title: "Search the Pexels photo library",
			description:
				"Look up high-quality, free-to-use photography from the Pexels catalog.the ui cards will show the data no need for adding theurls in the reponse the cards will handle that",
			inputSchema: {
				query: z
					.string()
					.min(1)
					.max(120)
					.describe("Keywords to search for, e.g. “golden hour mountains”."),
				page: z
					.number()
					.int()
					.min(1)
					.max(50)
					.optional()
					.describe("Page number to fetch."),
				perPage: z
					.number()
					.int()
					.min(1)
					.max(MAX_PER_PAGE)
					.optional()
					.describe("How many photos to return (max 30)."),
				orientation: z
					.enum(["landscape", "portrait", "square"])
					.optional()
					.describe("Limit results to a specific aspect ratio."),
				size: z
					.enum(["large", "medium", "small"])
					.optional()
					.describe("Prefer a particular asset size."),
				color: z
					.string()
					.min(1)
					.max(25)
					.optional()
					.describe(
						"Hex color (e.g. 00b7ff) or keyword (e.g. teal) to bias the palette.",
					),
				locale: z
					.string()
					.min(2)
					.max(5)
					.optional()
					.describe("ISO locale code to localize the search, e.g. en-US."),
			},
			_meta: {
				"openai/outputTemplate": "ui://widget/pexels-gallery.html",
				"openai/widgetAccessible": true,
				"openai/toolInvocation/invoking": "Searching the Pexels library…",
				"openai/toolInvocation/invoked": "Pexels search complete.",
				"openai/readOnlyHint": true,
			},
		},
		async (args: PexelsSearchInput, _extra) => {
			const env = getEnv();
			const apiKey = env.PEXELS_API_KEY;
			if (!apiKey) {
				const structuredContent: PexelsSearchStructuredContent = {
					status: "error",
					message: "The PEXELS_API_KEY binding is not configured on the server.",
					query: args.query,
				};

				return {
					content: [
						{
							type: "text",
							text: "The PEXELS_API_KEY binding is not configured on the server.",
						},
					],
					structuredContent: structuredContent as unknown as Record<string, unknown>,
					isError: true,
				};
			}

			const perPage = coercePerPage(args.perPage);
			const page = args.page && args.page > 0 ? Math.floor(args.page) : 1;

			const params = new URLSearchParams({
				query: args.query,
				page: page.toString(),
				per_page: perPage.toString(),
			});

			if (args.orientation) params.set("orientation", args.orientation);
			if (args.size) params.set("size", args.size);
			if (args.color) params.set("color", args.color);
			if (args.locale) params.set("locale", args.locale);

			const baseUrl = getBaseUrl(env);
			const url = `${baseUrl}/search?${params.toString()}`;

			try {
				const response = await fetch(url, {
					headers: {
						Authorization: apiKey,
					},
				});

				if (!response.ok) {
					const errorBody = await response.text();
					const message =
						response.status === 401
							? "The Pexels API rejected the request. Double-check that the API key is valid."
							: `Pexels API error (${response.status}): ${errorBody || response.statusText}`;

					const structuredContent: PexelsSearchStructuredContent = {
						status: "error",
						message,
						query: args.query,
					};

					return {
						content: [
							{
								type: "text",
								text: message,
							},
						],
						structuredContent: structuredContent as unknown as Record<string, unknown>,
						isError: true,
					};
				}

				const payload = (await response.json()) as PexelsApiResponse;
				const structuredContent = buildStructuredContent(args, payload);
				const structuredRecord = structuredContent as unknown as Record<string, unknown>;

				const matches = structuredContent.status === "ok" ? structuredContent.photos.length : 0;
				const summary = structuredContent.status === "ok"
					? `Found ${matches} Pexels photos for “${structuredContent.query}”.`
					: structuredContent.message;

				return {
					content: [
						{
							type: "text",
							text: summary,
						},
					],
					structuredContent: structuredRecord,
					isError: structuredContent.status === "error",
				};
			} catch (error) {
				const message =
					error instanceof Error
						? `Unable to contact Pexels: ${error.message}`
						: "Unable to contact Pexels due to an unknown error.";

				const structuredContent: PexelsSearchStructuredContent = {
					status: "error",
					message,
					query: args.query,
				};

				return {
					content: [
						{
							type: "text",
							text: message,
						},
					],
					structuredContent: structuredContent as unknown as Record<string, unknown>,
					isError: true,
				};
			}
		},
	);
}
