import React from 'react';
import { useThemeTokens } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Card({ children, style }: CardProps) {
  const tokens = useThemeTokens();

  return (
    <div
      style={{
        backgroundColor: tokens.cardSurface,
        borderRadius: 12,
        padding: 0,
        boxShadow: tokens.cardShadow,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        color: tokens.headlineColor,
        border: tokens.cardBorder === 'transparent' ? undefined : `1px solid ${tokens.cardBorder}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
