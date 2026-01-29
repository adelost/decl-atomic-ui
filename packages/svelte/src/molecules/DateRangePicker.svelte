<script lang="ts">
  import type { DateRangePickerMolecule } from '@daui/core';
  import { DateRangePicker, type DateRange } from 'bits-ui';
  import { CalendarDate, type DateValue } from '@internationalized/date';
  import { untrack } from 'svelte';
  import Icon from '../atoms/Icon.svelte';

  let {
    id,
    label,
    placeholder = 'Select date range...',
    minDate,
    maxDate,
    numberOfMonths = 2,
    disabled = false,
    required = false,
    value: getValue,
    onChange,
  }: DateRangePickerMolecule = $props();

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

  function toDateRange(val: { start: Date | null; end: Date | null } | undefined): DateRange | undefined {
    if (!val) return undefined;
    const start = toDateValue(val.start);
    const end = toDateValue(val.end);
    if (!start && !end) return undefined;
    return { start, end };
  }

  function fromDateRange(range: DateRange | undefined): { start: Date | null; end: Date | null } {
    return {
      start: fromDateValue(range?.start),
      end: fromDateValue(range?.end),
    };
  }

  let currentValue = $state<DateRange | undefined>(untrack(() => toDateRange(getValue?.())));

  // Sync external value changes
  $effect(() => {
    const ext = toDateRange(getValue?.());
    const current = untrack(() => currentValue);
    if (ext?.start?.toString() !== current?.start?.toString() ||
        ext?.end?.toString() !== current?.end?.toString()) {
      currentValue = ext;
    }
  });

  function handleChange(newVal: DateRange | undefined) {
    currentValue = newVal;
    onChange?.(fromDateRange(newVal));
  }

  let minValue = $derived(toDateValue(minDate));
  let maxValue = $derived(toDateValue(maxDate));
</script>

<div class="date-range-picker-wrapper">
  {#if label}
    <label for={id} class="label">
      {label}
      {#if required}<span class="required">*</span>{/if}
    </label>
  {/if}

  <DateRangePicker.Root
    value={currentValue}
    onValueChange={handleChange}
    minValue={minValue}
    maxValue={maxValue}
    {disabled}
  >
    <div class="date-input-wrapper">
      <DateRangePicker.Input {id} class="date-range-input" {placeholder}>
        {#snippet children({ segments }: { segments: { start: Array<{ part: string; value: string }>; end: Array<{ part: string; value: string }> } })}
          {#each segments.start as segment (segment.part)}
            {#if segment.part === 'literal'}
              <span class="segment-literal">{segment.value}</span>
            {:else}
              <DateRangePicker.Segment segment={{ ...segment, type: 'start' }} class="segment" />
            {/if}
          {/each}
          <span class="range-separator">–</span>
          {#each segments.end as segment (segment.part)}
            {#if segment.part === 'literal'}
              <span class="segment-literal">{segment.value}</span>
            {:else}
              <DateRangePicker.Segment segment={{ ...segment, type: 'end' }} class="segment" />
            {/if}
          {/each}
        {/snippet}
      </DateRangePicker.Input>

      <DateRangePicker.Trigger class="date-trigger" aria-label="Open calendar">
        <Icon name="calendar" size="sm" />
      </DateRangePicker.Trigger>
    </div>

    <DateRangePicker.Content class="date-content" sideOffset={4}>
      <DateRangePicker.Calendar class="date-calendar" {numberOfMonths}>
        {#snippet children({ months, weekdays }: { months: Array<{ value: DateValue; weeks: Array<Array<{ day: number }>> }>; weekdays: string[] })}
          <DateRangePicker.Header class="calendar-header">
            <DateRangePicker.PrevButton class="calendar-nav-btn">
              <Icon name="chevron-left" size="sm" />
            </DateRangePicker.PrevButton>
            <DateRangePicker.Heading class="calendar-heading" />
            <DateRangePicker.NextButton class="calendar-nav-btn">
              <Icon name="chevron-right" size="sm" />
            </DateRangePicker.NextButton>
          </DateRangePicker.Header>

          <div class="calendar-months">
            {#each months as month (month.value.toString())}
              <DateRangePicker.Grid class="calendar-grid">
                <DateRangePicker.GridHead class="calendar-grid-head">
                  <DateRangePicker.GridRow class="calendar-grid-row">
                    {#each weekdays as weekday}
                      <DateRangePicker.HeadCell class="calendar-head-cell">
                        {weekday.slice(0, 2)}
                      </DateRangePicker.HeadCell>
                    {/each}
                  </DateRangePicker.GridRow>
                </DateRangePicker.GridHead>
                <DateRangePicker.GridBody>
                  {#each month.weeks as week, weekIndex (weekIndex)}
                    <DateRangePicker.GridRow class="calendar-grid-row">
                      {#each week as day}
                        <DateRangePicker.Cell {day} month={month.value} class="calendar-cell">
                          <DateRangePicker.Day class="calendar-day">
                            {day.day}
                          </DateRangePicker.Day>
                        </DateRangePicker.Cell>
                      {/each}
                    </DateRangePicker.GridRow>
                  {/each}
                </DateRangePicker.GridBody>
              </DateRangePicker.Grid>
            {/each}
          </div>
        {/snippet}
      </DateRangePicker.Calendar>
    </DateRangePicker.Content>
  </DateRangePicker.Root>
</div>

<style>
  .date-range-picker-wrapper {
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

  :global(.date-range-input) {
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

  :global(.date-range-input:hover) {
    border-color: #cbd5e1;
  }

  :global(.date-range-input:focus-within) {
    outline: none;
    border-color: #0f172a;
    box-shadow: 0 0 0 1px #0f172a;
  }

  :global(.date-range-input[data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f1f5f9;
  }

  .segment-literal {
    color: #64748b;
  }

  .range-separator {
    margin: 0 0.5rem;
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

  .calendar-months {
    display: flex;
    gap: 1rem;
  }

  :global(.calendar-grid) {
    border-collapse: collapse;
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

  :global(.calendar-day[data-selection-start]),
  :global(.calendar-day[data-selection-end]) {
    background-color: #0f172a;
    color: white;
  }

  :global(.calendar-day[data-highlighted]) {
    background-color: #f1f5f9;
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
</style>
