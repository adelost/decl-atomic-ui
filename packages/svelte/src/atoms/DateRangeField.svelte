<script lang="ts">
  import type { DateRangeFieldAtom } from '@daui/core';
  import { untrack } from 'svelte';

  let {
    id,
    label,
    startPlaceholder = 'Start date',
    endPlaceholder = 'End date',
    minDate,
    maxDate,
    disabled = false,
    required = false,
    value: getValue,
    onChange,
  }: DateRangeFieldAtom = $props();

  // Convert Date to string for input
  function dateToString(d: Date | null | undefined): string {
    if (!d) return '';
    if (typeof d === 'string') return d;
    return d.toISOString().split('T')[0];
  }

  // Convert string to Date
  function stringToDate(s: string): Date | null {
    if (!s) return null;
    const date = new Date(s);
    return isNaN(date.getTime()) ? null : date;
  }

  let startValue = $state(untrack(() => dateToString(getValue?.()?.start)));
  let endValue = $state(untrack(() => dateToString(getValue?.()?.end)));

  // Sync external value changes
  $effect(() => {
    const ext = getValue?.();
    const currentStart = untrack(() => startValue);
    const currentEnd = untrack(() => endValue);
    const extStart = dateToString(ext?.start);
    const extEnd = dateToString(ext?.end);

    if (extStart !== currentStart) {
      startValue = extStart;
    }
    if (extEnd !== currentEnd) {
      endValue = extEnd;
    }
  });

  function handleStartChange(e: Event) {
    const target = e.target as HTMLInputElement;
    startValue = target.value;
    emitChange();
  }

  function handleEndChange(e: Event) {
    const target = e.target as HTMLInputElement;
    endValue = target.value;
    emitChange();
  }

  function emitChange() {
    onChange?.({
      start: stringToDate(startValue),
      end: stringToDate(endValue),
    });
  }

  let minDateStr = $derived(minDate ? dateToString(typeof minDate === 'string' ? new Date(minDate) : minDate) : undefined);
  let maxDateStr = $derived(maxDate ? dateToString(typeof maxDate === 'string' ? new Date(maxDate) : maxDate) : undefined);
</script>

<div class="date-range-field-wrapper">
  {#if label}
    <label for="{id}-start" class="label">
      {label}
      {#if required}<span class="required">*</span>{/if}
    </label>
  {/if}

  <div class="date-range-inputs">
    <div class="date-input-wrapper">
      <input
        id="{id}-start"
        name="{id}-start"
        type="date"
        placeholder={startPlaceholder}
        {disabled}
        {required}
        min={minDateStr}
        max={endValue || maxDateStr}
        value={startValue}
        oninput={handleStartChange}
        class="date-input"
      />
      <svg class="date-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    </div>

    <span class="date-separator">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </span>

    <div class="date-input-wrapper">
      <input
        id="{id}-end"
        name="{id}-end"
        type="date"
        placeholder={endPlaceholder}
        {disabled}
        {required}
        min={startValue || minDateStr}
        max={maxDateStr}
        value={endValue}
        oninput={handleEndChange}
        class="date-input"
      />
      <svg class="date-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    </div>
  </div>
</div>

<style>
  .date-range-field-wrapper {
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

  .date-range-inputs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .date-input-wrapper {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
  }

  .date-input {
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

  .date-input:hover:not(:disabled) {
    border-color: #cbd5e1;
  }

  .date-input:focus {
    outline: none;
    border-color: #0f172a;
    box-shadow: 0 0 0 1px #0f172a;
  }

  .date-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f1f5f9;
  }

  /* Hide native date picker icon */
  .date-input::-webkit-calendar-picker-indicator {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  .date-icon {
    position: absolute;
    right: 0.75rem;
    color: #64748b;
    pointer-events: none;
  }

  .date-separator {
    display: flex;
    align-items: center;
    color: #94a3b8;
    flex-shrink: 0;
  }
</style>
