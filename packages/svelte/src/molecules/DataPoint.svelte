<script lang="ts">
  import type { DataPointMolecule } from '@daui/core';

  let {
    label,
    value,
    variant = 'default',
  }: Omit<DataPointMolecule, 'molecule'> = $props();

  let resolvedValue = $derived(typeof value === 'function' ? value() : value);
</script>

<div class="data-point" class:large={variant === 'large'}>
  <span class="data-label">{label}</span>
  <span class="data-value">{resolvedValue}</span>
</div>

<style>
  .data-point {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .data-label {
    font-size: 0.7rem;
    color: hsl(var(--muted-foreground));
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  .data-value {
    font-size: 0.9rem;
    font-weight: 500;
    color: hsl(var(--foreground));
  }

  .data-point.large .data-label {
    font-size: 0.75rem;
  }

  .data-point.large .data-value {
    font-size: 1.5rem;
    font-weight: 600;
  }
</style>
