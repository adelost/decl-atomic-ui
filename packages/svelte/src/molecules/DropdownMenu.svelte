<script lang="ts">
  import { DropdownMenu } from 'bits-ui';
  import type { DropdownMenuMolecule } from '@daui/core';
  import Icon from '../atoms/Icon.svelte';
  import SectionRenderer from '../renderer/SectionRenderer.svelte';

  let {
    items,
    trigger,
    side = 'bottom',
    align = 'end',
  }: Omit<DropdownMenuMolecule, 'molecule'> = $props();

  function isSeparator(item: (typeof items)[number]): item is { type: 'separator' } {
    return 'type' in item && item.type === 'separator';
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild>
    {#snippet child({ props }: { props: Record<string, unknown> })}
      <span {...props}>
        {#each trigger as section}
          <SectionRenderer {section} />
        {/each}
      </span>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Portal>
    <DropdownMenu.Content {side} {align} sideOffset={0} class="dropdown-content">
      {#each items as item, i (isSeparator(item) ? `sep-${i}` : item.id)}
        {#if isSeparator(item)}
          <DropdownMenu.Separator class="dropdown-separator" />
        {:else}
          <DropdownMenu.Item
            class="dropdown-item {item.destructive ? 'destructive' : ''}"
            disabled={item.disabled}
            onSelect={() => item.onSelect?.()}
          >
            {#if item.icon}
              <Icon name={item.icon} size="sm" class="dropdown-item-icon" />
            {/if}
            <span>{item.label}</span>
          </DropdownMenu.Item>
        {/if}
      {/each}
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>

<style>
  :global(.dropdown-content) {
    z-index: 50;
    min-width: 10rem;
    padding: 0.25rem;
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    animation: dropdown-in 0.15s ease-out;
  }

  :global(.dropdown-item) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    color: #0f172a;
    border-radius: 0.25rem;
    cursor: pointer;
    outline: none;
    transition: background-color 0.1s;
  }

  :global(.dropdown-item:hover),
  :global(.dropdown-item[data-highlighted]) {
    background-color: #f1f5f9;
  }

  :global(.dropdown-item[data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global(.dropdown-item.destructive) {
    color: #ef4444;
  }

  :global(.dropdown-item.destructive:hover),
  :global(.dropdown-item.destructive[data-highlighted]) {
    background-color: #fef2f2;
  }

  :global(.dropdown-item-icon) {
    color: #64748b;
  }

  :global(.dropdown-item.destructive .dropdown-item-icon) {
    color: #ef4444;
  }

  :global(.dropdown-separator) {
    height: 1px;
    margin: 0.25rem -0.25rem;
    background-color: #e2e8f0;
  }

  @keyframes dropdown-in {
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
