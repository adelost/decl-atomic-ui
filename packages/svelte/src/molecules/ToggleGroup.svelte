<script lang="ts">
  import type { ToggleGroupMolecule } from '@daui/core';
  import { ToggleGroup } from 'bits-ui';
  import Icon from '../atoms/Icon.svelte';

  let {
    id,
    type = 'single',
    items,
    size = 'md',
    variant = 'default',
    value: getValue,
    onChange,
  }: ToggleGroupMolecule = $props();

  let currentValue = $derived(getValue?.() ?? (type === 'single' ? '' : []));

  const sizeClasses: Record<string, string> = {
    sm: 'toggle-group-sm',
    md: 'toggle-group-md',
    lg: 'toggle-group-lg',
  };
</script>

{#if type === 'single'}
  <ToggleGroup.Root
    {id}
    type="single"
    value={currentValue as string}
    onValueChange={(v: string) => onChange?.(v)}
    class="toggle-group toggle-group-{variant} {sizeClasses[size]}"
  >
    {#each items as item (item.value)}
      <ToggleGroup.Item
        value={item.value}
        disabled={item.disabled}
        class="toggle-group-item"
        aria-label={item.label ?? item.value}
      >
        {#if item.icon}
          <Icon name={item.icon} size="sm" />
        {/if}
        {#if item.label}
          <span class="toggle-group-label">{item.label}</span>
        {/if}
      </ToggleGroup.Item>
    {/each}
  </ToggleGroup.Root>
{:else}
  <ToggleGroup.Root
    {id}
    type="multiple"
    value={currentValue as string[]}
    onValueChange={(v: string[]) => onChange?.(v)}
    class="toggle-group toggle-group-{variant} {sizeClasses[size]}"
  >
    {#each items as item (item.value)}
      <ToggleGroup.Item
        value={item.value}
        disabled={item.disabled}
        class="toggle-group-item"
        aria-label={item.label ?? item.value}
      >
        {#if item.icon}
          <Icon name={item.icon} size="sm" />
        {/if}
        {#if item.label}
          <span class="toggle-group-label">{item.label}</span>
        {/if}
      </ToggleGroup.Item>
    {/each}
  </ToggleGroup.Root>
{/if}

<style>
  :global(.toggle-group) {
    display: inline-flex;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  :global(.toggle-group-item) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
  }

  :global(.toggle-group-item:focus-visible) {
    outline: 2px solid #0f172a;
    outline-offset: 2px;
    z-index: 1;
  }

  :global(.toggle-group-item[data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Size variants */
  :global(.toggle-group-sm .toggle-group-item) {
    height: 2rem;
    padding: 0 0.625rem;
    font-size: 0.75rem;
  }

  :global(.toggle-group-md .toggle-group-item) {
    height: 2.5rem;
    padding: 0 0.875rem;
    font-size: 0.875rem;
  }

  :global(.toggle-group-lg .toggle-group-item) {
    height: 3rem;
    padding: 0 1.125rem;
    font-size: 1rem;
  }

  /* Default variant */
  :global(.toggle-group-default) {
    background-color: #f1f5f9;
    border: none;
  }

  :global(.toggle-group-default .toggle-group-item) {
    background-color: transparent;
    border: none;
    color: #64748b;
  }

  :global(.toggle-group-default .toggle-group-item:hover:not([data-disabled])) {
    color: #0f172a;
  }

  :global(.toggle-group-default .toggle-group-item[data-state='on']) {
    background-color: white;
    color: #0f172a;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  /* Outline variant */
  :global(.toggle-group-outline) {
    border: 1px solid #e2e8f0;
    background-color: transparent;
  }

  :global(.toggle-group-outline .toggle-group-item) {
    background-color: transparent;
    border: none;
    border-right: 1px solid #e2e8f0;
    color: #64748b;
  }

  :global(.toggle-group-outline .toggle-group-item:last-child) {
    border-right: none;
  }

  :global(.toggle-group-outline .toggle-group-item:hover:not([data-disabled])) {
    background-color: #f8fafc;
    color: #0f172a;
  }

  :global(.toggle-group-outline .toggle-group-item[data-state='on']) {
    background-color: #0f172a;
    color: white;
  }

  .toggle-group-label {
    white-space: nowrap;
  }
</style>
