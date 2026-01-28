<script lang="ts">
  import type { TimeDisplayAtom } from '@daui/core';

  let {
    time,
    format = 'short',
    fps = 30,
    size = 'md',
  }: Omit<TimeDisplayAtom, 'atom'> = $props();

  // Resolve time (can be number or getter)
  let resolvedTime = $derived(typeof time === 'function' ? time() : time);

  // Format time based on format type
  let formattedTime = $derived.by(() => {
    const t = resolvedTime ?? 0;
    const totalSeconds = Math.floor(t);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const frames = Math.floor((t % 1) * fps);

    switch (format) {
      case 'short':
        // MM:SS
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      case 'long':
        // HH:MM:SS
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      case 'timecode':
        // HH:MM:SS:FF (SMPTE timecode)
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;

      case 'frames':
        // Total frame count
        return `${Math.floor(t * fps)}`;

      default:
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  });
</script>

<span class="time-display size-{size}">
  {formattedTime}
</span>

<style>
  .time-display {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    font-variant-numeric: tabular-nums;
    color: hsl(var(--foreground));
    white-space: nowrap;
  }

  .size-sm {
    font-size: 0.75rem;
  }

  .size-md {
    font-size: 0.875rem;
  }

  .size-lg {
    font-size: 1.125rem;
    font-weight: 500;
  }
</style>
