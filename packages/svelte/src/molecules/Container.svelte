<script lang="ts">
  import type { ContainerMolecule } from '@daui/core';
  import SectionRenderer from '../renderer/SectionRenderer.svelte';

  let {
    maxWidth = 'lg',
    padding = 'md',
    items,
  }: Omit<ContainerMolecule, 'molecule'> = $props();

  const maxWidthMap: Record<string, string> = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    full: '100%',
  };

  const paddingMap: Record<string, string> = {
    none: '0',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
  };
</script>

<div
  class="container"
  style="--max-width: {maxWidthMap[maxWidth]}; --padding: {paddingMap[padding]};"
>
  {#each items as item}
    <SectionRenderer section={item} />
  {/each}
</div>

<style>
  .container {
    width: 100%;
    max-width: var(--max-width);
    margin-left: auto;
    margin-right: auto;
    padding-left: var(--padding);
    padding-right: var(--padding);
  }
</style>
