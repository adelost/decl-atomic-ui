import type { Page, Section } from 'svelte-daui';
import { showcaseStore } from '../stores/showcase.svelte';
import {
  atomShowcases,
  moleculeShowcases,
  organismShowcases,
  organismModals,
  extensionShowcases,
} from './components/index';

// Search-aware visibility: showcase items filter by title/description,
// non-showcase items (headers, dividers) hide when searching
function withSearch(sections: Section[]): Section[] {
  return sections.map((section) => {
    if ('molecule' in section && section.molecule === 'showcase') {
      const title = ('title' in section ? (section.title as string) : '') ?? '';
      const desc = ('description' in section ? (section.description as string) : '') ?? '';
      return {
        ...section,
        visible: () => {
          const q = showcaseStore.componentSearch.toLowerCase().trim();
          if (!q) return true;
          return title.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
        },
      };
    }
    return { ...section, visible: () => !showcaseStore.componentSearch.trim() };
  }) as Section[];
}

const searchInput = {
  atom: 'search-input' as const,
  id: 'component-search',
  placeholder: 'Filter components...',
  value: () => showcaseStore.componentSearch,
  onChange: (v: string) => { showcaseStore.componentSearch = v; },
};

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
              items: [searchInput, ...withSearch(atomShowcases)],
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
              items: [searchInput, ...withSearch(moleculeShowcases)],
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
              items: [searchInput, ...withSearch(organismShowcases)],
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
              items: [searchInput, ...withSearch(extensionShowcases)],
            },
          ],
        },
      ],
    },

    // Modal instances (rendered at page level)
    ...organismModals,
  ],
} satisfies Page;
