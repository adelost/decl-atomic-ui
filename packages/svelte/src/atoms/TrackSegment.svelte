<script lang="ts">
  import type { TrackSegmentAtom } from '@daui/core';

  let {
    start,
    end,
    duration,
    color = 'hsl(var(--primary))',
    label,
    active = false,
    onClick,
  }: Omit<TrackSegmentAtom, 'atom'> = $props();

  let leftPercent = $derived(duration > 0 ? (start / duration) * 100 : 0);
  let widthPercent = $derived(duration > 0 ? ((end - start) / duration) * 100 : 0);

  function handleClick(e: MouseEvent) {
    onClick?.(e);
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
  class="track-segment"
  class:active
  class:clickable={!!onClick}
  style:left="{leftPercent}%"
  style:width="{widthPercent}%"
  style:--segment-color={color}
  onclick={handleClick}
  onkeydown={handleKeyDown}
  role={onClick ? 'button' : undefined}
  tabindex={onClick ? 0 : undefined}
  title={label}
>
  {#if label && widthPercent > 5}
    <span class="segment-label">{label}</span>
  {/if}
</div>

<style>
  .track-segment {
    position: absolute;
    top: 4px;
    bottom: 4px;
    background-color: var(--segment-color, hsl(var(--primary)));
    border-radius: 4px;
    min-width: 2px;
    overflow: hidden;
    transition: opacity 0.15s ease;
  }

  .track-segment.clickable {
    cursor: pointer;
  }

  .track-segment.clickable:hover {
    opacity: 0.85;
  }

  .track-segment.active {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 1px;
  }

  .segment-label {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    padding: 0 6px;
    font-size: 0.7rem;
    color: white;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
