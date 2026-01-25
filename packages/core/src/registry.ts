/**
 * DAUI Component Registry
 *
 * Preset-based registration for tree-shaking.
 * Components are registered via presets, not hardcoded.
 */

export type ComponentType = 'atom' | 'molecule' | 'organism';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyComponent = any;

export interface Preset {
  atoms?: Record<string, AnyComponent>;
  molecules?: Record<string, AnyComponent>;
  organisms?: Record<string, AnyComponent>;
}

// Registered components (from presets)
const components = {
  atoms: new Map<string, AnyComponent>(),
  molecules: new Map<string, AnyComponent>(),
  organisms: new Map<string, AnyComponent>(),
};

// User overrides (take precedence over presets)
const overrides: Preset = {
  atoms: {},
  molecules: {},
  organisms: {},
};

/**
 * Register one or more presets
 *
 * @example
 * ```ts
 * import { register } from '@daui/core';
 * import { media } from 'svelte-daui/media';
 * register(media);
 * ```
 */
export function register(...presets: Preset[]): void {
  for (const preset of presets) {
    if (preset.atoms) {
      for (const [name, comp] of Object.entries(preset.atoms)) {
        components.atoms.set(name, comp);
      }
    }
    if (preset.molecules) {
      for (const [name, comp] of Object.entries(preset.molecules)) {
        components.molecules.set(name, comp);
      }
    }
    if (preset.organisms) {
      for (const [name, comp] of Object.entries(preset.organisms)) {
        components.organisms.set(name, comp);
      }
    }
  }
}

/**
 * Get a component by type and name
 * Returns override if exists, otherwise registered preset component
 */
export function getComponent(
  type: 'atom' | 'molecule' | 'organism',
  name: string
): AnyComponent | undefined {
  const key = (type + 's') as 'atoms' | 'molecules' | 'organisms';
  // Check override first, then registered component
  return overrides[key]?.[name] ?? components[key].get(name);
}

/**
 * Check if a component is registered (either via preset or override)
 */
export function isRegistered(
  type: 'atom' | 'molecule' | 'organism',
  name: string
): boolean {
  const key = (type + 's') as 'atoms' | 'molecules' | 'organisms';
  return overrides[key]?.[name] !== undefined || components[key].has(name);
}

/**
 * Register a custom component override
 * @deprecated Use register({ atoms: { button: MyButton } }) instead
 */
export function registerComponent(
  type: ComponentType,
  name: string,
  component: AnyComponent
): void {
  if (type === 'atom') {
    overrides.atoms![name] = component;
  } else if (type === 'molecule') {
    overrides.molecules![name] = component;
  } else {
    overrides.organisms![name] = component;
  }
}

/**
 * Register multiple component overrides at once
 * @deprecated Use register() instead
 */
export function registerComponents(preset: Partial<Preset>): void {
  if (preset.atoms) {
    overrides.atoms = { ...overrides.atoms, ...preset.atoms };
  }
  if (preset.molecules) {
    overrides.molecules = { ...overrides.molecules, ...preset.molecules };
  }
  if (preset.organisms) {
    overrides.organisms = { ...overrides.organisms, ...preset.organisms };
  }
}

/**
 * Get a registered component override
 * @deprecated Use getComponent() instead
 */
export function getOverride(
  type: ComponentType,
  name: string
): AnyComponent | undefined {
  return getComponent(type, name);
}

/**
 * Check if a component has been overridden
 * @deprecated Use isRegistered() instead
 */
export function hasOverride(type: ComponentType, name: string): boolean {
  return isRegistered(type, name);
}

/**
 * Clear all registered components and overrides (useful for testing)
 */
export function clearRegistry(): void {
  components.atoms.clear();
  components.molecules.clear();
  components.organisms.clear();
  overrides.atoms = {};
  overrides.molecules = {};
  overrides.organisms = {};
}
