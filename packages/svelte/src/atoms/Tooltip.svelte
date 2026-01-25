<script lang="ts">
  import { Tooltip } from 'bits-ui';
  import type { TooltipAtom } from '@daui/core';
  import SectionRenderer from '../renderer/SectionRenderer.svelte';

  let {
    content,
    side = 'top',
    delayDuration = 200,
    children,
  }: Omit<TooltipAtom, 'atom'> = $props();

  let resolvedContent = $derived(typeof content === 'function' ? content() : content);
</script>

<span class="tooltip-wrapper">
  <Tooltip.Root {delayDuration}>
    <Tooltip.Trigger asChild>
      {#snippet child({ props }: { props: Record<string, unknown> })}
        <span {...props}>
          {#each children as section}
            <SectionRenderer {section} />
          {/each}
        </span>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content {side} sideOffset={4} class="tooltip-content">
        {resolvedContent}
        <Tooltip.Arrow class="tooltip-arrow" />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</span>

<style>
  .tooltip-wrapper {
    display: contents;
  }

  :global(.tooltip-content) {
    z-index: 50;
    max-width: 20rem;
    padding: 0.375rem 0.75rem;
    background-color: #0f172a;
    color: white;
    font-size: 0.75rem;
    line-height: 1.25rem;
    border-radius: 0.375rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    animation: tooltip-in 0.15s ease-out;
  }

  :global(.tooltip-arrow) {
    fill: #0f172a;
  }

  @keyframes tooltip-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
