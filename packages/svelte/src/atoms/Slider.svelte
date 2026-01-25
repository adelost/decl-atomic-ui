<script lang="ts">
  import { Slider } from 'bits-ui';
  import { untrack } from 'svelte';

  interface Props {
    id?: string;
    label?: string;
    value?: () => number;
    onChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    showValue?: boolean;
  }

  let {
    id,
    label,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    showValue = false,
  }: Props = $props();

  // Initialize with external value (untrack to avoid reactivity warning)
  let currentValue = $state(untrack(() => value?.() ?? min));

  // Sync external value changes without fighting local drag state
  $effect(() => {
    const nextValue = value?.();
    if (typeof nextValue === 'number') {
      // Only update local state if external value differs from current
      // Use untrack to ensure this effect doesn't run when we drag (changing currentValue)
      if (nextValue !== untrack(() => currentValue)) {
        currentValue = nextValue;
      }
    }
  });

  function handleValueChange(value: number | number[]) {
    const nextValue = Array.isArray(value) ? value[0] : value;
    currentValue = nextValue;
    onChange?.(nextValue);
  }
</script>

<div class="slider-wrapper">
  {#if label || showValue}
    <div class="slider-header">
      {#if label}
        <label for={id} class="slider-label">{label}</label>
      {/if}
      {#if showValue}
        <span class="slider-value">{currentValue}</span>
      {/if}
    </div>
  {/if}

  <Slider.Root
    {id}
    type="single"
    bind:value={currentValue}
    onValueChange={handleValueChange}
    {min}
    {max}
    {step}
    {disabled}
    class="slider-root"
  >
    {#snippet children({ thumbItems }: { thumbItems: { index: number }[] })}
      <span class="slider-track">
        <Slider.Range class="slider-range" />
      </span>
      {#each thumbItems as thumb (thumb.index)}
        <Slider.Thumb index={thumb.index} class="slider-thumb" />
      {/each}
    {/snippet}
  </Slider.Root>
</div>

<style>
  .slider-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .slider-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .slider-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #0f172a;
  }

  .slider-value {
    font-size: 0.875rem;
    color: #64748b;
    font-variant-numeric: tabular-nums;
  }

  :global(.slider-root) {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 1.25rem;
    touch-action: none;
    user-select: none;
  }

  /* Wrap track/range in a span to control stacking context */
  .slider-track {
    position: relative;
    height: 0.5rem;
    width: 100%;
    background-color: #e2e8f0;
    border-radius: 9999px;
    overflow: hidden; /* Ensure range stays inside rounded corners */
  }

  /* Slider root ::before removed, using explicit track element instead */

  :global(.slider-range) {
    position: absolute;
    height: 100%; /* Fill the track height */
    background-color: #0f172a;
  }

  :global(.slider-thumb) {
    position: absolute;
    z-index: 20; /* Ensure thumb is above track */
    display: block;
    width: 1.25rem;
    height: 1.25rem;
    background-color: white;
    border: 2px solid #0f172a;
    border-radius: 9999px;
    cursor: grab; /* Indicate draggable */
    transition: box-shadow 0.1s; /* Removed transform transition */
    top: 50%;
    /* Use margins to center instead of transform to avoid conflict with Bits UI */
    margin-top: -0.625rem; /* Half of height */
    margin-left: -0.625rem; /* Half of width */
  }

  :global(.slider-thumb:active) {
    cursor: grabbing;
  }

  :global(.slider-thumb:hover) {
    transform: scale(1.1); /* Only scale on hover */
  }

  :global(.slider-thumb:focus-visible) {
    outline: none;
    box-shadow: 0 0 0 2px white, 0 0 0 4px #0f172a;
  }

  :global(.slider-root[data-disabled]) {
    opacity: 0.5;
    pointer-events: none;
  }
</style>
