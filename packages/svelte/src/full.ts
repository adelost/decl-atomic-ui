/**
 * svelte-daui/full - Full entry point
 *
 * Auto-registers ALL components including media and TreeView.
 * For demos and prototypes where bundle size doesn't matter.
 *
 * @example
 * ```ts
 * import { PageRenderer } from 'svelte-daui/full';
 * ```
 */

// Auto-register full preset (all components)
import { register } from '@daui/core';
import { full } from './presets/full';
register(full);

// Re-export all types and utilities from core
export * from '@daui/core';

// Export renderers
export { default as PageRenderer } from './renderer/PageRenderer.svelte';
export { default as SectionRenderer } from './renderer/SectionRenderer.svelte';
export { default as AtomRenderer } from './renderer/AtomRenderer.svelte';
export { default as MoleculeRenderer } from './renderer/MoleculeRenderer.svelte';
export { default as OrganismRenderer } from './renderer/OrganismRenderer.svelte';
