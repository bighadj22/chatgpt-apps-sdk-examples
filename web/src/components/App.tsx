import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useToolOutput, useTheme, useSafeArea, useMaxHeight, useDisplayMode } from '../hooks/use-openai-global';
import type {
  ToolOutput,
  PexelsSearchSuccess,
  PexelsPhoto,
  PexelsSearchStructuredContent,
  DisplayMode,
} from '../types';
import { EmptyStateCard, LoadingCard, PhotoCard } from './cards';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ThemeTokensProvider, createThemeTokens } from '../theme';

type GalleryState =
  | { kind: 'loading' }
  | { kind: 'idle'; query?: string }
  | { kind: 'error'; message: string; query?: string }
  | { kind: 'results'; data: PexelsSearchSuccess };

const REQUIRED_SRC_KEYS: Array<keyof PexelsPhoto['src']> = [
  'original',
  'large2x',
  'large',
  'medium',
  'small',
  'portrait',
  'landscape',
  'tiny',
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const safeParseJson = (value: string): unknown | null => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

function collectCandidates(value: ToolOutput): unknown[] {
  const queue: unknown[] = [];
  const candidates: unknown[] = [];

  if (value !== undefined && value !== null) {
    queue.push(value);
  }

  const enqueue = (input: unknown) => {
    if (input !== undefined) {
      queue.push(input);
    }
  };

  while (queue.length > 0) {
    const current = queue.shift();
    if (current === undefined || current === null) continue;
    candidates.push(current);

    if (typeof current === 'string') {
      const parsed = safeParseJson(current);
      if (parsed !== null) enqueue(parsed);
      continue;
    }

    if (Array.isArray(current)) {
      current.forEach((item) => enqueue(item));
      continue;
    }

    if (isRecord(current)) {
      if ('structuredContent' in current) {
        enqueue((current as Record<string, unknown>).structuredContent);
      }

      if ('data' in current) {
        enqueue((current as Record<string, unknown>).data);
      }

      if (Array.isArray(current.content)) {
        current.content.forEach((item) => enqueue(item));
      } else if (typeof current.content === 'string') {
        const parsed = safeParseJson(current.content);
        if (parsed !== null) enqueue(parsed);
      }

      if (typeof current.text === 'string') {
        const parsed = safeParseJson(current.text);
        if (parsed !== null) enqueue(parsed);
      }
    }
  }

  return candidates;
}

function normalizePhoto(value: unknown): PexelsPhoto | null {
  if (!isRecord(value)) return null;

  const { id, width, height, url, alt, avgColor, avg_color, photographer, photographerUrl, photographer_url } =
    value as Record<string, unknown>;

  if (typeof id !== 'number' || typeof width !== 'number' || typeof height !== 'number') {
    return null;
  }

  if (typeof url !== 'string' || typeof photographer !== 'string') {
    return null;
  }

  if (!isRecord(value.src)) return null;
  const srcRecord = value.src as Record<string, unknown>;

  for (const key of REQUIRED_SRC_KEYS) {
    if (typeof srcRecord[key] !== 'string') {
      return null;
    }
  }

  return {
    id,
    width,
    height,
    url,
    alt: typeof alt === 'string' ? alt : undefined,
    avgColor:
      typeof avgColor === 'string'
        ? avgColor
        : typeof avg_color === 'string'
        ? (avg_color as string)
        : null,
    photographer,
    photographerUrl:
      typeof photographerUrl === 'string'
        ? photographerUrl
        : typeof photographer_url === 'string'
        ? (photographer_url as string)
        : undefined,
    src: {
      original: srcRecord.original as string,
      large2x: srcRecord.large2x as string,
      large: srcRecord.large as string,
      medium: srcRecord.medium as string,
      small: srcRecord.small as string,
      portrait: srcRecord.portrait as string,
      landscape: srcRecord.landscape as string,
      tiny: srcRecord.tiny as string,
    },
  };
}

function parsePexelsStructuredContent(value: unknown): PexelsSearchStructuredContent | null {
  if (!isRecord(value) || typeof value.status !== 'string') return null;

  if (value.status === 'error') {
    if (typeof value.message !== 'string') return null;

    return {
      status: 'error',
      message: value.message,
      query: typeof value.query === 'string' ? value.query : undefined,
    };
  }

  if (value.status === 'ok') {
    const query =
      typeof value.query === 'string'
        ? value.query
        : typeof value.searchTerm === 'string'
        ? (value.searchTerm as string)
        : null;
    const page =
      typeof value.page === 'number'
        ? value.page
        : typeof value.currentPage === 'number'
        ? (value.currentPage as number)
        : typeof value.current_page === 'number'
        ? (value.current_page as number)
        : null;
    const perPage =
      typeof value.perPage === 'number'
        ? value.perPage
        : typeof value.per_page === 'number'
        ? (value.per_page as number)
        : null;
    const totalResults =
      typeof value.totalResults === 'number'
        ? value.totalResults
        : typeof value.total_results === 'number'
        ? (value.total_results as number)
        : null;
    const photosSource = Array.isArray(value.photos) ? value.photos : null;

    if (!query || page == null || perPage == null || totalResults == null || !photosSource) {
      return null;
    }

    const photos: PexelsPhoto[] = [];
    for (const item of photosSource) {
      const normalized = normalizePhoto(item);
      if (normalized) {
        photos.push(normalized);
      }
    }

    return {
      status: 'ok',
      query,
      page,
      perPage,
      totalResults,
      photos,
    };
  }

  return null;
}

function interpretToolOutput(value: ToolOutput): GalleryState {
  if (value == null) {
    return { kind: 'loading' };
  }

  const candidates = collectCandidates(value);

  for (const candidate of candidates) {
    const parsed = parsePexelsStructuredContent(candidate);
    if (!parsed) continue;

    if (parsed.status === 'error') {
      return { kind: 'error', message: parsed.message, query: parsed.query };
    }

    return parsed.photos.length > 0
      ? { kind: 'results', data: parsed }
      : { kind: 'idle', query: parsed.query };
  }

  return { kind: 'idle' };
}

export function App() {
  const toolOutput = useToolOutput();
  const theme = useTheme();
  const safeArea = useSafeArea();
  const maxHeight = useMaxHeight();
  const displayMode = useDisplayMode();
  const tokens = useMemo(() => createThemeTokens(theme), [theme]);
  const [isRequestingFullscreen, setIsRequestingFullscreen] = useState(false);
  const [pendingDisplayMode, setPendingDisplayMode] = useState<DisplayMode | null>(null);
  const parsedOutput = useMemo(() => interpretToolOutput(toolOutput), [toolOutput]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: false,
    containScroll: 'trimSnaps',
    slidesToScroll: 'auto',
    dragFree: false,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const rootStyle = useMemo<React.CSSProperties>(() => {
    const top = 12 + (safeArea?.insets.top ?? 0);
    const right = 16 + (safeArea?.insets.right ?? 0);
    const bottom = 16 + (safeArea?.insets.bottom ?? 0);
    const left = 16 + (safeArea?.insets.left ?? 0);

    return {
      padding: `${top}px ${right}px ${bottom}px ${left}px`,
      fontFamily: tokens.fontFamily,
      color: 'inherit',
      background: 'transparent',
      boxSizing: 'border-box',
      maxHeight: maxHeight != null ? `${maxHeight}px` : undefined,
      overflowY: maxHeight != null ? 'auto' : undefined,
    };
  }, [safeArea, tokens, maxHeight]);

  const navButtonBaseStyle = useMemo<React.CSSProperties>(
    () => ({
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 10,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '1.75rem',
      width: '1.75rem',
      borderRadius: '9999px',
      border: `1px solid ${tokens.carouselButtonBorder}`,
      backgroundColor: tokens.carouselButtonBackground,
      color: tokens.carouselButtonColor,
      cursor: 'pointer',
      transition: 'opacity 0.2s ease',
      opacity: 1,
    }),
    [tokens]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const updateButtons = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    updateButtons();
    emblaApi.on('select', updateButtons);
    emblaApi.on('reInit', updateButtons);
    return () => {
      emblaApi.off('select', updateButtons);
      emblaApi.off('reInit', updateButtons);
    };
  }, [emblaApi]);

  const handleRequestDisplayMode = useCallback(
    async (mode: DisplayMode) => {
      if (pendingDisplayMode || displayMode === mode) return;
      if (!window.openai?.requestDisplayMode) return;

      try {
        if (mode === 'fullscreen') {
          setIsRequestingFullscreen(true);
        }
        setPendingDisplayMode(mode);
        await window.openai.requestDisplayMode({ mode });
      } catch (error) {
        console.error('Failed to request display mode:', error);
      } finally {
        setPendingDisplayMode(null);
        setIsRequestingFullscreen(false);
      }
    },
    [displayMode, pendingDisplayMode]
  );

  const handleOpenExternal = useCallback((href: string) => {
    if (!window.openai?.openExternal) {
      console.warn('openExternal is unavailable.');
      return;
    }
    window.openai.openExternal({ href });
  }, []);

  let galleryContent: React.ReactNode;

  if (parsedOutput.kind === 'loading') {
    galleryContent = <LoadingCard message="Preparing your Pexels gallery…" />;
  } else if (parsedOutput.kind === 'error') {
    galleryContent = (
      <EmptyStateCard
        title="We couldn’t load Pexels"
        message={parsedOutput.message || 'Please try your search again.'}
        role="alert"
      />
    );
  } else if (parsedOutput.kind === 'results') {
    const { data } = parsedOutput;
    galleryContent = (
      <div style={{ position: 'relative', width: '100%' }}>
        <div style={{ overflow: 'hidden' }} ref={emblaRef}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {data.photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} onOpenExternal={handleOpenExternal} />
            ))}
          </div>
        </div>
        {canPrev && (
          <button
            aria-label="Previous"
            style={{ ...navButtonBaseStyle, left: '0.5rem' }}
            onClick={() => emblaApi && emblaApi.scrollPrev()}
            type="button"
            onFocus={(event) => {
              event.currentTarget.style.opacity = '0.9';
            }}
            onBlur={(event) => {
              event.currentTarget.style.opacity = '1';
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.opacity = '0.85';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.opacity = '1';
            }}
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
          </button>
        )}
        {canNext && (
          <button
            aria-label="Next"
            style={{ ...navButtonBaseStyle, right: '0.5rem' }}
            onClick={() => emblaApi && emblaApi.scrollNext()}
            type="button"
            onFocus={(event) => {
              event.currentTarget.style.opacity = '0.9';
            }}
            onBlur={(event) => {
              event.currentTarget.style.opacity = '1';
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.opacity = '0.85';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.opacity = '1';
            }}
          >
            <ArrowRight size={18} strokeWidth={1.5} />
          </button>
        )}
      </div>
    );
  } else {
    const hasQuery = Boolean(parsedOutput.query);
    galleryContent = (
      <EmptyStateCard
        title={hasQuery ? `No results for “${parsedOutput.query}”` : 'Ready for Pexels results'}
        message={
          hasQuery
            ? 'Try a different keyword, adjust orientation filters, or broaden your search terms.'
            : 'Invoke the Pexels search tool from the assistant or wire up a callTool handler to fetch photos.'
        }
      />
    );
  }

  return (
    <ThemeTokensProvider tokens={tokens}>
      <div style={rootStyle}>{galleryContent}</div>
    </ThemeTokensProvider>
  );
}
