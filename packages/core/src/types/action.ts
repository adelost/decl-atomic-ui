/**
 * Declarative Actions ($action) and Async Resources ($async)
 *
 * These types enable declarative side effects for forms and buttons,
 * eliminating callback boilerplate while keeping $emit as an escape hatch.
 */

// ============================================
// SIDE EFFECTS
// ============================================

/** Toast notification effect */
export interface ToastEffect {
  $event: 'toast';
  text: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
}

/** Close modal effect */
export interface CloseModalEffect {
  $event: 'close-modal';
  id?: string;
}

/** Invalidate/refresh data effect */
export interface InvalidateEffect {
  $event: 'invalidate';
  resource?: string;
}

/** Redirect to URL effect */
export interface RedirectEffect {
  $event: 'redirect';
  url: string;
}

/**
 * Emit custom event - ESCAPE HATCH
 * For complex cases that can't be handled declaratively
 */
export interface EmitEffect {
  $event: 'emit';
  name: string;
  data?: unknown;
}

/** Union of all side effect types */
export type SideEffect =
  | ToastEffect
  | CloseModalEffect
  | InvalidateEffect
  | RedirectEffect
  | EmitEffect;

// ============================================
// ACTION DEFINITION
// ============================================

/**
 * Declarative action definition for forms/buttons
 *
 * @example
 * {
 *   molecule: 'form',
 *   $action: {
 *     endpoint: '?/createUser',
 *     onSuccess: [
 *       { $event: 'toast', text: 'User created!' },
 *       { $event: 'close-modal' },
 *       { $event: 'invalidate' }
 *     ],
 *     onError: [
 *       { $event: 'toast', text: 'Failed to create user', variant: 'error' }
 *     ]
 *   },
 *   fields: [...]
 * }
 */
export interface ActionDef {
  /** SvelteKit form action endpoint, e.g. "?/create" */
  endpoint: string;
  /** Effects to run immediately when action starts */
  onPending?: SideEffect[];
  /** Effects to run after successful action */
  onSuccess?: SideEffect[];
  /** Effects to run on error (default: toast error) */
  onError?: SideEffect[];
}

// ============================================
// ASYNC RESOURCE
// ============================================

/** Configuration for async data fetching */
export interface AsyncConfig {
  /** URL to fetch data from */
  url: string;
  /** Polling interval in milliseconds */
  poll?: number;
  /** Cache duration in milliseconds */
  cache?: number;
}

/**
 * Async resource for declarative data fetching
 *
 * @example
 * // Simple fetch
 * {
 *   molecule: 'list',
 *   items: {
 *     $async: '/api/users'
 *   }
 * }
 *
 * @example
 * // With polling and path extraction
 * {
 *   molecule: 'list',
 *   items: {
 *     $async: { url: '/api/orders', poll: 5000 },
 *     $path: 'data.orders',
 *     $map: { label: 'name', value: 'id' }
 *   }
 * }
 */
export interface AsyncResource<T = unknown> {
  /** URL string or async config object */
  $async: string | AsyncConfig;
  /** Path to extract from response (e.g., "data.items") */
  $path?: string;
  /** Field mapping for transforming response */
  $map?: Record<string, string>;
}

/** State for async resources */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// LOADING/ERROR STATES
// ============================================

/**
 * Declarative loading state for async resources
 * Can be used with any component that supports $async
 */
export interface AsyncLoadingState {
  /** Loading state content */
  $loading?: import('./index').Section;
  /** Error state content */
  $error?: import('./index').Section;
}
