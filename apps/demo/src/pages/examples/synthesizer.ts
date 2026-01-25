import type { Page } from 'svelte-daui';
import { synthStore, presets, effectsChain, type Preset, type WaveformType, type FilterType, type EffectName } from '../../stores/synthesizer.svelte';

/**
 * Synthesizer Lab
 */
export const synthesizerPage: Page = {
  layout: 'full',
  title: 'Synthesizer Lab',
  sections: [
    {
      molecule: 'page-header',
      title: 'Patch Editor',
      subtitle: 'Design your sound',
      actions: [
        {
          atom: 'button',
          text: 'Randomize',
          variant: 'secondary',
          onClick: () => synthStore.randomize(),
        },
        {
          atom: 'button',
          text: 'Save Patch',
          variant: 'primary',
          onClick: () => {
            synthStore.saveModalOpen = true;
          },
        },
      ],
    },
    {
      molecule: 'grid',
      columns: 2,
      gap: 'md',
      padding: 'md',
      items: [
        {
          organism: 'card',
          header: { atom: 'text', variant: 'heading', text: 'Oscillator' },
          content: [
            {
              molecule: 'grid',
              columns: 2,
              gap: 'md',
              items: [
                {
                  atom: 'select',
                  id: 'osc-waveform',
                  label: 'Waveform',
                  options: [
                    { value: 'sine', label: 'Sine' },
                    { value: 'saw', label: 'Sawtooth' },
                    { value: 'square', label: 'Square' },
                    { value: 'triangle', label: 'Triangle' },
                  ],
                  value: () => synthStore.oscillator.waveform,
                  onChange: (v: string) => {
                    synthStore.oscillator.waveform = v as WaveformType;
                  },
                },
                {
                  atom: 'number-input',
                  id: 'osc-octave',
                  label: 'Octave',
                  min: -2,
                  max: 2,
                  value: () => synthStore.oscillator.octave,
                  onChange: (v: number) => {
                    synthStore.oscillator.octave = v;
                  },
                },
                {
                  atom: 'number-input',
                  id: 'osc-detune',
                  label: 'Detune (cents)',
                  min: -100,
                  max: 100,
                  value: () => synthStore.oscillator.detune,
                  onChange: (v: number) => {
                    synthStore.oscillator.detune = v;
                  },
                },
                {
                  atom: 'switch',
                  id: 'osc-sync',
                  label: 'Hard Sync',
                  value: () => synthStore.oscillator.sync,
                  onChange: (v: boolean) => {
                    synthStore.oscillator.sync = v;
                  },
                },
              ],
            },
          ],
        },
        {
          organism: 'card',
          header: { atom: 'text', variant: 'heading', text: 'Filter' },
          content: [
            {
              molecule: 'grid',
              columns: 2,
              gap: 'md',
              items: [
                {
                  atom: 'select',
                  id: 'filter-type',
                  label: 'Type',
                  options: [
                    { value: 'lp12', label: 'Lowpass 12dB' },
                    { value: 'lp24', label: 'Lowpass 24dB' },
                    { value: 'hp12', label: 'Highpass 12dB' },
                    { value: 'bp', label: 'Bandpass' },
                  ],
                  value: () => synthStore.filter.type,
                  onChange: (v: string) => {
                    synthStore.filter.type = v as FilterType;
                  },
                },
                {
                  atom: 'number-input',
                  id: 'filter-cutoff',
                  label: 'Cutoff (Hz)',
                  min: 20,
                  max: 20000,
                  value: () => synthStore.filter.cutoff,
                  onChange: (v: number) => {
                    synthStore.filter.cutoff = v;
                  },
                },
                {
                  atom: 'number-input',
                  id: 'filter-resonance',
                  label: 'Resonance',
                  min: 0,
                  max: 100,
                  value: () => synthStore.filter.resonance,
                  onChange: (v: number) => {
                    synthStore.filter.resonance = v;
                  },
                },
                {
                  atom: 'number-input',
                  id: 'filter-env',
                  label: 'Env Amount',
                  min: -100,
                  max: 100,
                  value: () => synthStore.filter.envAmount,
                  onChange: (v: number) => {
                    synthStore.filter.envAmount = v;
                  },
                },
              ],
            },
          ],
        },
        {
          organism: 'card',
          header: { atom: 'text', variant: 'heading', text: 'Envelope (ADSR)' },
          content: [
            {
              molecule: 'grid',
              columns: 4,
              gap: 'md',
              items: [
                {
                  atom: 'number-input',
                  id: 'env-attack',
                  label: 'Attack',
                  min: 0,
                  max: 5000,
                  value: () => synthStore.envelope.attack,
                  onChange: (v: number) => {
                    synthStore.envelope.attack = v;
                  },
                },
                {
                  atom: 'number-input',
                  id: 'env-decay',
                  label: 'Decay',
                  min: 0,
                  max: 5000,
                  value: () => synthStore.envelope.decay,
                  onChange: (v: number) => {
                    synthStore.envelope.decay = v;
                  },
                },
                {
                  atom: 'number-input',
                  id: 'env-sustain',
                  label: 'Sustain',
                  min: 0,
                  max: 100,
                  value: () => synthStore.envelope.sustain,
                  onChange: (v: number) => {
                    synthStore.envelope.sustain = v;
                  },
                },
                {
                  atom: 'number-input',
                  id: 'env-release',
                  label: 'Release',
                  min: 0,
                  max: 10000,
                  value: () => synthStore.envelope.release,
                  onChange: (v: number) => {
                    synthStore.envelope.release = v;
                  },
                },
              ],
            },
            {
              atom: 'text',
              text: () =>
                `A: ${synthStore.envelope.attack}ms | D: ${synthStore.envelope.decay}ms | S: ${synthStore.envelope.sustain}% | R: ${synthStore.envelope.release}ms`,
              variant: 'muted',
            },
          ],
        },
        {
          organism: 'card',
          header: { atom: 'text', variant: 'heading', text: 'Effects Chain' },
          content: [
            {
              molecule: 'list',
              id: 'effects-list',
              items: () =>
                effectsChain.map((fx, i) => ({
                  key: fx.id,
                  leading: { atom: 'text', text: `${i + 1}`, variant: 'muted' },
                  content: {
                    molecule: 'stack',
                    direction: 'vertical',
                    gap: 'none',
                    items: [
                      { atom: 'text', text: fx.name },
                      { atom: 'text', text: `${fx.type} - ${fx.settings}`, variant: 'muted' },
                    ],
                  },
                  trailing: {
                    atom: 'switch',
                    id: `fx-${fx.id}`,
                    label: '',
                    value: () =>
                      synthStore.effects[fx.name.toLowerCase() as keyof typeof synthStore.effects]
                        ?.enabled ?? false,
                    onChange: () => synthStore.toggleEffect(fx.name.toLowerCase() as EffectName),
                  },
                })),
              emptyText: 'No effects',
            },
          ],
        },
      ],
    },
    {
      molecule: 'stack',
      direction: 'horizontal',
      justify: 'between',
      align: 'center',
      padding: 'md',
      items: [
        {
          molecule: 'stack',
          direction: 'horizontal',
          gap: 'lg',
          items: [
            {
              atom: 'number-input',
              id: 'master-volume',
              label: 'Master Volume',
              min: 0,
              max: 100,
              value: () => synthStore.master.volume,
              onChange: (v: number) => {
                synthStore.master.volume = v;
                synthStore.checkClipping();
              },
            },
            {
              atom: 'number-input',
              id: 'master-pan',
              label: 'Pan',
              min: -50,
              max: 50,
              value: () => synthStore.master.pan,
              onChange: (v: number) => {
                synthStore.master.pan = v;
              },
            },
          ],
        },
        {
          atom: 'switch',
          id: 'bypass',
          label: 'Bypass',
          value: () => synthStore.bypassed,
          onChange: (v: boolean) => {
            synthStore.bypassed = v;
          },
        },
      ],
    },
    { atom: 'divider', spacing: 'lg' },
    {
      organism: 'card',
      header: { atom: 'text', variant: 'heading', text: 'Preset Browser' },
      content: [
        {
          organism: 'table',
          id: 'preset-browser',
          data: () => presets,
          searchable: true,
          searchKeys: ['name', 'author'],
          searchPlaceholder: 'Search presets...',
          columns: [
            { field: 'name', header: 'Preset Name', sortable: true },
            {
              field: 'category',
              header: 'Category',
              render: (val) => ({
                atom: 'text',
                text: val as string,
                variant: 'default',
              }),
            },
            { field: 'author', header: 'Author' },
            { field: 'rating', header: 'Rating', sortable: true },
            {
              field: 'cpu',
              header: 'CPU',
              render: (val) => ({
                atom: 'text',
                text: val as string,
                variant: val === 'High' ? 'default' : 'muted',
              }),
            },
          ],
          onRowClick: (preset: Preset) => synthStore.loadPreset(preset.id),
          emptyText: 'No presets found',
        },
      ],
    },
    {
      organism: 'modal',
      id: 'save-patch-modal',
      title: 'Save Patch',
      open: () => synthStore.saveModalOpen,
      onClose: () => {
        synthStore.saveModalOpen = false;
      },
      content: [
        {
          molecule: 'form',
          id: 'save-patch-form',
          onSubmit: () => synthStore.savePatch(),
          fields: [
            {
              atom: 'input',
              id: 'patch-name',
              label: 'Patch Name',
              placeholder: 'My Awesome Sound',
              required: true,
              value: () => synthStore.patchName,
              onChange: (v: string) => {
                synthStore.patchName = v;
              },
            },
            {
              atom: 'select',
              id: 'patch-category',
              label: 'Category',
              options: [
                { value: 'bass', label: 'Bass' },
                { value: 'lead', label: 'Lead' },
                { value: 'pad', label: 'Pad' },
                { value: 'fx', label: 'FX' },
                { value: 'keys', label: 'Keys' },
              ],
              value: () => synthStore.patchCategory,
              onChange: (v: string) => {
                synthStore.patchCategory = v;
              },
            },
            {
              atom: 'textarea',
              id: 'patch-notes',
              label: 'Notes',
              placeholder: 'Describe your patch...',
              rows: 3,
              value: () => synthStore.patchNotes,
              onChange: (v: string) => {
                synthStore.patchNotes = v;
              },
            },
            {
              atom: 'checkbox',
              id: 'patch-public',
              label: 'Share with community',
              value: () => synthStore.patchPublic,
              onChange: (v: boolean) => {
                synthStore.patchPublic = v;
              },
            },
          ],
        },
      ],
      footer: [
        {
          atom: 'button',
          text: 'Cancel',
          variant: 'secondary',
          onClick: () => {
            synthStore.saveModalOpen = false;
          },
        },
        { atom: 'button', text: 'Save', variant: 'primary', submit: true },
      ],
    },
    {
      organism: 'modal',
      id: 'clipping-modal',
      title: 'Audio Clipping',
      size: 'sm',
      open: () => synthStore.clippingModalOpen,
      onClose: () => {
        synthStore.clippingModalOpen = false;
      },
      content: [
        {
          atom: 'text',
          text: () => `Output gain exceeded 0dBFS (+${synthStore.clippingAmount.toFixed(1)}dB).`,
        },
        {
          atom: 'text',
          text: 'Limiter engaged to protect speakers. Consider reducing the master volume.',
          variant: 'muted',
        },
      ],
      footer: [
        {
          atom: 'button',
          text: 'Ignore',
          variant: 'secondary',
          onClick: () => {
            synthStore.clippingModalOpen = false;
          },
        },
        {
          atom: 'button',
          text: 'Normalize Volume',
          variant: 'primary',
          onClick: () => synthStore.normalizeVolume(),
        },
      ],
    },
  ],
};
