<script lang="ts">
  import type { Atom } from '@daui/core';
  import { getComponent } from '@daui/core';
  import MissingComponent from './MissingComponent.svelte';

  let { config }: { config: Atom } = $props();

  let Component = $derived(getComponent('atom', config.atom));
  let isVisible = $derived(
    typeof config.visible === 'function' ? config.visible() : (config.visible ?? true)
  );
</script>

{#if isVisible}
  {#if Component}
    <Component {...config} />
  {:else}
    <MissingComponent type="atom" name={config.atom} />
  {/if}
{/if}
