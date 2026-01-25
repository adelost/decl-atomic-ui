import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Callback, Intent } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Execute a callback (function or Intent)
 * For Intent objects, looks up the handler in the intent registry.
 */
export function executeCallback(callback: Callback): unknown {
  if (typeof callback === 'function') {
    return callback();
  }
  // Intent object - look up in registry
  const handler = intentRegistry.get(callback.action);
  if (handler) {
    return handler(callback.payload);
  }
  console.warn(`No handler registered for intent: ${callback.action}`);
  return undefined;
}

// Intent registry for server-driven UI
const intentRegistry = new Map<string, (payload?: Record<string, unknown>) => unknown>();

export function registerIntent(action: string, handler: (payload?: Record<string, unknown>) => unknown) {
  intentRegistry.set(action, handler);
}

export function clearIntents() {
  intentRegistry.clear();
}

/**
 * Emit a custom event for effects, achievements, analytics, etc.
 *
 * @example
 * // Trigger an effect
 * emit('confetti', { count: 50 });
 *
 * // Listen for it (in a custom effect component)
 * window.addEventListener('daui:confetti', (e) => showConfetti(e.detail));
 */
export function emit(event: string, detail?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(`daui:${event}`, { detail }));
  }
}
