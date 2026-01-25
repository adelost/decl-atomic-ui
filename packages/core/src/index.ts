/**
 * @daui/core - Declarative Atomic UI Core
 *
 * Framework-agnostic types, registry, and utilities.
 * Pages are data, not code.
 */

// Types - everything you need to define pages
export * from './types';

// Registry - for presets and custom components
export {
  register,
  getComponent,
  isRegistered,
  clearRegistry,
  // Deprecated (for backwards compatibility)
  registerComponent,
  registerComponents,
  getOverride,
  hasOverride,
  type ComponentType,
  type Preset,
  type AnyComponent,
} from './registry';

// Utilities
export { cn, executeCallback, registerIntent, clearIntents, emit } from './utils';
