<script lang="ts">
  import type { MeterAtom } from '@daui/core';

  let {
    value: getValue,
    min = 0,
    max = 100,
    low,
    high,
    optimum,
    label,
    showValue = false,
  }: MeterAtom = $props();

  let currentValue = $derived(typeof getValue === 'function' ? getValue() : getValue);
  let percent = $derived(Math.min(100, Math.max(0, ((currentValue - min) / (max - min)) * 100)));

  // Determine color based on value relative to low/high/optimum
  let colorClass = $derived.by(() => {
    if (optimum !== undefined) {
      // If optimum is in the "high" range
      if (high !== undefined && optimum >= high) {
        if (currentValue >= high) return 'meter-optimal';
        if (low !== undefined && currentValue <= low) return 'meter-critical';
        return 'meter-suboptimal';
      }
      // If optimum is in the "low" range
      if (low !== undefined && optimum <= low) {
        if (currentValue <= low) return 'meter-optimal';
        if (high !== undefined && currentValue >= high) return 'meter-critical';
        return 'meter-suboptimal';
      }
      // If optimum is in the middle
      if (low !== undefined && currentValue <= low) return 'meter-suboptimal';
      if (high !== undefined && currentValue >= high) return 'meter-suboptimal';
      return 'meter-optimal';
    }

    // Without optimum, use simple threshold coloring
    if (low !== undefined && currentValue <= low) return 'meter-warning';
    if (high !== undefined && currentValue >= high) return 'meter-success';
    return 'meter-default';
  });
</script>

<div class="meter-wrapper">
  {#if label || showValue}
    <div class="meter-header">
      {#if label}
        <span class="meter-label">{label}</span>
      {/if}
      {#if showValue}
        <span class="meter-value">{currentValue} / {max}</span>
      {/if}
    </div>
  {/if}

  <div class="meter-track" role="meter" aria-valuenow={currentValue} aria-valuemin={min} aria-valuemax={max}>
    <div class="meter-fill {colorClass}" style="width: {percent}%"></div>
  </div>
</div>

<style>
  .meter-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .meter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .meter-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #0f172a;
  }

  .meter-value {
    font-size: 0.875rem;
    color: #64748b;
  }

  .meter-track {
    width: 100%;
    height: 0.5rem;
    background-color: #e2e8f0;
    border-radius: 9999px;
    overflow: hidden;
  }

  .meter-fill {
    height: 100%;
    border-radius: 9999px;
    transition: width 0.3s ease, background-color 0.3s ease;
  }

  /* Color variants */
  .meter-default {
    background-color: #0f172a;
  }

  .meter-optimal {
    background-color: #22c55e;
  }

  .meter-suboptimal {
    background-color: #f59e0b;
  }

  .meter-critical {
    background-color: #ef4444;
  }

  .meter-success {
    background-color: #22c55e;
  }

  .meter-warning {
    background-color: #f59e0b;
  }
</style>
