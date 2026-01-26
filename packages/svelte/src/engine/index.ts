/**
 * DAUI Engine
 *
 * Core runtime for declarative actions and async resources.
 */

// Effect Registry
export {
  registerEffect,
  executeEffect,
  executeEffects,
} from './effectRegistry';

// Action Handler
export {
  createActionHandler,
  createButtonActionHandler,
} from './actionHandler';

// Async Handler
export {
  createAsyncResource,
  clearAsyncCache,
  invalidateResource,
  type AsyncResourceOptions,
} from './asyncHandler';

// Components
export { default as AsyncWrapper } from './AsyncWrapper.svelte';
