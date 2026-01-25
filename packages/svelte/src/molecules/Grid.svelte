<script lang="ts">
  import type { GridMolecule } from '@daui/core';
  import SectionRenderer from '../renderer/SectionRenderer.svelte';

  let { items, columns = 1, gap = 'md', padding = 'none' }: GridMolecule = $props();

  const gapMap = {
    none: '0',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
  };

  const paddingMap = {
    none: '0',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
  };

  // Convert number or responsive object to CSS variable string
  let colsStyle = $derived.by(() => {
    if (typeof columns === 'number') {
      return `repeat(${columns}, minmax(0, 1fr))`;
    }
    // Simple fallback for responsive object: use 'default' or 1
    // A real implementation would use media queries or container queries
    return `repeat(${columns.default ?? 1}, minmax(0, 1fr))`;
  });
</script>

<div
  class="grid"
  style:gap={gapMap[gap]}
  style:padding={paddingMap[padding]}
  style:grid-template-columns={colsStyle}
>
  {#each items as item}
    <div class="grid-item">
      <SectionRenderer section={item} />
    </div>
  {/each}
</div>

<style>
  .grid {
    display: grid;
    width: 100%;
  }
</style>
