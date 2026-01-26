/**
 * Action Handler for SvelteKit Form Actions
 *
 * Creates enhance handlers from declarative ActionDef objects,
 * automatically executing side effects based on action results.
 */

import type { ActionDef, SideEffect } from '@daui/core';
import { executeEffects } from './effectRegistry';

/**
 * Result types from SvelteKit form actions
 */
type ActionResultType = 'success' | 'failure' | 'error' | 'redirect';

interface ActionResult {
  type: ActionResultType;
  status?: number;
  data?: Record<string, unknown>;
  location?: string;
  error?: Error;
}

interface SubmitFunction {
  result: ActionResult;
  update: (options?: { reset?: boolean; invalidateAll?: boolean }) => Promise<void>;
  formElement: HTMLFormElement;
  formData: FormData;
  cancel: () => void;
}

/**
 * Create a SvelteKit enhance handler from an ActionDef
 *
 * @example
 * <form use:enhance={createActionHandler({
 *   endpoint: '?/save',
 *   onSuccess: [{ $event: 'toast', text: 'Saved!' }]
 * })}>
 */
export function createActionHandler(actionDef: ActionDef) {
  return function enhanceHandler() {
    // Run onPending effects when form is submitted
    if (actionDef.onPending) {
      executeEffects(actionDef.onPending);
    }

    // Return the callback that handles the result
    return async ({ result, update }: SubmitFunction) => {
      if (result.type === 'success') {
        // Run onSuccess effects
        if (actionDef.onSuccess) {
          await executeEffects(actionDef.onSuccess);
        }
      } else if (result.type === 'failure' || result.type === 'error') {
        // Run onError effects or default error toast
        if (actionDef.onError) {
          await executeEffects(actionDef.onError);
        } else {
          // Default error handling
          const errorMessage =
            result.type === 'failure' && result.data?.message
              ? String(result.data.message)
              : 'Something went wrong';

          await executeEffects([
            { $event: 'toast', text: errorMessage, variant: 'error' } as SideEffect,
          ]);
        }
      } else if (result.type === 'redirect') {
        // SvelteKit will handle the redirect
      }

      // Let SvelteKit update the form state
      await update();
    };
  };
}

/**
 * Create a standalone action executor for buttons/links
 * that aren't part of a form
 */
export function createButtonActionHandler(actionDef: ActionDef) {
  return async () => {
    // Run onPending effects
    if (actionDef.onPending) {
      await executeEffects(actionDef.onPending);
    }

    try {
      const response = await fetch(actionDef.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.ok) {
        if (actionDef.onSuccess) {
          await executeEffects(actionDef.onSuccess);
        }
      } else {
        if (actionDef.onError) {
          await executeEffects(actionDef.onError);
        } else {
          await executeEffects([
            { $event: 'toast', text: 'Action failed', variant: 'error' } as SideEffect,
          ]);
        }
      }
    } catch (error) {
      if (actionDef.onError) {
        await executeEffects(actionDef.onError);
      } else {
        await executeEffects([
          {
            $event: 'toast',
            text: error instanceof Error ? error.message : 'Action failed',
            variant: 'error',
          } as SideEffect,
        ]);
      }
    }
  };
}
