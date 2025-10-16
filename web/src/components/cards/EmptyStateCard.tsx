import React from 'react';
import { Card } from './Card';
import { useThemeTokens } from '../../theme';

interface EmptyStateCardProps {
  title: string;
  message: string;
  role?: 'status' | 'alert';
  children?: React.ReactNode;
}

/**
 * Standardized empty-state panel for both neutral and error scenarios.
 */
export function EmptyStateCard({ title, message, role = 'status', children }: EmptyStateCardProps) {
  const tokens = useThemeTokens();

  return (
    <Card style={{ padding: 14 }}>
      <div
        role={role}
        aria-live="polite"
        style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        <div style={{ fontSize: '1.0625rem', fontWeight: 600, color: tokens.headlineColor }}>
          {title}
        </div>
        <div style={{ fontSize: '0.85rem', color: tokens.subtleTextColor }}>{message}</div>
        {children}
      </div>
    </Card>
  );
}
