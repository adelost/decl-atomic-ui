<script lang="ts">
  import { Popover } from 'bits-ui';
  import type { PopoverAtom } from '@daui/core';
  import SectionRenderer from '../renderer/SectionRenderer.svelte';

  let {
    open,
    onOpenChange,
    side = 'bottom',
    align = 'center',
    trigger,
    children,
  }: Omit<PopoverAtom, 'atom'> = $props();

  let isOpen = $derived(open?.() ?? false);

  function handleOpenChange(newOpen: boolean) {
    onOpenChange?.(newOpen);
  }
</script>

<span class="popover-wrapper">
  <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
    <Popover.Trigger asChild>
      {#snippet child({ props }: { props: Record<string, unknown> })}
        <span {...props}>
          {#each trigger as section}
            <SectionRenderer {section} />
          {/each}
        </span>
      {/snippet}
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Content {side} {align} sideOffset={4} class="popover-content">
        {#each children as section}
          <SectionRenderer {section} />
        {/each}
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
</span>

<style>
  .popover-wrapper {
    display: contents;
  }

  :global(.popover-content) {
    z-index: 50;
    min-width: 12rem;
    padding: 1rem;
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    animation: popover-in 0.15s ease-out;
  }

  :global(.popover-content:focus-visible) {
    outline: none;
  }

  @keyframes popover-in {
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
