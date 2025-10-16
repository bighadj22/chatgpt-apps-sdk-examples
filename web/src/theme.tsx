import React from 'react';

export interface ThemeTokens {
  fontFamily: string;
  cardSurface: string;
  cardBorder: string;
  subtleTextColor: string;
  headlineColor: string;
  cardShadow: string;
  primaryButtonBackground: string;
  primaryButtonText: string;
  carouselButtonBackground: string;
  carouselButtonColor: string;
  carouselButtonBorder: string;
}

const DEFAULT_THEME: ThemeTokens = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  cardSurface: 'transparent',
  cardBorder: 'transparent',
  subtleTextColor: 'rgba(31, 41, 55, 0.74)',
  headlineColor: 'rgba(17, 24, 39, 0.92)',
  cardShadow: 'none',
  primaryButtonBackground: '#F46C21',
  primaryButtonText: '#ffffff',
  carouselButtonBackground: 'rgba(255, 255, 255, 0.9)',
  carouselButtonColor: '#1f2937',
  carouselButtonBorder: 'rgba(15, 23, 42, 0.08)',
};

export function createThemeTokens(inputTheme: string | null | undefined): ThemeTokens {
  if (inputTheme === 'dark') {
    return {
      ...DEFAULT_THEME,
      cardSurface: 'transparent',
      cardBorder: 'transparent',
      subtleTextColor: 'rgba(203, 213, 225, 0.82)',
      headlineColor: '#f8fafc',
      carouselButtonBackground: 'rgba(15, 23, 42, 0.68)',
      carouselButtonColor: '#f9fafb',
      carouselButtonBorder: 'rgba(148, 163, 184, 0.3)',
    };
  }

  return DEFAULT_THEME;
}

const ThemeTokensContext = React.createContext<ThemeTokens>(DEFAULT_THEME);

export function ThemeTokensProvider({
  tokens,
  children,
}: React.PropsWithChildren<{ tokens: ThemeTokens }>) {
  return <ThemeTokensContext.Provider value={tokens}>{children}</ThemeTokensContext.Provider>;
}

export function useThemeTokens(): ThemeTokens {
  return React.useContext(ThemeTokensContext);
}
