/**
 * Motion Canvas integration
 *
 * Requires peer dependency: @motion-canvas/core
 *
 * @example
 * ```bash
 * pnpm add @motion-canvas/core
 * ```
 *
 * ```typescript
 * import { register } from 'svelte-daui';
 * import { motionCanvas } from 'svelte-daui/integrations/motion-canvas';
 *
 * register(motionCanvas);
 * ```
 */
import type { Preset } from '@daui/core';

import MotionCanvas from '../atoms/MotionCanvas.svelte';

export const motionCanvas: Preset = {
  atoms: {
    'motion-canvas': MotionCanvas,
  },
};
