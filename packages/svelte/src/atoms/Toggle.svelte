<script lang="ts">
  import type { ToggleAtom } from '@daui/core';
  import { Toggle } from 'bits-ui';
  import SectionRenderer from '../renderer/SectionRenderer.svelte';

  let {
    id,
    variant = 'default',
    size = 'md',
    disabled = false,
    value: getValue,
    onChange,
    children,
  }: ToggleAtom = $props();

  let pressed = $derived(getValue?.() ?? false);

  function handlePressedChange(newPressed: boolean) {
    onChange?.(newPressed);
  }

  const sizeClasses: Record<string, string> = {
    sm: 'toggle-sm',
    md: 'toggle-md',
    lg: 'toggle-lg',
  };
</script>

<Toggle.Root
  {id}
  {pressed}
  onPressedChange={handlePressedChange}
  {disabled}
  class="toggle-root toggle-{variant} {sizeClasses[size]}"
>
  {#each children as section}
    <SectionRenderer {section} />
  {/each}
</Toggle.Root>

<style>
  :global(.toggle-root) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  :global(.toggle-root:focus-visible) {
    outline: 2px solid #0f172a;
    outline-offset: 2px;
  }

  :global(.toggle-root[data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Size variants */
  :global(.toggle-sm) {
    height: 2rem;
    padding: 0 0.625rem;
    font-size: 0.75rem;
  }

  :global(.toggle-md) {
    height: 2.5rem;
    padding: 0 0.875rem;
    font-size: 0.875rem;
  }

  :global(.toggle-lg) {
    height: 3rem;
    padding: 0 1.125rem;
    font-size: 1rem;
  }

  /* Default variant */
  :global(.toggle-default) {
    background-color: transparent;
    border: none;
    color: #64748b;
  }

  :global(.toggle-default:hover:not([data-disabled])) {
    background-color: #f1f5f9;
    color: #0f172a;
  }

  :global(.toggle-default[data-state='on']) {
    background-color: #f1f5f9;
    color: #0f172a;
  }

  /* Outline variant */
  :global(.toggle-outline) {
    background-color: transparent;
    border: 1px solid #e2e8f0;
    color: #64748b;
  }

  :global(.toggle-outline:hover:not([data-disabled])) {
    border-color: #cbd5e1;
    background-color: #f8fafc;
    color: #0f172a;
  }

  :global(.toggle-outline[data-state='on']) {
    background-color: #0f172a;
    border-color: #0f172a;
    color: white;
  }
</style>
