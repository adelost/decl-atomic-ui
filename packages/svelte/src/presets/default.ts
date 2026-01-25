/**
 * Default preset - standard components for most apps
 * Includes core + table + charts + TreeView
 */
import type { Preset } from '@daui/core';

import { core } from './core';
import { table } from './table';
import { charts } from './charts';
import TreeView from '../organisms/TreeView.svelte';

// Note: exported as both 'default' and 'standard' for convenience
// since 'default' is a reserved keyword in some contexts
export const standard: Preset = {
  atoms: { ...core.atoms, ...charts.atoms },
  molecules: { ...core.molecules, ...table.molecules, ...charts.molecules },
  organisms: { ...core.organisms, ...table.organisms, 'tree-view': TreeView },
};

// Also export as 'defaults' to avoid reserved keyword issues
export { standard as defaults };
