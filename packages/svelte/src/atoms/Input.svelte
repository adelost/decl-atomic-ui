<script lang="ts">
  import type { InputAtom } from '@daui/core';
  import { untrack } from 'svelte';

  let {
    id,
    label,
    type = 'text',
    placeholder,
    required,
    value: getValue,
    onChange,
  }: InputAtom = $props();

  let inputValue = $state(untrack(() => getValue?.() ?? ''));

  $effect(() => {
    if (getValue) {
      inputValue = getValue();
    }
  });

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    inputValue = target.value;
    onChange?.(inputValue);
  }
</script>

<div class="input-wrapper">
  {#if label}
    <label for={id} class="label">
      {label}
      {#if required}<span class="required">*</span>{/if}
    </label>
  {/if}

  <input
    {id}
    name={id}
    {type}
    {placeholder}
    {required}
    value={inputValue}
    oninput={handleInput}
    class="input"
  />
</div>

<style>
  .input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    width: 100%;
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

  .input {
    display: flex;
    height: 2.5rem;
    width: 100%;
    padding: 0.5rem 0.75rem;
    background-color: transparent;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #0f172a;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .input::placeholder {
    color: #94a3b8;
  }

  .input:hover {
    border-color: #cbd5e1;
  }

  .input:focus {
    outline: none;
    border-color: #0f172a;
    box-shadow: 0 0 0 1px #0f172a;
  }

  .input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f1f5f9;
  }
</style>
