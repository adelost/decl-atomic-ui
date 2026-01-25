/**
 * Three.js integration
 *
 * Requires peer dependency: three
 *
 * @example
 * ```bash
 * pnpm add three @types/three
 * ```
 *
 * ```typescript
 * import { register } from 'svelte-daui';
 * import { three } from 'svelte-daui/integrations/three';
 *
 * register(three);
 * ```
 */
import type { Preset } from '@daui/core';

import ThreeCanvas from '../atoms/ThreeCanvas.svelte';

export const three: Preset = {
  atoms: {
    'three-canvas': ThreeCanvas,
  },
};
