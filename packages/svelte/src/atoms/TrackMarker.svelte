<script lang="ts">
  import type { TrackMarkerAtom } from '@daui/core';

  let {
    time,
    duration,
    variant = 'dot',
    label,
    color = 'hsl(var(--primary))',
    count = 1,
    onClick,
  }: Omit<TrackMarkerAtom, 'atom'> = $props();

  let positionPercent = $derived(duration > 0 ? (time / duration) * 100 : 0);

  // Scale dot size based on count (1-10 maps to 6-14px)
  let dotSize = $derived(Math.min(14, Math.max(6, 6 + count * 0.8)));

  function handleClick() {
    onClick?.();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  class="track-marker"
  class:clickable={!!onClick}
  style:left="{positionPercent}%"
  style:--marker-color={color}
  onclick={handleClick}
  onkeydown={handleKeyDown}
  role={onClick ? 'button' : undefined}
  tabindex={onClick ? 0 : undefined}
  title={label}
>
  {#if variant === 'dot'}
    <div
      class="marker-dot"
      style:width="{dotSize}px"
      style:height="{dotSize}px"
    ></div>
  {:else if variant === 'triangle'}
    <div class="marker-triangle"></div>
  {:else if variant === 'text'}
    <div class="marker-text">{label || '•'}</div>
  {/if}
</div>

<style>
  .track-marker {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .track-marker.clickable {
    cursor: pointer;
  }

  .track-marker.clickable:hover {
    opacity: 0.8;
  }

  .marker-dot {
    background-color: var(--marker-color, hsl(var(--primary)));
    border-radius: 50%;
    transition: transform 0.1s ease;
  }

  .track-marker.clickable:hover .marker-dot {
    transform: scale(1.2);
  }

  .marker-triangle {
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 8px solid var(--marker-color, hsl(var(--primary)));
  }

  .marker-text {
    font-size: 0.65rem;
    font-weight: 500;
    color: var(--marker-color, hsl(var(--primary)));
    white-space: nowrap;
    max-width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
