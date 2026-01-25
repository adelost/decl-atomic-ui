<script lang="ts">
  import { Progress } from 'bits-ui';

  interface Props {
    value: () => number;
    max?: number;
    label?: string;
    showValue?: boolean;
    color?: 'primary' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md' | 'lg';
  }

  let {
    value,
    max = 100,
    label,
    showValue = false,
    color = 'primary',
    size = 'md',
  }: Props = $props();

  let currentValue = $derived(value());
  let percent = $derived(Math.min(100, Math.max(0, (currentValue / max) * 100)));

  const heights: Record<string, string> = {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
  };
</script>

<div class="progress-wrapper">
  {#if label || showValue}
    <div class="progress-header">
      {#if label}
        <span class="progress-label">{label}</span>
      {/if}
      {#if showValue}
        <span class="progress-value">{Math.round(percent)}%</span>
      {/if}
    </div>
  {/if}

  <Progress.Root
    value={currentValue}
    {max}
    class="progress-track"
    style="height: {heights[size]}"
  >
    <div
      class="progress-fill progress-fill--{color}"
      style="width: {percent}%"
    ></div>
  </Progress.Root>
</div>

<style>
  .progress-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .progress-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #0f172a;
  }

  .progress-value {
    font-size: 0.875rem;
    color: #64748b;
  }

  :global(.progress-track) {
    width: 100%;
    background-color: #e2e8f0;
    border-radius: 9999px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 9999px;
    transition: width 0.3s ease;
  }

  .progress-fill--primary {
    background-color: #0f172a;
  }

  .progress-fill--success {
    background-color: #22c55e;
  }

  .progress-fill--warning {
    background-color: #f59e0b;
  }

  .progress-fill--danger {
    background-color: #ef4444;
  }
</style>
