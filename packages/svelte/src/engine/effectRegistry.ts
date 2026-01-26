/**
 * Global Effect Registry
 *
 * Provides a registry for side effect handlers that can be triggered
 * declaratively from $action definitions. Effects are executed by name
 * and can be extended/overridden by applications.
 */

import type { SideEffect } from '@daui/core';

type EffectHandler = (effect: SideEffect) => void | Promise<void>;

const handlers = new Map<string, EffectHandler>();

/**
 * Register a custom effect handler
 *
 * @example
 * registerEffect('confetti', (e) => {
 *   launchConfetti(e.color);
 * });
 */
export function registerEffect(event: string, handler: EffectHandler): void {
  handlers.set(event, handler);
}

/**
 * Execute a side effect by its $event type
 */
export async function executeEffect(effect: SideEffect): Promise<void> {
  const handler = handlers.get(effect.$event);
  if (handler) {
    await handler(effect);
  } else {
    console.warn(`[DAUI] No handler registered for effect: ${effect.$event}`);
  }
}

/**
 * Execute multiple effects in sequence
 */
export async function executeEffects(effects: SideEffect[]): Promise<void> {
  for (const effect of effects) {
    await executeEffect(effect);
  }
}

// ============================================
// DEFAULT HANDLERS
// ============================================

// Toast notification
registerEffect('toast', (effect) => {
  if (effect.$event !== 'toast') return;
  window.dispatchEvent(
    new CustomEvent('daui:toast', {
      detail: {
        text: effect.text,
        variant: effect.variant || 'success',
      },
    })
  );
});

// Close modal
registerEffect('close-modal', (effect) => {
  if (effect.$event !== 'close-modal') return;
  window.dispatchEvent(
    new CustomEvent('daui:close-modal', {
      detail: { id: effect.id },
    })
  );
});

// Invalidate/refresh data
// Dispatches an event that the app can listen to and call SvelteKit's invalidateAll
registerEffect('invalidate', (effect) => {
  if (effect.$event !== 'invalidate') return;
  window.dispatchEvent(
    new CustomEvent('daui:invalidate', {
      detail: { resource: effect.resource },
    })
  );
});

// Redirect
registerEffect('redirect', (effect) => {
  if (effect.$event !== 'redirect') return;
  window.location.href = effect.url;
});

// Emit - escape hatch for custom events
registerEffect('emit', (effect) => {
  if (effect.$event !== 'emit') return;
  window.dispatchEvent(
    new CustomEvent(`daui:${effect.name}`, {
      detail: effect.data,
    })
  );
});
