<script lang="ts">
  import type { IconButtonAtom } from '@daui/core';
  import Icon from './Icon.svelte';

  let { icon, label, variant = 'default', onClick, disabled }: IconButtonAtom = $props();

  let isDisabled = $derived(typeof disabled === 'function' ? disabled() : !!disabled);

  let loading = $state(false);

  async function handleClick() {
    if (isDisabled || loading) return;

    if (typeof onClick === 'function') {
      const result = onClick();
      if (result instanceof Promise) {
        loading = true;
        try {
          await result;
        } finally {
          loading = false;
        }
      }
    } else if (onClick) {
      console.warn('Intent execution not implemented yet', onClick);
    }
  }
</script>

<button
  class="icon-btn variant-{variant}"
  type="button"
  disabled={isDisabled || loading}
  onclick={handleClick}
  aria-label={label}
  title={label}
>
  {#if loading}
    <span class="spinner"></span>
  {:else}
    <Icon name={icon} size="sm" />
  {/if}
</button>

<style>
  .icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition:
      background-color 0.15s,
      opacity 0.15s;
  }

  .icon-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon {
    font-size: 1rem;
    line-height: 1;
  }

  /* Variants */
  .variant-default {
    background: #f3f4f6;
    color: #374151;
  }
  .variant-default:hover:not(:disabled) {
    background: #e5e7eb;
  }

  .variant-danger {
    background: #fee2e2;
    color: #dc2626;
  }
  .variant-danger:hover:not(:disabled) {
    background: #fecaca;
  }

  .variant-ghost {
    background: transparent;
    color: #374151;
  }
  .variant-ghost:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.05);
  }

  /* Loading spinner */
  .spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
