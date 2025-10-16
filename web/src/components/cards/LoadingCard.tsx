import React from 'react';
import { Card } from './Card';
import { useThemeTokens } from '../../theme';

/**
 * Lightweight loading indicator that reuses starter-kit styles.
 */
export function LoadingCard({ message }: { message: string }) {
  const tokens = useThemeTokens();

  return (
    <Card style={{ padding: 14 }}>
      <div
        role="status"
        aria-live="polite"
        style={{ fontSize: '0.82rem', color: tokens.subtleTextColor, display: 'flex', gap: 6 }}
      >
        <span aria-hidden="true" />
        <span>{message}</span>
      </div>
    </Card>
  );
}
