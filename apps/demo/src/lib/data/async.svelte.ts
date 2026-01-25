/**
 * Async Data Utilities for DAUI
 *
 * Provides standardized patterns for loading states, error handling,
 * and data fetching with Svelte 5 reactivity.
 */

// ============================================
// TYPES
// ============================================

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncData<T> {
  status: AsyncStatus;
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export interface AsyncActions<T> {
  /** Execute the async operation */
  execute: (...args: any[]) => Promise<T>;
  /** Reset to idle state */
  reset: () => void;
  /** Manually set data */
  setData: (data: T) => void;
  /** Manually set error */
  setError: (error: Error) => void;
}

export type AsyncState<T> = AsyncData<T> & AsyncActions<T>;

// ============================================
// CREATE ASYNC STATE
// ============================================

/**
 * Create a reactive async state for data fetching
 *
 * @example
 * ```ts
 * const members = createAsyncState(async () => {
 *   const res = await fetch('/api/members');
 *   return res.json();
 * });
 *
 * // In component or onMount:
 * members.execute();
 *
 * // In page definition:
 * { organism: "table", data: () => members.data ?? [] }
 * { atom: "text", text: "Loading...", visible: () => members.isLoading }
 * ```
 */
export function createAsyncState<T, Args extends any[] = []>(
  fetcher: (...args: Args) => Promise<T>
): AsyncState<T> {
  let status = $state<AsyncStatus>('idle');
  let data = $state<T | null>(null);
  let error = $state<Error | null>(null);

  const isLoading = $derived(status === 'loading');
  const isSuccess = $derived(status === 'success');
  const isError = $derived(status === 'error');

  async function execute(...args: Args): Promise<T> {
    status = 'loading';
    error = null;

    try {
      const result = await fetcher(...args);
      data = result;
      status = 'success';
      return result;
    } catch (e) {
      error = e instanceof Error ? e : new Error(String(e));
      status = 'error';
      throw error;
    }
  }

  function reset() {
    status = 'idle';
    data = null;
    error = null;
  }

  function setData(newData: T) {
    data = newData;
    status = 'success';
    error = null;
  }

  function setError(newError: Error) {
    error = newError;
    status = 'error';
  }

  return {
    get status() {
      return status;
    },
    get data() {
      return data;
    },
    get error() {
      return error;
    },
    get isLoading() {
      return isLoading;
    },
    get isSuccess() {
      return isSuccess;
    },
    get isError() {
      return isError;
    },
    execute,
    reset,
    setData,
    setError,
  };
}

// ============================================
// FETCH WITH RETRY
// ============================================

export interface RetryOptions {
  maxRetries?: number;
  delay?: number;
  backoff?: 'linear' | 'exponential';
}

/**
 * Fetch with automatic retry on failure
 */
export async function fetchWithRetry<T>(
  fetcher: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, delay = 1000, backoff = 'exponential' } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fetcher();
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));

      if (attempt < maxRetries) {
        const waitTime =
          backoff === 'exponential' ? delay * Math.pow(2, attempt) : delay * (attempt + 1);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
}

// ============================================
// OPTIMISTIC UPDATE
// ============================================

/**
 * Helper for optimistic updates with rollback on error
 *
 * @example
 * ```ts
 * async function deleteMember(id: string) {
 *   await optimisticUpdate(
 *     // Optimistic update
 *     () => { store.members = store.members.filter(m => m.id !== id); },
 *     // Actual API call
 *     () => api.delete(`/members/${id}`),
 *     // Rollback on error
 *     (members) => { store.members = members; },
 *     // Current value for rollback
 *     store.members
 *   );
 * }
 * ```
 */
export async function optimisticUpdate<T, R>(
  optimisticFn: () => void,
  apiFn: () => Promise<R>,
  rollbackFn: (previousValue: T) => void,
  previousValue: T
): Promise<R> {
  // Apply optimistic update immediately
  optimisticFn();

  try {
    // Execute actual API call
    return await apiFn();
  } catch (e) {
    // Rollback on error
    rollbackFn(previousValue);
    throw e;
  }
}
