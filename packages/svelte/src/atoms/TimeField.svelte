<script lang="ts">
  import type { TimeFieldAtom } from '@daui/core';
  import { untrack } from 'svelte';

  let {
    id,
    label,
    placeholder = '--:--',
    format = '24h',
    step = 1,
    min,
    max,
    disabled = false,
    required = false,
    value: getValue,
    onChange,
  }: TimeFieldAtom = $props();

  let inputValue = $state(untrack(() => getValue?.() ?? ''));

  // Sync external value changes
  $effect(() => {
    const ext = getValue?.() ?? '';
    const current = untrack(() => inputValue);
    if (ext !== current) {
      inputValue = ext;
    }
  });

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    inputValue = target.value;
    onChange?.(inputValue);
  }

  // Convert 24h time to 12h display if needed
  function formatTimeDisplay(time: string): string {
    if (!time || format === '24h') return time;

    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
</script>

<div class="time-field-wrapper">
  {#if label}
    <label for={id} class="label">
      {label}
      {#if required}<span class="required">*</span>{/if}
    </label>
  {/if}

  <div class="time-input-wrapper">
    <input
      {id}
      name={id}
      type="time"
      {placeholder}
      {disabled}
      {required}
      {min}
      {max}
      step={step * 60}
      value={inputValue}
      oninput={handleInput}
      class="time-input"
    />
    <svg class="time-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  </div>
</div>

<style>
  .time-field-wrapper {
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

  .time-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .time-input {
    width: 100%;
    height: 2.5rem;
    padding: 0.5rem 0.75rem;
    padding-right: 2.5rem;
    background-color: transparent;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #0f172a;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .time-input:hover:not(:disabled) {
    border-color: #cbd5e1;
  }

  .time-input:focus {
    outline: none;
    border-color: #0f172a;
    box-shadow: 0 0 0 1px #0f172a;
  }

  .time-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f1f5f9;
  }

  .time-input::placeholder {
    color: #94a3b8;
  }

  /* Hide native time picker icon in some browsers */
  .time-input::-webkit-calendar-picker-indicator {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  .time-icon {
    position: absolute;
    right: 0.75rem;
    color: #64748b;
    pointer-events: none;
  }
</style>
