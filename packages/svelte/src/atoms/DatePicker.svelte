<script lang="ts">
  import type { DateAtom } from '@daui/core';
  import { DatePicker } from 'bits-ui';
  import { CalendarDate, type DateValue } from '@internationalized/date';
  import { untrack } from 'svelte';
  import Icon from './Icon.svelte';

  let {
    id,
    label,
    required,
    placeholder = 'Select date...',
    minDate,
    maxDate,
    disabled = false,
    value: getValue,
    onChange,
  }: DateAtom = $props();

  function toDateValue(d: Date | string | null | undefined): DateValue | undefined {
    if (!d) return undefined;
    const date = typeof d === 'string' ? new Date(d) : d;
    if (isNaN(date.getTime())) return undefined;
    return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  function fromDateValue(dv: DateValue | undefined): Date | null {
    if (!dv) return null;
    return new Date(dv.year, dv.month - 1, dv.day);
  }

  let currentValue = $state<DateValue | undefined>(untrack(() => toDateValue(getValue?.())));

  // Sync external value changes
  $effect(() => {
    const ext = toDateValue(getValue?.());
    const current = untrack(() => currentValue);
    if (ext?.toString() !== current?.toString()) {
      currentValue = ext;
    }
  });

  function handleChange(newVal: DateValue | undefined) {
    currentValue = newVal;
    onChange?.(fromDateValue(newVal));
  }

  let minValue = $derived(toDateValue(minDate));
  let maxValue = $derived(toDateValue(maxDate));
</script>

<div class="date-picker-wrapper">
  {#if label}
    <label for={id} class="label">
      {label}
      {#if required}<span class="required">*</span>{/if}
    </label>
  {/if}

  <DatePicker.Root
    value={currentValue}
    onValueChange={handleChange}
    minValue={minValue}
    maxValue={maxValue}
    {disabled}
  >
    <div class="date-input-wrapper">
      <DatePicker.Input {id} class="date-input" {placeholder}>
        {#snippet children({ segments }: { segments: Array<{ part: string; value: string }> })}
          {#each segments as segment (segment.part)}
            {#if segment.part === 'literal'}
              <span class="segment-literal">{segment.value}</span>
            {:else}
              <DatePicker.Segment {segment} class="segment" />
            {/if}
          {/each}
        {/snippet}
      </DatePicker.Input>

      <DatePicker.Trigger class="date-trigger" aria-label="Open calendar">
        <Icon name="calendar" size="sm" />
      </DatePicker.Trigger>
    </div>

    <DatePicker.Content class="date-content" sideOffset={4}>
      <DatePicker.Calendar class="date-calendar">
        {#snippet children({ months, weekdays }: { months: Array<{ value: DateValue; weeks: Array<Array<{ day: number }>> }>; weekdays: string[] })}
          <DatePicker.Header class="calendar-header">
            <DatePicker.PrevButton class="calendar-nav-btn">
              <Icon name="chevron-left" size="sm" />
            </DatePicker.PrevButton>
            <DatePicker.Heading class="calendar-heading" />
            <DatePicker.NextButton class="calendar-nav-btn">
              <Icon name="chevron-right" size="sm" />
            </DatePicker.NextButton>
          </DatePicker.Header>

          {#each months as month (month.value.toString())}
            <DatePicker.Grid class="calendar-grid">
              <DatePicker.GridHead class="calendar-grid-head">
                <DatePicker.GridRow class="calendar-grid-row">
                  {#each weekdays as weekday}
                    <DatePicker.HeadCell class="calendar-head-cell">
                      {weekday.slice(0, 2)}
                    </DatePicker.HeadCell>
                  {/each}
                </DatePicker.GridRow>
              </DatePicker.GridHead>
              <DatePicker.GridBody>
                {#each month.weeks as week, weekIndex (weekIndex)}
                  <DatePicker.GridRow class="calendar-grid-row">
                    {#each week as day}
                      <DatePicker.Cell {day} month={month.value} class="calendar-cell">
                        <DatePicker.Day class="calendar-day">
                          {day.day}
                        </DatePicker.Day>
                      </DatePicker.Cell>
                    {/each}
                  </DatePicker.GridRow>
                {/each}
              </DatePicker.GridBody>
            </DatePicker.Grid>
          {/each}
        {/snippet}
      </DatePicker.Calendar>
    </DatePicker.Content>
  </DatePicker.Root>
</div>

<style>
  .date-picker-wrapper {
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

  .date-input-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }

  :global(.date-input) {
    display: flex;
    align-items: center;
    flex: 1;
    height: 2.5rem;
    padding: 0.5rem 0.75rem;
    background-color: transparent;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #0f172a;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  :global(.date-input:hover) {
    border-color: #cbd5e1;
  }

  :global(.date-input:focus-within) {
    outline: none;
    border-color: #0f172a;
    box-shadow: 0 0 0 1px #0f172a;
  }

  :global(.date-input[data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f1f5f9;
  }

  .segment-literal {
    color: #64748b;
  }

  :global(.segment) {
    padding: 0 0.125rem;
    border-radius: 0.125rem;
    color: #0f172a;
  }

  :global(.segment:focus) {
    outline: none;
    background-color: #0f172a;
    color: white;
  }

  :global(.segment[data-placeholder]) {
    color: #94a3b8;
  }

  :global(.date-trigger) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    background-color: transparent;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    color: #64748b;
    cursor: pointer;
    transition: all 0.15s;
  }

  :global(.date-trigger:hover) {
    border-color: #cbd5e1;
    color: #0f172a;
    background-color: #f8fafc;
  }

  :global(.date-trigger:focus-visible) {
    outline: none;
    border-color: #0f172a;
    box-shadow: 0 0 0 1px #0f172a;
  }

  :global(.date-trigger[data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global(.date-trigger[data-disabled]:hover) {
    border-color: #e2e8f0;
    background-color: transparent;
  }

  :global(.date-content) {
    z-index: 50;
    padding: 1rem;
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }

  :global(.calendar-header) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  :global(.calendar-heading) {
    font-size: 0.875rem;
    font-weight: 600;
    color: #0f172a;
  }

  :global(.calendar-nav-btn) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    padding: 0;
    background: none;
    border: none;
    border-radius: 0.375rem;
    color: #64748b;
    cursor: pointer;
    transition: all 0.15s;
  }

  :global(.calendar-nav-btn:hover) {
    color: #0f172a;
    background-color: #f1f5f9;
  }

  :global(.calendar-nav-btn:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global(.calendar-grid) {
    border-collapse: collapse;
  }

  :global(.calendar-grid-head) {
    margin-bottom: 0.25rem;
  }

  :global(.calendar-grid-row) {
    display: flex;
  }

  :global(.calendar-head-cell) {
    width: 2.25rem;
    padding: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #64748b;
    text-align: center;
  }

  :global(.calendar-cell) {
    padding: 0.125rem;
  }

  :global(.calendar-day) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    font-size: 0.875rem;
    color: #0f172a;
    background: none;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  :global(.calendar-day:hover) {
    background-color: #f1f5f9;
  }

  :global(.calendar-day[data-selected]) {
    background-color: #0f172a;
    color: white;
  }

  :global(.calendar-day[data-today]) {
    border: 1px solid #0f172a;
  }

  :global(.calendar-day[data-outside-month]) {
    color: #cbd5e1;
  }

  :global(.calendar-day[data-disabled]) {
    color: #cbd5e1;
    cursor: not-allowed;
  }

  :global(.calendar-day[data-disabled]:hover) {
    background: none;
  }

  :global(.calendar-day[data-unavailable]) {
    color: #ef4444;
    text-decoration: line-through;
  }
</style>
