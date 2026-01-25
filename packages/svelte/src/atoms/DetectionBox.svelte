<script lang="ts">
  import type { DetectionBoxAtom } from '@daui/core';

  let {
    bbox,
    label,
    color = 'hsl(var(--primary))',
    confidence,
    onClick,
  }: Omit<DetectionBoxAtom, 'atom'> = $props();

  // bbox is [x, y, width, height] normalized 0-1
  let [x, y, width, height] = $derived(bbox);
  let leftPercent = $derived(x * 100);
  let topPercent = $derived(y * 100);
  let widthPercent = $derived(width * 100);
  let heightPercent = $derived(height * 100);

  let displayLabel = $derived(
    label && confidence !== undefined
      ? `${label} ${(confidence * 100).toFixed(0)}%`
      : label || ''
  );

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
  class="detection-box"
  class:clickable={!!onClick}
  style:left="{leftPercent}%"
  style:top="{topPercent}%"
  style:width="{widthPercent}%"
  style:height="{heightPercent}%"
  style:--box-color={color}
  onclick={handleClick}
  onkeydown={handleKeyDown}
  role={onClick ? 'button' : undefined}
  tabindex={onClick ? 0 : undefined}
>
  {#if displayLabel}
    <div class="box-label">
      {displayLabel}
    </div>
  {/if}
</div>

<style>
  .detection-box {
    position: absolute;
    border: 2px solid var(--box-color, hsl(var(--primary)));
    border-radius: 2px;
    pointer-events: auto;
    box-sizing: border-box;
  }

  .detection-box.clickable {
    cursor: pointer;
  }

  .detection-box.clickable:hover {
    background-color: color-mix(in srgb, var(--box-color) 10%, transparent);
  }

  .box-label {
    position: absolute;
    top: -1px;
    left: -1px;
    transform: translateY(-100%);
    background-color: var(--box-color, hsl(var(--primary)));
    color: white;
    font-size: 0.65rem;
    font-weight: 500;
    padding: 1px 4px;
    border-radius: 2px 2px 0 0;
    white-space: nowrap;
    line-height: 1.3;
  }
</style>
