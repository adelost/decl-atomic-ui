<script lang="ts">
  import { SectionRenderer, type Section, type StackMolecule, type BadgeAtom } from 'svelte-daui';
  import type { DemoMeta } from './types/demo-meta';

  interface Props {
    meta: DemoMeta;
  }

  let { meta }: Props = $props();

  const complexityConfig = {
    beginner: { text: '⭐ Beginner', color: 'green' as const },
    intermediate: { text: '⭐⭐ Intermediate', color: 'gold' as const },
    advanced: { text: '⭐⭐⭐ Advanced', color: 'red' as const },
  };

  const header: StackMolecule = $derived({
    molecule: 'stack',
    direction: 'vertical',
    gap: 'sm',
    padding: 'md',
    items: [
      // Title row
      {
        molecule: 'stack',
        direction: 'horizontal',
        gap: 'md',
        align: 'center',
        items: [
          { atom: 'text', text: meta.title, variant: 'heading' },
          { atom: 'badge', text: complexityConfig[meta.complexity].text, color: complexityConfig[meta.complexity].color },
        ],
      },
      // Subtitle
      { atom: 'text', text: meta.subtitle, variant: 'muted' },
      // Tags
      {
        molecule: 'stack',
        direction: 'horizontal',
        gap: 'md',
        wrap: true,
        items: [
          // Components group
          {
            molecule: 'stack',
            direction: 'horizontal',
            gap: 'sm',
            align: 'center',
            wrap: true,
            items: [
              { atom: 'text', text: 'Components:', variant: 'small' },
              ...meta.components.map((c): BadgeAtom => ({ atom: 'badge', text: c, color: 'gray' })),
            ],
          },
          // Patterns group
          {
            molecule: 'stack',
            direction: 'horizontal',
            gap: 'sm',
            align: 'center',
            wrap: true,
            items: [
              { atom: 'text', text: 'Patterns:', variant: 'small' },
              ...meta.patterns.map((p): BadgeAtom => ({ atom: 'badge', text: p, color: 'blue' })),
            ],
          },
        ],
      },
    ],
  });
</script>

<div class="demo-header-wrapper">
  <SectionRenderer section={header} />
</div>

<style>
  .demo-header-wrapper {
    background: hsl(var(--muted, 240 4.8% 95.9%) / 0.5);
    border-bottom: 1px solid hsl(var(--border, 240 5.9% 90%));
  }

  /* Reset section-wrapper margin in header context */
  .demo-header-wrapper :global(.section-wrapper) {
    margin-bottom: 0;
  }
</style>
