import { useState, useEffect, useCallback } from 'react';
import type { WidgetState } from '../types';
import { useOpenAiGlobal } from './use-openai-global';

type SetStateAction<T> = T | ((prevState: T) => T);

/**
 * Hook to sync React state with window.openai.widgetState.
 * Changes are persisted via window.openai.setWidgetState().
 */
export function useWidgetState<T extends WidgetState>(
  defaultState: T | (() => T)
): readonly [T | null, (state: SetStateAction<T | null>) => void] {
  const widgetStateFromWindow = useOpenAiGlobal('widgetState') as T | null;

  const [widgetState, _setWidgetState] = useState<T | null>(() => {
    if (widgetStateFromWindow != null) {
      return widgetStateFromWindow;
    }
    return typeof defaultState === 'function' ? defaultState() : defaultState ?? null;
  });

  // Sync when window.openai.widgetState changes
  useEffect(() => {
    if (widgetStateFromWindow !== undefined) {
      _setWidgetState(widgetStateFromWindow);
    }
  }, [widgetStateFromWindow]);

  const setWidgetState = useCallback(
    (state: SetStateAction<T | null>) => {
      _setWidgetState((prevState) => {
        const newState = typeof state === 'function' ? state(prevState) : state;
        if (newState != null && window.openai?.setWidgetState) {
          window.openai.setWidgetState(newState);
        }
        return newState;
      });
    },
    []
  );

  return [widgetState, setWidgetState] as const;
}
