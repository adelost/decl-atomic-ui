<script lang="ts">
  import type { Organism } from '@daui/core';
  import { getComponent } from '@daui/core';
  import MissingComponent from './MissingComponent.svelte';

  let { config }: { config: Organism } = $props();

  let Component = $derived(getComponent('organism', config.organism));
  let isVisible = $derived(
    typeof config.visible === 'function' ? config.visible() : (config.visible ?? true)
  );
</script>

{#if isVisible}
  {#if Component}
    <Component {...config} />
  {:else}
    <MissingComponent type="organism" name={config.organism} />
  {/if}
{/if}
