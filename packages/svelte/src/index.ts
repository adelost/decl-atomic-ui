/**
 * svelte-daui - Declarative Atomic UI for Svelte
 *
 * Pages are data, not code.
 *
 * Default export auto-registers the "standard" preset.
 * For minimal bundle, use 'svelte-daui/core' instead.
 */

// Auto-register standard preset
import { register } from '@daui/core';
import { standard } from './presets/default';
register(standard);

// Re-export all types and utilities from core
export * from '@daui/core';

// Export renderers
export { default as PageRenderer } from './renderer/PageRenderer.svelte';
export { default as SectionRenderer } from './renderer/SectionRenderer.svelte';
export { default as AtomRenderer } from './renderer/AtomRenderer.svelte';
export { default as MoleculeRenderer } from './renderer/MoleculeRenderer.svelte';
export { default as OrganismRenderer } from './renderer/OrganismRenderer.svelte';

// Effects (opt-in)
export { default as EffectOverlay } from './effects/EffectOverlay.svelte';

// Engine - Action and Async handlers
export {
  registerEffect,
  executeEffect,
  executeEffects,
  createActionHandler,
  createButtonActionHandler,
  createAsyncResource,
  clearAsyncCache,
  invalidateResource,
  type AsyncResourceOptions,
} from './engine';
export { default as AsyncWrapper } from './engine/AsyncWrapper.svelte';
