<script lang="ts">
  import { RadioGroup } from 'bits-ui';

  interface RadioOption {
    value: string;
    label: string;
    disabled?: boolean;
  }

  interface Props {
    id?: string;
    label?: string;
    options: RadioOption[];
    value?: () => string;
    onChange?: (value: string) => void;
    orientation?: 'horizontal' | 'vertical';
    required?: boolean;
  }

  let {
    id,
    label,
    options,
    value,
    onChange,
    orientation = 'vertical',
    required = false,
  }: Props = $props();

  let currentValue = $derived(value?.() ?? '');

  function handleValueChange(newValue: string) {
    onChange?.(newValue);
  }
</script>

<div class="radio-group-wrapper">
  {#if label}
    <span class="radio-group-label">
      {label}
      {#if required}<span class="required">*</span>{/if}
    </span>
  {/if}

  <RadioGroup.Root
    {id}
    value={currentValue}
    onValueChange={handleValueChange}
    {required}
    class="radio-group radio-group--{orientation}"
  >
    {#each options as option (option.value)}
      <div class="radio-item">
        <RadioGroup.Item
          value={option.value}
          disabled={option.disabled}
          class="radio-button"
          id="{id}-{option.value}"
        >
          {#snippet children({ checked }: { checked: boolean })}
            {#if checked}
              <span class="radio-indicator"></span>
            {/if}
          {/snippet}
        </RadioGroup.Item>
        <label for="{id}-{option.value}" class="radio-label">
          {option.label}
        </label>
      </div>
    {/each}
  </RadioGroup.Root>
</div>

<style>
  .radio-group-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .radio-group-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #0f172a;
  }

  .required {
    color: #ef4444;
    margin-left: 0.125rem;
  }

  :global(.radio-group) {
    display: flex;
    gap: 0.75rem;
  }

  :global(.radio-group--vertical) {
    flex-direction: column;
  }

  :global(.radio-group--horizontal) {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .radio-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  :global(.radio-button) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 9999px;
    background-color: white;
    cursor: pointer;
    transition: all 0.15s;
  }

  :global(.radio-button:hover) {
    border-color: #cbd5e1;
  }

  :global(.radio-button:focus-visible) {
    outline: none;
    border-color: #0f172a;
    box-shadow: 0 0 0 1px #0f172a;
  }

  :global(.radio-button[data-state='checked']) {
    border-color: #0f172a;
  }

  :global(.radio-button[data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .radio-indicator {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 9999px;
    background-color: #0f172a;
  }

  .radio-label {
    font-size: 0.875rem;
    color: #0f172a;
    cursor: pointer;
    user-select: none;
  }
</style>
