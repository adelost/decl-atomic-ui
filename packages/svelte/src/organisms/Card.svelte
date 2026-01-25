<script lang="ts">
  import type { CardOrganism } from '@daui/core';
  import SectionRenderer from '../renderer/SectionRenderer.svelte';
  import { cn } from '@daui/core';

  let { header, media, content, footer, variant = 'default', onClick }: CardOrganism = $props();

  async function handleClick() {
    if (onClick && typeof onClick === 'function') {
      await onClick();
    }
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={cn(
    'rounded-lg border bg-card text-card-foreground shadow-sm',
    variant === 'outlined' && 'shadow-none bg-transparent',
    variant === 'elevated' && 'shadow-lg border-none',
    onClick && 'cursor-pointer hover:bg-accent/50 transition-colors'
  )}
  onclick={handleClick}
>
  {#if header}
    <div class="flex flex-col space-y-1.5 p-6">
      <SectionRenderer section={header} />
    </div>
  {/if}

  {#if media}
    <div class="w-full">
      <SectionRenderer section={media} />
    </div>
  {/if}

  <div class="p-6 pt-0 space-y-4">
    {#each content as item}
      <SectionRenderer section={item} />
    {/each}
  </div>

  {#if footer}
    <div class="flex items-center p-6 pt-0">
      <SectionRenderer section={footer} />
    </div>
  {/if}
</div>
