<script lang="ts">
  import type { Molecule } from '@daui/core';
  import { getComponent } from '@daui/core';
  import MissingComponent from './MissingComponent.svelte';

  let { config }: { config: Molecule } = $props();

  let Component = $derived(getComponent('molecule', config.molecule));
  let isVisible = $derived(
    typeof config.visible === 'function' ? config.visible() : (config.visible ?? true)
  );
</script>

{#if isVisible}
  {#if Component}
    <Component {...config} />
  {:else}
    <MissingComponent type="molecule" name={config.molecule} />
  {/if}
{/if}
