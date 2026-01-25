<script lang="ts">
  import type { SpinnerAtom } from '@daui/core';

  let { size = 'md', color }: SpinnerAtom = $props();

  const sizes: Record<string, string> = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  let sizeClass = $derived(sizes[size] || sizes.md);
</script>

<svg
  class="spinner {sizeClass}"
  style={color ? `color: ${color}` : undefined}
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
  <path
    class="spinner-head"
    d="M12 2a10 10 0 0 1 10 10"
    stroke="currentColor"
    stroke-width="3"
    stroke-linecap="round"
  />
</svg>

<style>
  .spinner {
    animation: spin 1s linear infinite;
  }

  .spinner-track {
    opacity: 0.2;
  }

  .spinner-head {
    opacity: 1;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
