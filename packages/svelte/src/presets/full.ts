/**
 * Full preset - all UI components
 * For demos and prototypes
 * Does NOT include integrations (three, matter, motion-canvas)
 */
import type { Preset } from '@daui/core';

import { standard } from './default';
import { media } from './media';

export const full: Preset = {
  atoms: { ...standard.atoms, ...media.atoms },
  molecules: { ...standard.molecules, ...media.molecules },
  organisms: { ...standard.organisms, ...media.organisms },
};
