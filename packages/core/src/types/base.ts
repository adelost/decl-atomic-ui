/**
 * Base interfaces for DAUI type system
 */

/** Common properties for all atoms */
export interface BaseAtom {
  visible?: () => boolean;
}

/** Form field atoms with typed value binding */
export interface FormAtom<T> extends BaseAtom {
  value?: () => T;
  onChange?: (value: T) => unknown;
  validate?: (value: T) => true | string | Promise<true | string>;
}

/**
 * Intent for Server-Driven UI (SDUI)
 *
 * When pages come from a server, functions can't be serialized.
 * Use Intent objects instead, mapped to handlers via an Intent Registry.
 *
 * @example
 * // Code-first (local):
 * onClick: () => cart.add(productId)
 *
 * // Server-driven (serializable):
 * onClick: { action: "cart.add", payload: { productId: "123" } }
 */
export interface Intent {
  action: string;
  payload?: Record<string, unknown>;
}

/** Callback that works both locally (function) and server-driven (Intent) */
export type Callback = (() => unknown) | Intent;
