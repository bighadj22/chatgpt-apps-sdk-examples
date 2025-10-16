// OpenAI window.openai API types
export type Theme = 'light' | 'dark';

export type DisplayMode = 'inline' | 'fullscreen' | 'pip';

export interface SafeArea {
  insets: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface ToolResponseMetadata {
  [key: string]: unknown;
}

type JsonPrimitive = string | number | boolean | null;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export type WidgetState = JsonValue | null;

export type ToolOutput = JsonValue | null;

export interface OpenAiGlobals {
  theme: Theme;
  userAgent: string;
  locale: string;
  maxHeight: number;
  displayMode: DisplayMode;
  safeArea: SafeArea;
  toolInput: Record<string, unknown>;
  toolOutput: ToolOutput;
  toolResponseMetadata: ToolResponseMetadata | null;
  widgetState: WidgetState;
}

export interface CallToolResponse {
  content: Array<{ type: string; text?: string }>;
  structuredContent?: unknown;
  isError?: boolean;
}

export interface API {
  callTool: (name: string, args: Record<string, unknown>) => Promise<CallToolResponse>;
  sendFollowUpMessage: (args: { prompt: string }) => Promise<void>;
  openExternal: (payload: { href: string }) => void;
  requestDisplayMode: (args: { mode: DisplayMode }) => Promise<{ mode: DisplayMode }>;
  setWidgetState: (state: JsonValue) => Promise<void>;
}

export interface PexelsPhotoSrc {
  original: string;
  large2x: string;
  large: string;
  medium: string;
  small: string;
  portrait: string;
  landscape: string;
  tiny: string;
}

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  alt?: string;
  avgColor?: string | null;
  photographer: string;
  photographerUrl?: string;
  src: PexelsPhotoSrc;
}

export interface PexelsSearchSuccess {
  status: 'ok';
  query: string;
  page: number;
  perPage: number;
  totalResults: number;
  photos: PexelsPhoto[];
}

export interface PexelsSearchError {
  status: 'error';
  message: string;
  query?: string;
}

export type PexelsSearchStructuredContent = PexelsSearchSuccess | PexelsSearchError;

export interface SetGlobalsEvent extends CustomEvent {
  detail: {
    globals: Partial<OpenAiGlobals>;
  };
}

declare global {
  interface Window {
    openai: API & OpenAiGlobals;
  }

  interface WindowEventMap {
    'openai:set_globals': SetGlobalsEvent;
  }
}
