<script lang="ts">
  import type { WaveformAtom } from '@daui/core';

  let {
    samples,
    duration,
    currentTime,
    height = 60,
    color = 'hsl(var(--primary))',
    backgroundColor = 'hsl(var(--muted) / 0.3)',
    onClick,
  }: Omit<WaveformAtom, 'atom'> = $props();

  let canvas: HTMLCanvasElement;
  let containerWidth = $state(0);

  // Resolve samples (can be array or getter)
  let resolvedSamples = $derived(typeof samples === 'function' ? samples() : samples);
  let resolvedCurrentTime = $derived(currentTime?.() ?? 0);

  // Draw waveform when samples, dimensions, or time changes
  $effect(() => {
    if (!canvas || !resolvedSamples?.length || containerWidth === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = containerWidth;
    const h = height;

    // Set canvas size with DPR
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    // Clear and fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, w, h);

    // Draw waveform bars
    const barWidth = Math.max(1, w / resolvedSamples.length);
    const midY = h / 2;
    const maxAmplitude = midY * 0.9;

    // Calculate current time position for coloring
    const playedRatio = duration > 0 ? resolvedCurrentTime / duration : 0;
    const playedSampleIndex = Math.floor(playedRatio * resolvedSamples.length);

    ctx.fillStyle = color;

    resolvedSamples.forEach((sample, i) => {
      const x = i * barWidth;
      const amplitude = Math.abs(sample) * maxAmplitude;

      // Dim bars after current position
      if (i > playedSampleIndex) {
        ctx.globalAlpha = 0.4;
      } else {
        ctx.globalAlpha = 1;
      }

      // Draw centered bar
      ctx.fillRect(x, midY - amplitude, barWidth - 1, amplitude * 2);
    });

    ctx.globalAlpha = 1;

    // Draw playhead line
    if (duration > 0 && resolvedCurrentTime > 0) {
      const playheadX = playedRatio * w;
      ctx.strokeStyle = 'hsl(var(--foreground))';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, h);
      ctx.stroke();
    }
  });

  function handleClick(e: MouseEvent) {
    if (!onClick || duration <= 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    const time = ratio * duration;

    onClick(Math.max(0, Math.min(duration, time)));
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!onClick || duration <= 0) return;

    const step = e.shiftKey ? 5 : 1;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onClick(Math.max(0, resolvedCurrentTime - step));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      onClick(Math.min(duration, resolvedCurrentTime + step));
    }
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  class="waveform"
  bind:clientWidth={containerWidth}
  role={onClick ? 'slider' : undefined}
  tabindex={onClick ? 0 : undefined}
  aria-valuemin={0}
  aria-valuemax={duration}
  aria-valuenow={resolvedCurrentTime}
  aria-label="Audio waveform"
  onclick={onClick ? handleClick : undefined}
  onkeydown={onClick ? handleKeyDown : undefined}
>
  <canvas bind:this={canvas} class:clickable={!!onClick}></canvas>
</div>

<style>
  .waveform {
    width: 100%;
    border-radius: 4px;
    overflow: hidden;
  }

  .waveform:focus {
    outline: 2px solid hsl(var(--primary));
    outline-offset: 2px;
  }

  canvas {
    display: block;
    width: 100%;
  }

  canvas.clickable {
    cursor: pointer;
  }
</style>
