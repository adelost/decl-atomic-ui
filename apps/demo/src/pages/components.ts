import type { Page } from 'svelte-daui';
import { showcaseStore } from '../stores/showcase.svelte';
import {
  atomShowcases,
  moleculeShowcases,
  organismShowcases,
  organismModals,
  extensionShowcases,
} from './components/index';

/**
 * Components Catalog
 * Unified view with Preview + Code + Variants for each component
 *
 * Structure:
 * - stores/showcase.svelte.ts - Shared demo state
 * - pages/components/atoms.ts - Atom showcases (~350 lines)
 * - pages/components/molecules.ts - Molecule showcases (~280 lines)
 * - pages/components/organisms.ts - Organism showcases (~180 lines)
 * - pages/components/extensions.ts - Extension showcases (~180 lines)
 */
export const componentsPage = {
  layout: 'full',
  title: '',
  shortcuts: [
    {
      keys: '↑↑↓↓←→←→',
      action: showcaseStore.onSecretCode,
      description: 'Secret Code',
      once: true,
    },
  ],
  sections: [
    // Header
    {
      molecule: 'stack',
      direction: 'horizontal',
      justify: 'between',
      align: 'center',
      padding: 'md',
      items: [
        {
          molecule: 'stack',
          direction: 'vertical',
          gap: 'none',
          items: [
            { atom: 'text', variant: 'heading', text: 'DAUI Components' },
            {
              molecule: 'stack',
              direction: 'horizontal',
              gap: 'sm',
              align: 'center',
              items: [
                { atom: 'text', variant: 'muted', text: 'Preview + Code for each component' },
                {
                  atom: 'badge',
                  text: '🎮 Secret Code!',
                  color: 'gold',
                  visible: () => showcaseStore.secretUnlocked,
                },
              ],
            },
          ],
        },
      ],
    },

    // Tabs - each tab content comes from separate files
    {
      molecule: 'tabs',
      id: 'component-tabs',
      tabs: [
        {
          id: 'atoms',
          label: 'Atoms',
          content: [
            {
              molecule: 'stack',
              direction: 'vertical',
              gap: 'lg',
              padding: 'md',
              items: atomShowcases,
            },
          ],
        },
        {
          id: 'molecules',
          label: 'Molecules',
          content: [
            {
              molecule: 'stack',
              direction: 'vertical',
              gap: 'lg',
              padding: 'md',
              items: moleculeShowcases,
            },
          ],
        },
        {
          id: 'organisms',
          label: 'Organisms',
          content: [
            {
              molecule: 'stack',
              direction: 'vertical',
              gap: 'lg',
              padding: 'md',
              items: organismShowcases,
            },
          ],
        },
        {
          id: 'extensions',
          label: 'Extensions',
          content: [
            {
              molecule: 'stack',
              direction: 'vertical',
              gap: 'lg',
              padding: 'md',
              items: extensionShowcases,
            },
          ],
        },
      ],
    },

    // Modal instances (rendered at page level)
    ...organismModals,
  ],
} satisfies Page;
