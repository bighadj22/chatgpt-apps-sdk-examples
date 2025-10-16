import React, { useMemo } from 'react';
import type { PexelsPhoto } from '../../types';
import { Card } from './Card';
import { useThemeTokens } from '../../theme';

interface PhotoCardProps {
  photo: PexelsPhoto;
  onOpenExternal: (url: string) => void;
}

export function PhotoCard({ photo, onOpenExternal }: PhotoCardProps) {
  const tokens = useThemeTokens();
  const title = photo.alt?.trim() || 'Untitled photo';
  const buttonStyle = useMemo<React.CSSProperties>(
    () => ({
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 18,
      padding: '8px 16px',
      fontSize: '0.8125rem',
      fontWeight: 600,
      letterSpacing: '0.15px',
      border: 'none',
      backgroundColor: tokens.primaryButtonBackground,
      color: tokens.primaryButtonText,
      transition: 'opacity 0.2s ease',
      opacity: 1,
    }),
    [tokens]
  );

  return (
    <div style={{ flex: '0 0 220px', maxWidth: 220, display: 'flex' }}>
      <Card style={{ width: '100%', gap: 12, padding: 0 }}>
        <img
          src={photo.src.large}
          alt={photo.alt || `Photo by ${photo.photographer}`}
          style={{
            width: '100%',
            aspectRatio: '3 / 4',
            borderRadius: 8,
            objectFit: 'cover',
            boxShadow: '0 18px 35px rgba(15, 23, 42, 0.08)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 8, paddingTop: 10 }}>
          <div
            style={{
              fontSize: '1.05rem',
              fontWeight: 600,
              lineHeight: 1.3,
              color: tokens.headlineColor,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: '0.82rem', color: tokens.subtleTextColor, lineHeight: 1.5 }}>
            by {photo.photographer}
          </div>
          <div style={{ marginTop: 'auto' }}>
            <button
              type="button"
              onClick={() => onOpenExternal(photo.url)}
              style={buttonStyle}
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
              View on Pexels
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
