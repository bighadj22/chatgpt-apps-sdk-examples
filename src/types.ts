export type State = Record<string, never>;

export type Props = Record<string, never>;

export interface PexelsSearchInput {
	query: string;
	page?: number;
	perPage?: number;
	orientation?: "landscape" | "portrait" | "square";
	size?: "large" | "medium" | "small";
	color?: string;
	locale?: string;
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
	status: "ok";
	query: string;
	page: number;
	perPage: number;
	totalResults: number;
	photos: PexelsPhoto[];
}

export interface PexelsSearchError {
	status: "error";
	message: string;
	query?: string;
}

export type PexelsSearchStructuredContent = PexelsSearchSuccess | PexelsSearchError;
