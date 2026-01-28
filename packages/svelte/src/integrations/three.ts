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
import DepthViewer from '../organisms/DepthViewer.svelte';
import Pose3DViewer from '../organisms/Pose3DViewer.svelte';

export const three: Preset = {
  atoms: {
    'three-canvas': ThreeCanvas,
  },
  organisms: {
    'depth-viewer': DepthViewer,
    'pose-3d-viewer': Pose3DViewer,
  },
};
