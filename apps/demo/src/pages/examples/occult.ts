import type { Page, Section } from 'svelte-daui';
import { occultStore } from '../../stores/occult.svelte';

/**
 * Occult Archive - The Forbidden Library
 */
export const occultPage: Page = {
  layout: 'full',
  title: 'Occult Archive',
  sections: [
    {
      molecule: 'page-header',
      title: 'The Forbidden Archive',
      subtitle: 'Miskatonic University - Restricted Section',
      actions: [
        {
          molecule: 'stack',
          direction: 'horizontal',
          gap: 'md',
          align: 'center',
          items: [
            {
              molecule: 'stack',
              direction: 'vertical',
              gap: 'none',
              align: 'end',
              items: [
                { atom: 'text', variant: 'muted', text: 'Sanity' },
                {
                  atom: 'text',
                  variant: 'heading',
                  text: () => `${occultStore.currentSanity}/${occultStore.maxSanity}`,
                },
              ],
            },
            {
              atom: 'progress',
              value: () => occultStore.sanityPercent,
              max: 100,
              size: 'lg',
              color: () => occultStore.sanityColor,
            },
            {
              atom: 'button',
              text: 'Rest',
              variant: 'secondary',
              onClick: () => occultStore.restSanity(),
            },
          ],
        },
      ] as Section[],
    },
    {
      molecule: 'alert-panel',
      type: () => {
        const status = occultStore.sanityStatus;
        if (status === 'broken') return 'error';
        if (status === 'disturbed') return 'error';
        if (status === 'shaken') return 'warning';
        return 'info';
      },
      message: () => {
        const status = occultStore.sanityStatus;
        if (status === 'broken') return 'Your mind has shattered. Seek immediate help.';
        if (status === 'disturbed') return 'Reality seems to blur at the edges...';
        if (status === 'shaken') return 'Strange whispers echo in your thoughts.';
        return 'Mental state: Stable. Proceed with caution.';
      },
      visible: () => occultStore.sanityPercent < 100,
    },
    {
      molecule: 'filter-bar',
      search: {
        placeholder: 'Search texts by name or author...',
        value: () => occultStore.searchQuery,
        onChange: (v: string) => occultStore.setSearch(v),
      },
      filters: [
        {
          id: 'danger-filter',
          label: 'Danger Level',
          options: occultStore.dangerOptions,
          value: () => occultStore.dangerFilter,
          onChange: (v: string) => occultStore.setDangerFilter(v),
        },
      ],
    },
    {
      molecule: 'list',
      id: 'forbidden-texts',
      items: () =>
        occultStore.filteredTexts.map((text) => ({
          key: text.id,
          leading: {
            molecule: 'stack',
            direction: 'vertical',
            align: 'center',
            gap: 'none',
            items: [
              {
                atom: 'badge',
                text: text.dangerLevel,
                color: occultStore.getDangerBadgeColor(text.dangerLevel),
              },
              { atom: 'text', text: `${text.sanityLoss}d4`, variant: 'muted' },
            ],
          },
          content: {
            molecule: 'stack',
            direction: 'vertical',
            gap: 'sm',
            items: [
              {
                molecule: 'stack',
                direction: 'horizontal',
                justify: 'between',
                align: 'center',
                items: [
                  {
                    molecule: 'stack',
                    direction: 'horizontal',
                    gap: 'sm',
                    align: 'center',
                    items: [
                      { atom: 'text', variant: 'heading', text: text.name },
                      ...(text.fragmentRead
                        ? [{ atom: 'badge' as const, text: 'Read', color: 'green' as const }]
                        : []),
                    ],
                  },
                  { atom: 'text', text: text.year, variant: 'muted' },
                ],
              },
              { atom: 'text', text: `by ${text.author} • ${text.origin}`, variant: 'muted' },
              { atom: 'text', text: text.description },
            ],
          },
          trailing: {
            atom: 'button',
            text: text.fragmentRead ? 'Read Again' : 'Attempt Reading',
            variant: text.dangerLevel === 'Forbidden' ? 'danger' : 'secondary',
            onClick: () => occultStore.attemptRead(text),
          },
          data: text,
        })),
      emptyText: 'No texts match your search',
    },
    {
      organism: 'modal',
      id: 'warning-modal',
      title: 'Sanity Warning',
      size: 'sm',
      open: () => occultStore.warningModalOpen,
      onClose: () => occultStore.cancelRead(),
      content: [
        {
          molecule: 'stack',
          direction: 'vertical',
          gap: 'md',
          items: [
            {
              molecule: 'alert-panel',
              type: 'warning',
              message: () =>
                `Reading "${occultStore.pendingText?.name}" may cause ${occultStore.pendingText?.sanityLoss}d4 sanity loss.`,
            },
            {
              atom: 'text',
              text: () => `Danger Level: ${occultStore.pendingText?.dangerLevel ?? 'Unknown'}`,
            },
            {
              atom: 'text',
              text: 'Are you certain you wish to expose your mind to these forbidden words?',
              variant: 'muted',
            },
          ],
        },
      ],
      footer: [
        {
          atom: 'button',
          text: 'Turn Back',
          variant: 'secondary',
          onClick: () => occultStore.cancelRead(),
        },
        {
          atom: 'button',
          text: 'Read Anyway',
          variant: 'danger',
          onClick: () => occultStore.confirmRead(),
        },
      ],
    },
    {
      organism: 'modal',
      id: 'reading-modal',
      title: () => occultStore.selectedText?.name ?? 'Reading',
      size: 'md',
      open: () => occultStore.readingModalOpen,
      onClose: () => occultStore.closeReading(),
      content: [
        {
          molecule: 'stack',
          direction: 'vertical',
          gap: 'lg',
          items: [
            {
              molecule: 'alert-panel',
              type: 'error',
              message: () => `You lost ${occultStore.selectedText?.sanityLoss ?? 0} sanity points.`,
            },
            {
              atom: 'text',
              variant: 'muted',
              text: () => `From the writings of ${occultStore.selectedText?.author ?? 'Unknown'}:`,
            },
            {
              molecule: 'list',
              id: 'text-contents',
              items: () =>
                (occultStore.selectedText?.contents ?? []).map((line, i) => ({
                  key: `line-${i}`,
                  content: { atom: 'text', text: `"${line}"` },
                })),
              emptyText: 'The text reveals nothing...',
            },
            {
              atom: 'text',
              text: 'You close the tome, the words still echoing in your mind...',
              variant: 'muted',
            },
          ],
        },
      ],
      footer: [
        {
          atom: 'button',
          text: 'Close the Book',
          variant: 'primary',
          onClick: () => occultStore.closeReading(),
        },
      ],
    },
  ],
};
