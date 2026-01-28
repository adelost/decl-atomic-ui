<script lang="ts">
  import type { RatingGroupMolecule } from '@daui/core';
  import Icon from '../atoms/Icon.svelte';

  let {
    id,
    max = 5,
    icon = 'star',
    size = 'md',
    readonly = false,
    showValue = false,
    allowHalf = false,
    value: getValue,
    onChange,
  }: RatingGroupMolecule = $props();

  let currentValue = $derived(getValue?.() ?? 0);
  let hoverValue = $state<number | null>(null);

  let displayValue = $derived(hoverValue ?? currentValue);

  const sizeClasses: Record<string, string> = {
    sm: 'rating-sm',
    md: 'rating-md',
    lg: 'rating-lg',
  };

  const iconSizes: Record<string, 'sm' | 'md' | 'lg'> = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
  };

  function handleClick(index: number, isHalf: boolean = false) {
    if (readonly) return;

    const newValue = allowHalf && isHalf ? index + 0.5 : index + 1;
    onChange?.(newValue);
  }

  function handleMouseMove(event: MouseEvent, index: number) {
    if (readonly) return;

    if (allowHalf) {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const isFirstHalf = event.clientX - rect.left < rect.width / 2;
      hoverValue = isFirstHalf ? index + 0.5 : index + 1;
    } else {
      hoverValue = index + 1;
    }
  }

  function handleMouseLeave() {
    hoverValue = null;
  }

  function isActive(index: number): boolean {
    return displayValue >= index + 1;
  }

  function isHalfActive(index: number): boolean {
    return displayValue >= index + 0.5 && displayValue < index + 1;
  }
</script>

<div
  {id}
  class="rating-group {sizeClasses[size]}"
  class:readonly
  role="slider"
  aria-valuenow={currentValue}
  aria-valuemin={0}
  aria-valuemax={max}
  aria-label="Rating"
>
  <div class="rating-stars">
    {#each { length: max } as _, i}
      <button
        type="button"
        class="rating-star"
        class:active={isActive(i)}
        class:half-active={isHalfActive(i)}
        disabled={readonly}
        onclick={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const isHalf = allowHalf && e.clientX - rect.left < rect.width / 2;
          handleClick(i, isHalf);
        }}
        onmousemove={(e) => handleMouseMove(e, i)}
        onmouseleave={handleMouseLeave}
        aria-label={`Rate ${i + 1} out of ${max}`}
      >
        <span class="star-bg">
          <Icon name={icon} size={iconSizes[size]} />
        </span>
        <span class="star-fill" style="width: {isActive(i) ? '100%' : isHalfActive(i) ? '50%' : '0%'}">
          <Icon name={icon} size={iconSizes[size]} />
        </span>
      </button>
    {/each}
  </div>

  {#if showValue}
    <span class="rating-value">{currentValue} / {max}</span>
  {/if}
</div>

<style>
  .rating-group {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .rating-stars {
    display: flex;
    gap: 0.125rem;
  }

  .rating-star {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    color: #d1d5db;
    transition: transform 0.1s;
  }

  .rating-star:hover:not(:disabled) {
    transform: scale(1.1);
  }

  .rating-star:disabled {
    cursor: default;
  }

  .rating-star:focus-visible {
    outline: 2px solid #0f172a;
    outline-offset: 2px;
    border-radius: 0.25rem;
  }

  .star-bg {
    display: flex;
  }

  .star-fill {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    overflow: hidden;
    color: #f59e0b;
  }

  .rating-star.active .star-fill,
  .rating-star.half-active .star-fill {
    color: #f59e0b;
  }

  .readonly .rating-star {
    pointer-events: none;
  }

  .rating-value {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
  }

  /* Size variants */
  .rating-sm .rating-star {
    width: 1.25rem;
    height: 1.25rem;
  }

  .rating-sm .rating-value {
    font-size: 0.75rem;
  }

  .rating-md .rating-star {
    width: 1.5rem;
    height: 1.5rem;
  }

  .rating-lg .rating-star {
    width: 2rem;
    height: 2rem;
  }

  .rating-lg .rating-value {
    font-size: 1rem;
  }
</style>
