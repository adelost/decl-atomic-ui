<script lang="ts">
  import type { Section } from '@daui/core';
  import AtomRenderer from './AtomRenderer.svelte';
  import MoleculeRenderer from './MoleculeRenderer.svelte';
  import OrganismRenderer from './OrganismRenderer.svelte';

  let { section }: { section: Section } = $props();

  // Determine type safely based on discriminated union keys
  const level = $derived(
    'atom' in section ? 'atom' : 'molecule' in section ? 'molecule' : 'organism'
  );

  // Check visibility at section level (prevents wrapper div rendering for hidden items)
  let isVisible = $derived.by(() => {
    const v = (section as { visible?: boolean | (() => boolean) }).visible;
    if (v === undefined) return true;
    return typeof v === 'function' ? v() : v;
  });
</script>

{#if isVisible}
  {#if level === 'atom' && 'atom' in section}
    <div class="section-wrapper atom">
      <AtomRenderer config={section} />
    </div>
  {:else if level === 'molecule' && 'molecule' in section}
    <div class="section-wrapper molecule">
      <MoleculeRenderer config={section} />
    </div>
  {:else if 'organism' in section}
    <div class="section-wrapper organism">
      <OrganismRenderer config={section} />
    </div>
  {/if}
{/if}

<style>
  .section-wrapper {
    margin-bottom: 1rem;
  }
</style>
