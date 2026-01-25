<script lang="ts">
  import type { FrameControlsMolecule } from '@daui/core';
  import Icon from '../atoms/Icon.svelte';

  let {
    fps,
    currentTime,
    duration,
    onSeek,
  }: Omit<FrameControlsMolecule, 'molecule'> = $props();

  let time = $derived(currentTime());
  let totalDuration = $derived(duration());

  let frameDuration = $derived(1 / fps);
  let currentFrame = $derived(Math.floor(time * fps));
  let totalFrames = $derived(Math.floor(totalDuration * fps));

  function seekToFrame(frame: number) {
    const clampedFrame = Math.max(0, Math.min(frame, totalFrames - 1));
    const newTime = clampedFrame / fps;
    onSeek(newTime);
  }

  function prevFrame() {
    seekToFrame(currentFrame - 1);
  }

  function nextFrame() {
    seekToFrame(currentFrame + 1);
  }

  function jumpFrames(count: number) {
    seekToFrame(currentFrame + count);
  }

  function formatTimecode(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const f = Math.floor((seconds % 1) * fps);

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${f.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}:${f.toString().padStart(2, '0')}`;
  }
</script>

<div class="frame-controls">
  <!-- Jump back 10 frames -->
  <button
    class="frame-button"
    onclick={() => jumpFrames(-10)}
    disabled={currentFrame < 10}
    aria-label="Back 10 frames"
    title="Back 10 frames"
  >
    <Icon name="chevrons-left" size="sm" />
  </button>

  <!-- Previous frame -->
  <button
    class="frame-button"
    onclick={prevFrame}
    disabled={currentFrame <= 0}
    aria-label="Previous frame"
    title="Previous frame"
  >
    <Icon name="chevron-left" size="sm" />
  </button>

  <!-- Timecode display -->
  <div class="timecode">
    <span class="time">{formatTimecode(time)}</span>
    <span class="frame-info">Frame {currentFrame + 1} / {totalFrames}</span>
  </div>

  <!-- Next frame -->
  <button
    class="frame-button"
    onclick={nextFrame}
    disabled={currentFrame >= totalFrames - 1}
    aria-label="Next frame"
    title="Next frame"
  >
    <Icon name="chevron-right" size="sm" />
  </button>

  <!-- Jump forward 10 frames -->
  <button
    class="frame-button"
    onclick={() => jumpFrames(10)}
    disabled={currentFrame >= totalFrames - 10}
    aria-label="Forward 10 frames"
    title="Forward 10 frames"
  >
    <Icon name="chevrons-right" size="sm" />
  </button>
</div>

<style>
  .frame-controls {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .frame-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    background-color: transparent;
    border: 1px solid hsl(var(--border));
    border-radius: 4px;
    cursor: pointer;
    color: hsl(var(--foreground));
    transition: background-color 0.15s ease;
  }

  .frame-button:hover:not(:disabled) {
    background-color: hsl(var(--muted));
  }

  .frame-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .timecode {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 100px;
    padding: 0 8px;
  }

  .time {
    font-family: monospace;
    font-size: 0.9rem;
    font-weight: 500;
    color: hsl(var(--foreground));
  }

  .frame-info {
    font-size: 0.65rem;
    color: hsl(var(--muted-foreground));
  }
</style>
