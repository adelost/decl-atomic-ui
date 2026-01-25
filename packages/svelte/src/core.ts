/**
 * svelte-daui/core - Minimal entry point
 *
 * NO auto-registration - user must register presets manually.
 * Use this for minimal bundle size.
 *
 * @example
 * ```ts
 * import { PageRenderer, register } from 'svelte-daui/core';
 * import { core } from 'svelte-daui/presets';
 *
 * register(core);
 * ```
 */

// Re-export all types and utilities from core
export * from '@daui/core';

// Export renderers
export { default as PageRenderer } from './renderer/PageRenderer.svelte';
export { default as SectionRenderer } from './renderer/SectionRenderer.svelte';
export { default as AtomRenderer } from './renderer/AtomRenderer.svelte';
export { default as MoleculeRenderer } from './renderer/MoleculeRenderer.svelte';
export { default as OrganismRenderer } from './renderer/OrganismRenderer.svelte';
