<script lang="ts">
  import { Checkbox } from 'bits-ui';
  import Icon from './Icon.svelte';

  interface Props {
    id: string;
    label: string;
    value?: () => boolean;
    onChange?: (value: boolean) => unknown;
  }

  let { id, label, value, onChange }: Props = $props();

  let checked = $derived(value?.() ?? false);

  function handleCheckedChange(newChecked: boolean | 'indeterminate') {
    if (typeof newChecked === 'boolean') {
      onChange?.(newChecked);
    }
  }
</script>

<div class="checkbox-wrapper">
  <Checkbox.Root
    {id}
    checked={checked}
    onCheckedChange={handleCheckedChange}
    class="checkbox"
  >
    {#snippet children({ checked }: { checked: boolean | 'indeterminate' })}
      {#if checked === true}
        <Icon name="check" size="xs" class="checkbox-icon" />
      {/if}
    {/snippet}
  </Checkbox.Root>
  <label for={id} class="label">{label}</label>
</div>

<style>
  .checkbox-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  :global(.checkbox) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    cursor: pointer;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    background-color: white;
    transition: all 0.15s;
  }

  :global(.checkbox:hover) {
    border-color: #cbd5e1;
  }

  :global(.checkbox:focus-visible) {
    outline: none;
    border-color: #0f172a;
    box-shadow: 0 0 0 1px #0f172a;
  }

  :global(.checkbox[data-state='checked']) {
    background-color: #0f172a;
    border-color: #0f172a;
  }

  :global(.checkbox[data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global(.checkbox-icon) {
    color: white;
  }

  .label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #0f172a;
    cursor: pointer;
    user-select: none;
  }
</style>
