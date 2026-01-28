<script lang="ts">
  import type { OverlayTogglesMolecule } from '@daui/core';
  import Icon from '../atoms/Icon.svelte';

  let {
    items,
    showAllToggle = false,
    orientation = 'horizontal',
    size = 'sm',
  }: Omit<OverlayTogglesMolecule, 'molecule'> = $props();

  // Compute all-on state
  let allEnabled = $derived(items.every((item) => item.enabled()));
  let someEnabled = $derived(items.some((item) => item.enabled()));
  let indeterminate = $derived(someEnabled && !allEnabled);

  function toggleAll() {
    const newState = !allEnabled;
    items.forEach((item) => {
      if (item.enabled() !== newState) {
        item.onChange(newState);
      }
    });
  }

  function handleKeyDown(e: KeyboardEvent, toggle: () => void) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  }
</script>

<div class="overlay-toggles orientation-{orientation} size-{size}">
  {#if showAllToggle}
    <button
      class="toggle-item toggle-all"
      class:active={allEnabled}
      class:indeterminate={indeterminate}
      onclick={toggleAll}
      onkeydown={(e) => handleKeyDown(e, toggleAll)}
      aria-pressed={allEnabled}
      aria-label="Toggle all overlays"
      title="Toggle all"
    >
      <span class="toggle-checkbox">
        {#if allEnabled}
          <Icon name="check" size="xs" />
        {:else if indeterminate}
          <Icon name="minus" size="xs" />
        {/if}
      </span>
      <span class="toggle-label">All</span>
    </button>
    <span class="separator"></span>
  {/if}

  {#each items as item (item.id)}
    {@const enabled = item.enabled()}
    <button
      class="toggle-item"
      class:active={enabled}
      onclick={() => item.onChange(!enabled)}
      onkeydown={(e) => handleKeyDown(e, () => item.onChange(!enabled))}
      aria-pressed={enabled}
      aria-label="Toggle {item.label}"
      title={item.label}
    >
      {#if item.icon}
        <Icon name={item.icon} size={size === 'sm' ? 'sm' : 'md'} />
      {/if}
      <span class="toggle-label">{item.label}</span>
    </button>
  {/each}
</div>

<style>
  .overlay-toggles {
    display: flex;
    gap: 4px;
    padding: 4px;
    background-color: hsl(var(--muted) / 0.5);
    border-radius: 6px;
  }

  .orientation-horizontal {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .orientation-vertical {
    flex-direction: column;
  }

  .separator {
    width: 1px;
    background-color: hsl(var(--border));
    margin: 2px 4px;
  }

  .orientation-vertical .separator {
    width: 100%;
    height: 1px;
    margin: 4px 0;
  }

  .toggle-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    background-color: transparent;
    border: 1px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 500;
    color: hsl(var(--muted-foreground));
    transition: all 0.15s ease;
    white-space: nowrap;
  }

  .size-md .toggle-item {
    padding: 8px 12px;
    font-size: 0.8125rem;
  }

  .toggle-item:hover {
    background-color: hsl(var(--muted));
    color: hsl(var(--foreground));
  }

  .toggle-item:focus {
    outline: 2px solid hsl(var(--primary));
    outline-offset: 1px;
  }

  .toggle-item.active {
    background-color: hsl(var(--primary) / 0.15);
    border-color: hsl(var(--primary) / 0.3);
    color: hsl(var(--primary));
  }

  .toggle-item.active:hover {
    background-color: hsl(var(--primary) / 0.25);
  }

  .toggle-checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    border: 1.5px solid currentColor;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .size-md .toggle-checkbox {
    width: 16px;
    height: 16px;
  }

  .toggle-all.active .toggle-checkbox {
    background-color: hsl(var(--primary));
    border-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
  }

  .toggle-all.indeterminate .toggle-checkbox {
    background-color: hsl(var(--primary) / 0.5);
    border-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
  }

  .toggle-label {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .orientation-vertical .toggle-item {
    justify-content: flex-start;
    width: 100%;
  }
</style>
