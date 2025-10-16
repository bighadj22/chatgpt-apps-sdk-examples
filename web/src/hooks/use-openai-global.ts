import { useSyncExternalStore } from 'react';
import type { OpenAiGlobals, SetGlobalsEvent } from '../types';

/**
 * Hook to subscribe to a specific window.openai global value.
 * Automatically re-renders when the value changes via 'openai:set_globals' event.
 */
export function useOpenAiGlobal<K extends keyof OpenAiGlobals>(
  key: K
): OpenAiGlobals[K] {
  return useSyncExternalStore(
    (onChange) => {
      const handleSetGlobal = (event: SetGlobalsEvent) => {
        const value = event.detail.globals[key];
        if (value === undefined) return;
        onChange();
      };

      window.addEventListener('openai:set_globals', handleSetGlobal as EventListener, {
        passive: true,
      });

      return () => {
        window.removeEventListener('openai:set_globals', handleSetGlobal as EventListener);
      };
    },
    () => window.openai?.[key]
  );
}

// Convenience hooks for commonly used globals
export function useTheme() {
  return useOpenAiGlobal('theme');
}

export function useDisplayMode() {
  return useOpenAiGlobal('displayMode');
}

export function useMaxHeight() {
  return useOpenAiGlobal('maxHeight');
}

export function useSafeArea() {
  return useOpenAiGlobal('safeArea');
}

export function useToolInput() {
  return useOpenAiGlobal('toolInput');
}

export function useToolOutput() {
  return useOpenAiGlobal('toolOutput');
}
