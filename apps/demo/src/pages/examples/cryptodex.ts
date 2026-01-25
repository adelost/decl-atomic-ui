import type { Page } from 'svelte-daui';
import { cryptodexStore } from '../../stores/cryptodex.svelte';

/**
 * Crypto-Dex - The Cryptid Bestiary
 */
export const cryptodexPage: Page = {
  layout: 'full',
  title: 'Crypto-Dex',
  sections: [
    {
      molecule: 'page-header',
      title: 'Crypto-Dex',
      subtitle: 'A Field Guide to Cryptozoological Specimens',
      badge: {
        atom: 'badge',
        text: () => `${cryptodexStore.filteredCryptids.length} specimens`,
        color: 'blue',
      },
    },
    {
      molecule: 'filter-bar',
      search: {
        placeholder: 'Search by name or region...',
        value: () => cryptodexStore.searchQuery,
        onChange: (v: string) => cryptodexStore.setSearch(v),
      },
      filters: [
        {
          id: 'type-filter',
          label: 'Type',
          options: cryptodexStore.typeOptions,
          value: () => cryptodexStore.selectedType,
          onChange: (v: string) => cryptodexStore.setType(v),
        },
        {
          id: 'status-filter',
          label: 'Status',
          options: cryptodexStore.statusOptions,
          value: () => cryptodexStore.selectedStatus,
          onChange: (v: string) => cryptodexStore.setStatus(v),
        },
      ],
    },
    {
      molecule: 'list',
      id: 'cryptid-list',
      items: () =>
        cryptodexStore.filteredCryptids.map((cryptid) => ({
          key: cryptid.id,
          content: {
            organism: 'card',
            onClick: () => cryptodexStore.openDetail(cryptid),
            content: [
              {
                molecule: 'stack',
                direction: 'horizontal',
                justify: 'between',
                align: 'center',
                items: [
                  { atom: 'text', variant: 'heading', text: cryptid.name },
                  {
                    atom: 'badge',
                    text: cryptid.status,
                    color:
                      cryptid.status === 'Confirmed'
                        ? 'green'
                        : cryptid.status === 'Legendary'
                          ? 'gold'
                          : cryptid.status === 'Hoax'
                            ? 'red'
                            : 'blue',
                  },
                ],
              },
              {
                molecule: 'stack',
                direction: 'horizontal',
                gap: 'sm',
                items: [
                  { atom: 'badge', text: cryptid.type, color: 'gray' },
                  { atom: 'text', text: cryptid.region, variant: 'muted' },
                ],
              },
              { atom: 'divider', spacing: 'sm' },
              {
                molecule: 'stack',
                direction: 'vertical',
                gap: 'sm',
                items: [
                  {
                    atom: 'progress',
                    label: 'Stealth',
                    value: () => cryptid.stats.stealth,
                    max: 100,
                    size: 'sm',
                    color: 'primary',
                  },
                  {
                    atom: 'progress',
                    label: 'Strength',
                    value: () => cryptid.stats.strength,
                    max: 100,
                    size: 'sm',
                    color: 'danger',
                  },
                ],
              },
              {
                atom: 'text',
                text: `${cryptid.sightings.toLocaleString()} reported sightings`,
                variant: 'muted',
              },
            ],
          },
          data: cryptid,
        })),
      emptyText: 'No cryptids match your search',
    },
    {
      organism: 'modal',
      id: 'cryptid-detail-modal',
      title: () => cryptodexStore.selectedCryptid?.name ?? 'Cryptid Details',
      size: 'lg',
      open: () => cryptodexStore.detailModalOpen,
      onClose: () => cryptodexStore.closeDetail(),
      content: [
        {
          molecule: 'stack',
          direction: 'vertical',
          gap: 'md',
          items: [
            {
              molecule: 'stack',
              direction: 'horizontal',
              gap: 'sm',
              items: [
                {
                  atom: 'badge',
                  text: () => cryptodexStore.selectedCryptid?.type ?? '',
                  color: 'blue',
                },
                {
                  atom: 'badge',
                  text: () => cryptodexStore.selectedCryptid?.status ?? '',
                  color: () => {
                    const status = cryptodexStore.selectedCryptid?.status;
                    if (status === 'Confirmed') return 'green';
                    if (status === 'Legendary') return 'gold';
                    if (status === 'Hoax') return 'red';
                    return 'blue';
                  },
                },
              ],
            },
            {
              atom: 'text',
              text: () => `Region: ${cryptodexStore.selectedCryptid?.region ?? 'Unknown'}`,
              variant: 'muted',
            },
            {
              atom: 'text',
              text: () => cryptodexStore.selectedCryptid?.description ?? '',
            },
            { atom: 'divider', spacing: 'md' },
            { atom: 'text', variant: 'heading', text: 'Statistics' },
            {
              molecule: 'grid',
              columns: 2,
              gap: 'md',
              items: [
                {
                  atom: 'progress',
                  label: 'Stealth',
                  value: () => cryptodexStore.selectedCryptid?.stats.stealth ?? 0,
                  max: 100,
                  showValue: true,
                  color: 'primary',
                },
                {
                  atom: 'progress',
                  label: 'Strength',
                  value: () => cryptodexStore.selectedCryptid?.stats.strength ?? 0,
                  max: 100,
                  showValue: true,
                  color: 'danger',
                },
                {
                  atom: 'progress',
                  label: 'Speed',
                  value: () => cryptodexStore.selectedCryptid?.stats.speed ?? 0,
                  max: 100,
                  showValue: true,
                  color: 'warning',
                },
                {
                  atom: 'progress',
                  label: 'Intelligence',
                  value: () => cryptodexStore.selectedCryptid?.stats.intelligence ?? 0,
                  max: 100,
                  showValue: true,
                  color: 'success',
                },
              ],
            },
            { atom: 'divider', spacing: 'md' },
            {
              molecule: 'stack',
              direction: 'horizontal',
              justify: 'between',
              items: [
                {
                  molecule: 'stack',
                  direction: 'vertical',
                  gap: 'none',
                  items: [
                    { atom: 'text', variant: 'muted', text: 'Total Sightings' },
                    {
                      atom: 'text',
                      variant: 'heading',
                      text: () =>
                        cryptodexStore.selectedCryptid?.sightings.toLocaleString() ?? '0',
                    },
                  ],
                },
                {
                  molecule: 'stack',
                  direction: 'vertical',
                  gap: 'none',
                  items: [
                    { atom: 'text', variant: 'muted', text: 'Last Sighting' },
                    {
                      atom: 'text',
                      variant: 'heading',
                      text: () => cryptodexStore.selectedCryptid?.lastSeen ?? 'Unknown',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      footer: [
        {
          atom: 'button',
          text: 'Close',
          variant: 'secondary',
          onClick: () => cryptodexStore.closeDetail(),
        },
        {
          atom: 'button',
          text: 'Report Sighting',
          variant: 'primary',
          onClick: () => {
            console.log('Report sighting for:', cryptodexStore.selectedCryptid?.name);
            cryptodexStore.closeDetail();
          },
        },
      ],
    },
  ],
};
