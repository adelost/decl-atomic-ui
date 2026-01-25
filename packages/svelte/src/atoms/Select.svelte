<script lang="ts">
  import { Select } from 'bits-ui';
  import type { SelectOption } from '@daui/core';
  import Icon from './Icon.svelte';

  interface Props {
    id: string;
    label?: string;
    options: SelectOption[] | (() => SelectOption[] | Promise<SelectOption[]>);
    placeholder?: string;
    required?: boolean;
    value?: () => string;
    onChange?: (value: string) => unknown;
  }

  let {
    id,
    label,
    options,
    placeholder = 'Select an option',
    required = false,
    value,
    onChange,
  }: Props = $props();

  let resolvedOptions = $state<SelectOption[]>([]);
  let currentValue = $derived(value?.() ?? '');
  let selectedLabel = $derived(
    resolvedOptions.find((o) => o.value === currentValue)?.label ?? ''
  );

  $effect(() => {
    const opts = typeof options === 'function' ? options() : options;
    if (opts instanceof Promise) {
      opts.then((resolved) => (resolvedOptions = resolved));
    } else {
      resolvedOptions = opts;
    }
  });

  function handleChange(newValue: string | undefined) {
    if (newValue !== undefined) {
      onChange?.(newValue);
    }
  }
</script>

<div class="select-wrapper">
  {#if label}
    <label for={id} class="label">
      {label}
      {#if required}<span class="required">*</span>{/if}
    </label>
  {/if}

  <Select.Root type="single" value={currentValue} onValueChange={handleChange}>
    <Select.Trigger class="select-trigger" {id}>
      <span class="select-value" class:placeholder={!currentValue}>
        {selectedLabel || placeholder}
      </span>
      <Icon name="chevron-down" size="sm" class="select-icon" />
    </Select.Trigger>

    <Select.Content class="select-content" sideOffset={4}>
      {#each resolvedOptions as option}
        <Select.Item value={option.value} label={option.label} class="select-item">
          {#snippet children({ selected }: { selected: boolean })}
            <span class="select-item-text">{option.label}</span>
            {#if selected}
              <Icon name="check" size="sm" class="select-check" />
            {/if}
          {/snippet}
        </Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>
</div>

<style>
  .select-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #0f172a;
  }

  .required {
    color: #ef4444;
    margin-left: 0.125rem;
  }

  :global(.select-trigger) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 2.5rem;
    width: 100%;
    padding: 0.5rem 0.75rem;
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #0f172a;
    cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  :global(.select-trigger:hover) {
    border-color: #cbd5e1;
  }

  :global(.select-trigger:focus) {
    outline: none;
    border-color: #0f172a;
    box-shadow: 0 0 0 1px #0f172a;
  }

  :global(.select-trigger[data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f1f5f9;
  }

  .select-value {
    flex: 1;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .select-value.placeholder {
    color: #94a3b8;
  }

  :global(.select-icon) {
    flex-shrink: 0;
    color: #64748b;
    transition: transform 0.15s;
  }

  :global(.select-trigger[data-state='open'] .select-icon) {
    transform: rotate(180deg);
  }

  :global(.select-content) {
    z-index: 50;
    min-width: 8rem;
    max-height: 300px;
    overflow-y: auto;
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    box-shadow:
      0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
    padding: 0.25rem;
  }

  :global(.select-item) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    color: #0f172a;
    border-radius: 0.25rem;
    cursor: pointer;
    outline: none;
    transition: background-color 0.1s;
  }

  :global(.select-item:hover),
  :global(.select-item[data-highlighted]) {
    background-color: #f1f5f9;
  }

  :global(.select-item[data-selected]) {
    background-color: #f1f5f9;
  }

  .select-item-text {
    flex: 1;
  }

  :global(.select-check) {
    flex-shrink: 0;
    color: #0f172a;
  }
</style>
