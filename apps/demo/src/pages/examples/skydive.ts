import type { Page, Section, TabItem } from 'svelte-daui';
import { skydiveStore } from '../../stores/skydive.svelte';

/**
 * Skydive Logger - The Jump Logbook
 */
export const skydivePage: Page = {
  layout: 'full',
  title: 'Skydive Logger',
  sections: [
    {
      molecule: 'page-header',
      title: 'Skydive Logger',
      subtitle: 'Track your jumps, check your gear, fly safe',
      actions: [
        {
          atom: 'button',
          text: '+ Log Jump',
          variant: 'primary',
          onClick: () => skydiveStore.openAddJumpModal(),
        },
      ],
    },
    {
      molecule: 'grid',
      columns: 4,
      gap: 'md',
      padding: 'md',
      items: [
        {
          molecule: 'stat-card',
          title: 'Total Jumps',
          value: () => skydiveStore.totalJumps,
          icon: 'plane',
        },
        {
          molecule: 'stat-card',
          title: 'Freefall Time',
          value: () => skydiveStore.formatTime(skydiveStore.totalFreefallTime),
          icon: 'arrow-down',
        },
        {
          molecule: 'stat-card',
          title: 'Canopy Time',
          value: () => skydiveStore.formatTime(skydiveStore.totalCanopyTime),
          icon: 'wind',
        },
        {
          molecule: 'stat-card',
          title: 'Avg Altitude',
          value: () => `${skydiveStore.averageAltitude}m`,
          icon: 'mountain',
        },
      ],
    },
    {
      molecule: 'tabs',
      id: 'skydive-tabs',
      tabs: [
        {
          id: 'logbook',
          label: 'Jump Log',
          icon: '📋',
          content: [
            {
              organism: 'table',
              id: 'jump-log-table',
              data: () => skydiveStore.jumps,
              searchable: true,
              searchKeys: ['location', 'dropzone', 'type'] as const,
              searchPlaceholder: 'Search jumps...',
              columns: [
                { field: 'date', header: 'Date', sortable: true },
                { field: 'dropzone', header: 'Dropzone', sortable: true },
                {
                  field: 'altitude',
                  header: 'Altitude',
                  sortable: true,
                  render: (val): Section => ({ atom: 'text', text: `${val}m` }),
                },
                {
                  field: 'type',
                  header: 'Type',
                  render: (val): Section => ({
                    atom: 'badge',
                    text: val as string,
                    color:
                      val === 'Wingsuit'
                        ? 'gold'
                        : val === 'Formation'
                          ? 'blue'
                          : val === 'AFF'
                            ? 'green'
                            : 'gray',
                  }),
                },
                { field: 'aircraft', header: 'Aircraft' },
                {
                  field: 'freefallTime',
                  header: 'Freefall',
                  sortable: true,
                  render: (val): Section => ({ atom: 'text', text: `${val}s` }),
                },
                {
                  field: 'weather',
                  header: 'Weather',
                  render: (val): Section => ({
                    atom: 'badge',
                    text: val as string,
                    color: val === 'Clear' ? 'green' : val === 'Windy' ? 'yellow' : 'gray',
                  }),
                },
              ],
              emptyText: 'No jumps logged yet. Start logging!',
            },
          ],
        },
        {
          id: 'gear',
          label: 'Gear Check',
          icon: '🎒',
          content: [
            {
              molecule: 'grid',
              columns: 2,
              gap: 'lg',
              items: [
                {
                  organism: 'card',
                  header: {
                    molecule: 'stack',
                    direction: 'horizontal',
                    justify: 'between',
                    align: 'center',
                    items: [
                      { atom: 'text', variant: 'heading', text: 'Pre-Jump Checklist' },
                      {
                        atom: 'button',
                        text: 'Reset',
                        variant: 'ghost',
                        onClick: () => skydiveStore.resetGearChecklist(),
                      },
                    ],
                  },
                  content: [
                    {
                      molecule: 'list',
                      id: 'gear-checklist',
                      items: () =>
                        skydiveStore.gearChecklist.map((item) => ({
                          key: item.id,
                          leading: {
                            atom: 'checkbox',
                            id: item.id,
                            label: '',
                            value: () => item.checked,
                            onChange: () => skydiveStore.toggleGearItem(item.id),
                          },
                          content: {
                            molecule: 'stack',
                            direction: 'horizontal',
                            gap: 'sm',
                            align: 'center',
                            items: [
                              { atom: 'text', text: item.name },
                              ...(item.critical
                                ? [{ atom: 'badge' as const, text: 'Critical', color: 'red' as const }]
                                : []),
                            ],
                          },
                          data: item,
                        })),
                      emptyText: 'No gear items',
                    },
                  ],
                },
                {
                  organism: 'card',
                  header: { atom: 'text', variant: 'heading', text: 'Gear Status' },
                  content: [
                    {
                      molecule: 'stack',
                      direction: 'vertical',
                      gap: 'lg',
                      items: [
                        {
                          atom: 'progress',
                          label: 'Checklist Progress',
                          value: () => skydiveStore.gearReadyPercent,
                          max: 100,
                          showValue: true,
                          size: 'lg',
                          color: () => (skydiveStore.gearReadyPercent === 100 ? 'success' : 'warning'),
                        },
                        {
                          molecule: 'alert-panel',
                          type: () => (skydiveStore.criticalItemsReady ? 'success' : 'warning'),
                          message: () =>
                            skydiveStore.criticalItemsReady
                              ? 'All critical items checked. Ready to jump!'
                              : 'Complete all critical items before jumping.',
                        },
                        {
                          atom: 'button',
                          text: () =>
                            skydiveStore.criticalItemsReady ? 'Ready to Jump!' : 'Complete Check',
                          variant: () => (skydiveStore.criticalItemsReady ? 'primary' : 'secondary'),
                          disabled: () => !skydiveStore.criticalItemsReady,
                          onClick: () => console.log('Jump confirmed!'),
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ] as TabItem[],
    },
    {
      organism: 'modal',
      id: 'add-jump-modal',
      title: 'Log New Jump',
      size: 'lg',
      open: () => skydiveStore.addJumpModalOpen,
      onClose: () => skydiveStore.closeAddJumpModal(),
      content: [
        {
          molecule: 'form',
          id: 'add-jump-form',
          onSubmit: (data) => skydiveStore.addJump(data),
          fields: [
            {
              molecule: 'grid',
              columns: 2,
              gap: 'md',
              items: [
                {
                  atom: 'input',
                  id: 'date',
                  label: 'Date',
                  type: 'text',
                  required: true,
                  placeholder: 'YYYY-MM-DD',
                },
                {
                  atom: 'input',
                  id: 'dropzone',
                  label: 'Dropzone',
                  placeholder: 'e.g., Skåne Fallskärm',
                  required: true,
                },
              ],
            },
            {
              molecule: 'grid',
              columns: 2,
              gap: 'md',
              items: [
                {
                  atom: 'input',
                  id: 'location',
                  label: 'Location',
                  placeholder: 'e.g., Sweden',
                  required: true,
                },
                {
                  atom: 'input',
                  id: 'aircraft',
                  label: 'Aircraft',
                  placeholder: 'e.g., Cessna 208',
                },
              ],
            },
            {
              molecule: 'grid',
              columns: 3,
              gap: 'md',
              items: [
                {
                  atom: 'number-input',
                  id: 'altitude',
                  label: 'Altitude (m)',
                  min: 1000,
                  max: 6000,
                  value: () => skydiveStore.newJump.altitude ?? 4000,
                },
                {
                  atom: 'number-input',
                  id: 'freefallTime',
                  label: 'Freefall (sec)',
                  min: 0,
                  max: 300,
                  value: () => skydiveStore.newJump.freefallTime ?? 60,
                },
                {
                  atom: 'number-input',
                  id: 'canopyTime',
                  label: 'Canopy (sec)',
                  min: 0,
                  max: 600,
                  value: () => skydiveStore.newJump.canopyTime ?? 240,
                },
              ],
            },
            {
              molecule: 'grid',
              columns: 3,
              gap: 'md',
              items: [
                {
                  atom: 'select',
                  id: 'type',
                  label: 'Jump Type',
                  options: skydiveStore.jumpTypeOptions,
                  value: () => skydiveStore.newJump.type ?? 'Solo',
                },
                {
                  atom: 'select',
                  id: 'exitType',
                  label: 'Exit Type',
                  options: skydiveStore.exitTypeOptions,
                  value: () => skydiveStore.newJump.exitType ?? 'Stable',
                },
                {
                  atom: 'select',
                  id: 'weather',
                  label: 'Weather',
                  options: skydiveStore.weatherOptions,
                  value: () => skydiveStore.newJump.weather ?? 'Clear',
                },
              ],
            },
            {
              atom: 'textarea',
              id: 'notes',
              label: 'Notes',
              placeholder: 'How was the jump?',
              rows: 2,
            },
          ],
        },
      ],
      footer: [
        {
          atom: 'button',
          text: 'Cancel',
          variant: 'secondary',
          onClick: () => skydiveStore.closeAddJumpModal(),
        },
        { atom: 'button', text: 'Log Jump', variant: 'primary', submit: true },
      ],
    },
  ],
};
