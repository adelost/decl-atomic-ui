<script lang="ts">
  import type { PinInputAtom } from '@daui/core';
  import { PinInput } from 'bits-ui';
  import { untrack } from 'svelte';

  let {
    id,
    length = 6,
    mask = false,
    type = 'numeric',
    placeholder = '○',
    disabled = false,
    value: getValue,
    onChange,
    onComplete,
  }: PinInputAtom = $props();

  let currentValue = $state<string[]>(
    untrack(() => {
      const val = getValue?.() ?? '';
      return val.split('').slice(0, length);
    })
  );

  // Sync external value changes
  $effect(() => {
    const ext = getValue?.() ?? '';
    const current = untrack(() => currentValue.join(''));
    if (ext !== current) {
      currentValue = ext.split('').slice(0, length);
    }
  });

  function handleValueChange(value: string[]) {
    currentValue = value;
    const stringValue = value.join('');
    onChange?.(stringValue);

    if (stringValue.length === length) {
      onComplete?.(stringValue);
    }
  }
</script>

<div class="pin-input-wrapper">
  <PinInput.Root
    {id}
    {disabled}
    {placeholder}
    type={type === 'numeric' ? 'numeric' : 'text'}
    bind:value={currentValue}
    onValueChange={handleValueChange}
    class="pin-input-root"
  >
    {#each { length } as _, i}
      <PinInput.Cell
        index={i}
        class="pin-input-cell {mask ? 'pin-input-masked' : ''}"
      />
    {/each}
  </PinInput.Root>
</div>

<style>
  .pin-input-wrapper {
    display: inline-flex;
  }

  :global(.pin-input-root) {
    display: flex;
    gap: 0.5rem;
  }

  :global(.pin-input-cell) {
    width: 2.75rem;
    height: 3rem;
    text-align: center;
    font-size: 1.25rem;
    font-weight: 500;
    color: #0f172a;
    background-color: transparent;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    transition: all 0.15s;
  }

  :global(.pin-input-masked) {
    -webkit-text-security: disc;
  }

  :global(.pin-input-cell:hover:not(:disabled)) {
    border-color: #cbd5e1;
  }

  :global(.pin-input-cell:focus) {
    outline: none;
    border-color: #0f172a;
    box-shadow: 0 0 0 1px #0f172a;
  }

  :global(.pin-input-cell:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f1f5f9;
  }

  :global(.pin-input-cell::placeholder) {
    color: #cbd5e1;
  }

  :global(.pin-input-cell[data-complete]) {
    border-color: #22c55e;
  }
</style>
