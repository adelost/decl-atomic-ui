/**
 * Polling Utilities for DAUI
 *
 * Provides automatic data refresh at intervals with
 * pause/resume, error handling, and cleanup.
 */

import { createAsyncState, type AsyncState } from './async.svelte';

// ============================================
// TYPES
// ============================================

export interface PollingOptions {
  /** Polling interval in milliseconds */
  interval?: number;
  /** Start polling immediately on creation */
  immediate?: boolean;
  /** Pause polling when document is hidden */
  pauseOnHidden?: boolean;
  /** Error callback */
  onError?: (error: Error) => void;
}

export interface PollingState<T> extends AsyncState<T> {
  /** Start polling */
  start: () => void;
  /** Stop polling */
  stop: () => void;
  /** Is currently polling */
  isPolling: boolean;
  /** Manually trigger a refresh */
  refresh: () => Promise<T>;
}

// ============================================
// CREATE POLLING STATE
// ============================================

/**
 * Create a polling state that fetches data at regular intervals
 *
 * @example
 * ```ts
 * const activeUsers = createPollingState(
 *   () => fetch('/api/active-users').then(r => r.json()),
 *   { interval: 5000, immediate: true }
 * );
 *
 * // In page:
 * { molecule: "stat-card", value: () => activeUsers.data?.count ?? 0 }
 *
 * // Control:
 * activeUsers.start();
 * activeUsers.stop();
 * ```
 */
export function createPollingState<T>(
  fetcher: () => Promise<T>,
  options: PollingOptions = {}
): PollingState<T> {
  const { interval = 10000, immediate = false, pauseOnHidden = true, onError } = options;

  const asyncState = createAsyncState(fetcher);
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let isPolling = $state(false);

  function start() {
    if (intervalId) return;

    isPolling = true;

    // Fetch immediately on start
    asyncState.execute().catch((e) => onError?.(e));

    // Then poll at interval
    intervalId = setInterval(() => {
      if (pauseOnHidden && document.hidden) return;
      asyncState.execute().catch((e) => onError?.(e));
    }, interval);
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    isPolling = false;
  }

  async function refresh(): Promise<T> {
    return asyncState.execute();
  }

  // Handle visibility change
  if (pauseOnHidden && typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && isPolling) {
        // Refresh immediately when tab becomes visible
        asyncState.execute().catch((e) => onError?.(e));
      }
    });
  }

  // Start immediately if requested
  if (immediate) {
    start();
  }

  return {
    get status() {
      return asyncState.status;
    },
    get data() {
      return asyncState.data;
    },
    get error() {
      return asyncState.error;
    },
    get isLoading() {
      return asyncState.isLoading;
    },
    get isSuccess() {
      return asyncState.isSuccess;
    },
    get isError() {
      return asyncState.isError;
    },
    get isPolling() {
      return isPolling;
    },
    execute: asyncState.execute,
    reset: asyncState.reset,
    setData: asyncState.setData,
    setError: asyncState.setError,
    start,
    stop,
    refresh,
  };
}

// ============================================
// SMART POLLING (with backoff)
// ============================================

export interface SmartPollingOptions extends PollingOptions {
  /** Minimum interval (during high activity) */
  minInterval?: number;
  /** Maximum interval (during low activity) */
  maxInterval?: number;
  /** Increase interval when data hasn't changed */
  adaptiveInterval?: boolean;
}

/**
 * Smart polling that adapts interval based on data changes
 */
export function createSmartPollingState<T>(
  fetcher: () => Promise<T>,
  options: SmartPollingOptions = {}
): PollingState<T> {
  const {
    minInterval = 2000,
    maxInterval = 30000,
    adaptiveInterval = true,
    ...pollingOptions
  } = options;

  let currentInterval = pollingOptions.interval ?? 5000;
  let lastDataHash: string | null = null;

  const wrappedFetcher = async () => {
    const data = await fetcher();

    if (adaptiveInterval) {
      const newHash = JSON.stringify(data);
      if (newHash === lastDataHash) {
        // Data unchanged, increase interval
        currentInterval = Math.min(currentInterval * 1.5, maxInterval);
      } else {
        // Data changed, decrease interval
        currentInterval = Math.max(currentInterval * 0.75, minInterval);
      }
      lastDataHash = newHash;
    }

    return data;
  };

  return createPollingState(wrappedFetcher, {
    ...pollingOptions,
    interval: currentInterval,
  });
}
