/**
 * Full preset - all UI components
 * For demos and prototypes
 * Does NOT include integrations (three, matter, motion-canvas)
 */
import type { Preset } from '@daui/core';

import { standard } from './default';
import { media } from './media';
import { chat } from './chat';

export const full: Preset = {
  atoms: { ...standard.atoms, ...media.atoms, ...chat.atoms },
  molecules: { ...standard.molecules, ...media.molecules, ...chat.molecules },
  organisms: { ...standard.organisms, ...media.organisms, ...chat.organisms },
};
