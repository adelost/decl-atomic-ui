<script lang="ts">
  import { Switch } from 'bits-ui';
  import type { SwitchAtom } from '@daui/core';

  let { id, label, value, onChange }: SwitchAtom = $props();

  let checked = $derived(value?.() ?? false);

  function handleCheckedChange(newChecked: boolean) {
    onChange?.(newChecked);
  }
</script>

<div class="switch-container">
  <Switch.Root
    {id}
    name={id}
    checked={checked}
    onCheckedChange={handleCheckedChange}
    class="switch-root"
  >
    <Switch.Thumb class="switch-thumb" />
  </Switch.Root>
  {#if label}
    <label for={id} class="switch-label">{label}</label>
  {/if}
</div>

<style>
  .switch-container {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  :global(.switch-root) {
    position: relative;
    width: 2.75rem;
    height: 1.5rem;
    background-color: #e2e8f0;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  :global(.switch-root[data-state='checked']) {
    background-color: #0f172a;
  }

  :global(.switch-root:focus-visible) {
    outline: 2px solid #0f172a;
    outline-offset: 2px;
  }

  :global(.switch-root[data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global(.switch-thumb) {
    display: block;
    width: 1.25rem;
    height: 1.25rem;
    background-color: white;
    border-radius: 9999px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
    transform: translateX(2px);
  }

  :global(.switch-root[data-state='checked'] .switch-thumb) {
    transform: translateX(calc(2.75rem - 1.25rem - 2px));
  }

  .switch-label {
    color: #0f172a;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    user-select: none;
  }
</style>
