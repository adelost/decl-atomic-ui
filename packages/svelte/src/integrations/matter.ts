/**
 * Matter.js integration (2D physics)
 *
 * Requires peer dependency: matter-js
 *
 * @example
 * ```bash
 * pnpm add matter-js @types/matter-js
 * ```
 *
 * ```typescript
 * import { register } from 'svelte-daui';
 * import { matter } from 'svelte-daui/integrations/matter';
 *
 * register(matter);
 * ```
 */
import type { Preset } from '@daui/core';

import MatterCanvas from '../atoms/MatterCanvas.svelte';

export const matter: Preset = {
  atoms: {
    'matter-canvas': MatterCanvas,
  },
};
