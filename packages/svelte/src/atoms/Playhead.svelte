<script lang="ts">
  import type { PlayheadAtom } from '@daui/core';

  let {
    time,
    duration,
    onSeek,
    draggable = true,
    color = 'hsl(var(--primary))',
  }: Omit<PlayheadAtom, 'atom'> = $props();

  let isDragging = $state(false);
  let containerRef = $state<HTMLDivElement | null>(null);

  let currentTime = $derived(time());
  let totalDuration = $derived(duration());
  let positionPercent = $derived(
    totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0
  );

  function getTimeFromEvent(e: MouseEvent) {
    if (!containerRef || totalDuration <= 0) return 0;
    const rect = containerRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    return percent * totalDuration;
  }

  function handleMouseDown(e: MouseEvent) {
    if (!draggable) return;
    e.preventDefault();
    isDragging = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDragging || !onSeek) return;
    const newTime = getTimeFromEvent(e);
    onSeek(newTime);
  }

  function handleMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  function handleContainerClick(e: MouseEvent) {
    if (!onSeek) return;
    const target = e.target as HTMLElement;
    // Don't seek if clicking on the playhead itself
    if (target.closest('.playhead-handle')) return;
    const newTime = getTimeFromEvent(e);
    onSeek(newTime);
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  class="playhead-container"
  bind:this={containerRef}
  onclick={handleContainerClick}
  role="slider"
  tabindex="0"
  aria-valuenow={currentTime}
  aria-valuemin={0}
  aria-valuemax={totalDuration}
>
  <div
    class="playhead-line"
    class:dragging={isDragging}
    style:left="{positionPercent}%"
    style:--playhead-color={color}
  >
    {#if draggable}
      <div
        class="playhead-handle"
        onmousedown={handleMouseDown}
        role="button"
        tabindex="0"
      >
        <div class="playhead-head"></div>
      </div>
    {/if}
  </div>
</div>

<style>
  .playhead-container {
    position: absolute;
    inset: 0;
    cursor: pointer;
  }

  .playhead-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: var(--playhead-color, hsl(var(--primary)));
    transform: translateX(-50%);
    pointer-events: none;
    z-index: 10;
  }

  .playhead-line.dragging {
    background-color: var(--playhead-color, hsl(var(--primary)));
    opacity: 0.8;
  }

  .playhead-handle {
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: auto;
    cursor: grab;
    padding: 2px;
  }

  .playhead-handle:active {
    cursor: grabbing;
  }

  .playhead-head {
    width: 12px;
    height: 12px;
    background-color: var(--playhead-color, hsl(var(--primary)));
    clip-path: polygon(50% 100%, 0 0, 100% 0);
    border-radius: 2px 2px 0 0;
  }
</style>
