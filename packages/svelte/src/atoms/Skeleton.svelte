<script lang="ts">
  import type { SkeletonAtom } from '@daui/core';

  let {
    variant = 'rectangular',
    width,
    height,
    lines = 1,
  }: SkeletonAtom = $props();

  // Resolve dimensions
  const getWidth = (w: number | string | undefined) => {
    if (w === undefined) return undefined;
    return typeof w === 'number' ? `${w}px` : w;
  };

  const getHeight = (h: number | string | undefined) => {
    if (h === undefined) return undefined;
    return typeof h === 'number' ? `${h}px` : h;
  };

  const resolvedWidth = $derived(getWidth(width));
  const resolvedHeight = $derived(getHeight(height));
</script>

{#if variant === 'text' && lines > 1}
  <div class="skeleton-lines">
    {#each Array(lines) as _, i}
      <div
        class="skeleton skeleton--text"
        class:skeleton--last={i === lines - 1}
        style:width={i === lines - 1 ? '70%' : resolvedWidth}
        style:height={resolvedHeight}
      ></div>
    {/each}
  </div>
{:else}
  <div
    class="skeleton skeleton--{variant}"
    style:width={resolvedWidth}
    style:height={resolvedHeight}
  ></div>
{/if}

<style>
  .skeleton {
    background: linear-gradient(
      90deg,
      hsl(var(--muted)) 25%,
      hsl(var(--muted-foreground) / 0.1) 50%,
      hsl(var(--muted)) 75%
    );
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s ease-in-out infinite;
  }

  @keyframes skeleton-shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .skeleton--rectangular {
    width: 100%;
    height: 1rem;
    border-radius: var(--radius, 0.375rem);
  }

  .skeleton--circular {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
  }

  .skeleton--text {
    width: 100%;
    height: 0.875rem;
    border-radius: 0.25rem;
  }

  .skeleton-lines {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .skeleton--last {
    width: 70%;
  }
</style>
