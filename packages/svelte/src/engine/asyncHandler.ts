/**
 * Async Resource Handler
 *
 * Provides declarative data fetching with loading states, caching, and polling.
 * Uses Svelte stores for reactivity.
 */

import { writable, type Readable } from 'svelte/store';
import type { AsyncConfig, AsyncState } from '@daui/core';

// Simple cache implementation
const cache = new Map<string, { data: unknown; expires: number }>();

/**
 * Extract value from object using dot-notation path
 */
function extractPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Apply field mapping to transform data
 */
function applyMapping<T>(data: T[], mapping: Record<string, string>): T[] {
  return data.map((item) => {
    const mapped: Record<string, unknown> = { ...item as object };
    for (const [targetKey, sourceKey] of Object.entries(mapping)) {
      if (item && typeof item === 'object' && sourceKey in item) {
        mapped[targetKey] = (item as Record<string, unknown>)[sourceKey];
      }
    }
    return mapped as T;
  });
}

export interface AsyncResourceOptions {
  /** Path to extract from response (e.g., "data.items") */
  $path?: string;
  /** Field mapping for transforming response */
  $map?: Record<string, string>;
}

/**
 * Create an async resource store for data fetching
 *
 * @example
 * const users = createAsyncResource('/api/users');
 * // $users.data, $users.loading, $users.error
 *
 * @example
 * const orders = createAsyncResource({
 *   url: '/api/orders',
 *   poll: 5000,
 *   cache: 30000
 * }, { $path: 'data.orders' });
 */
export function createAsyncResource<T>(
  config: string | AsyncConfig,
  options: AsyncResourceOptions = {}
): Readable<AsyncState<T>> {
  const url = typeof config === 'string' ? config : config.url;
  const pollInterval = typeof config === 'object' ? config.poll : undefined;
  const cacheMs = typeof config === 'object' ? config.cache : undefined;
  const { $path, $map } = options;

  const state = writable<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  let pollTimer: ReturnType<typeof setInterval> | null = null;

  async function fetchData() {
    // Check cache first
    if (cacheMs) {
      const cached = cache.get(url);
      if (cached && cached.expires > Date.now()) {
        state.set({ data: cached.data as T, loading: false, error: null });
        return;
      }
    }

    state.update((s) => ({ ...s, loading: true, error: null }));

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let data = await response.json();

      // Extract from path if specified
      if ($path) {
        data = extractPath(data, $path);
      }

      // Apply mapping if specified
      if ($map && Array.isArray(data)) {
        data = applyMapping(data, $map);
      }

      // Cache if configured
      if (cacheMs) {
        cache.set(url, { data, expires: Date.now() + cacheMs });
      }

      state.set({ data, loading: false, error: null });
    } catch (error) {
      state.set({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch data',
      });
    }
  }

  // Initial fetch
  fetchData();

  // Set up polling if configured
  if (pollInterval && pollInterval > 0) {
    pollTimer = setInterval(fetchData, pollInterval);
  }

  // Return a readable store with cleanup
  return {
    subscribe: (run, invalidate) => {
      const unsubscribe = state.subscribe(run, invalidate);

      return () => {
        if (pollTimer) {
          clearInterval(pollTimer);
          pollTimer = null;
        }
        unsubscribe();
      };
    },
  };
}

/**
 * Clear the async resource cache
 */
export function clearAsyncCache(url?: string): void {
  if (url) {
    cache.delete(url);
  } else {
    cache.clear();
  }
}

/**
 * Manually refresh an async resource
 * (for use with the invalidate effect)
 */
export function invalidateResource(url: string): void {
  cache.delete(url);
  // Dispatch event for any listening resources
  window.dispatchEvent(
    new CustomEvent('daui:resource-invalidated', {
      detail: { url },
    })
  );
}
