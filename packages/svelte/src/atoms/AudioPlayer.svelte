<script lang="ts">
  import type { AudioPlayerAtom } from '@daui/core';
  import Icon from './Icon.svelte';

  let {
    src,
    currentTime: getExternalTime,
    onTimeUpdate,
    playing: getExternalPlaying,
    onPlayPause,
    showDownload = false,
    showProgress = true,
    showDuration = true,
    downloadFilename,
    size = 'md',
  }: AudioPlayerAtom = $props();

  let audio: HTMLAudioElement;
  let localTime = $state(0);
  let localPlaying = $state(false);
  let duration = $state(0);

  let resolvedSrc = $derived(typeof src === 'function' ? src() : src);
  let isPlaying = $derived(getExternalPlaying?.() ?? localPlaying);
  let displayTime = $derived(getExternalTime?.() ?? localTime);
  let progress = $derived(duration > 0 ? (displayTime / duration) * 100 : 0);

  // Sync external time changes to audio element
  $effect(() => {
    const externalTime = getExternalTime?.();
    if (externalTime !== undefined && audio && Math.abs(externalTime - audio.currentTime) > 0.5) {
      audio.currentTime = externalTime;
    }
  });

  // Sync external playing state to audio element
  $effect(() => {
    const externalPlaying = getExternalPlaying?.();
    if (externalPlaying !== undefined && audio) {
      if (externalPlaying && audio.paused) {
        audio.play();
      } else if (!externalPlaying && !audio.paused) {
        audio.pause();
      }
    }
  });

  function togglePlay() {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    const newPlaying = !isPlaying;
    onPlayPause?.(newPlaying);
    if (!getExternalPlaying) {
      localPlaying = newPlaying;
    }
  }

  function handleSeek(e: MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = percent * duration;
    audio.currentTime = newTime;
    onTimeUpdate?.(newTime);
    if (!getExternalTime) {
      localTime = newTime;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const newTime = Math.max(0, audio.currentTime - 5);
      audio.currentTime = newTime;
      onTimeUpdate?.(newTime);
      if (!getExternalTime) localTime = newTime;
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const newTime = Math.min(duration, audio.currentTime + 5);
      audio.currentTime = newTime;
      onTimeUpdate?.(newTime);
      if (!getExternalTime) localTime = newTime;
    }
  }

  function handlePlay() {
    localPlaying = true;
    onPlayPause?.(true);
  }

  function handlePause() {
    localPlaying = false;
    onPlayPause?.(false);
  }

  function handleTimeUpdate() {
    const time = audio.currentTime;
    localTime = time;
    onTimeUpdate?.(time);
  }

  function handleLoadedMetadata() {
    duration = audio.duration;
  }

  function handleEnded() {
    localPlaying = false;
    localTime = 0;
    onPlayPause?.(false);
  }

  function formatTime(s: number): string {
    if (!isFinite(s)) return '0:00';
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
</script>

<div class="audio-player size-{size}">
  <audio
    bind:this={audio}
    src={resolvedSrc}
    onplay={handlePlay}
    onpause={handlePause}
    ontimeupdate={handleTimeUpdate}
    onloadedmetadata={handleLoadedMetadata}
    onended={handleEnded}
    preload="metadata"
  ></audio>

  <button class="play-btn" onclick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
    <Icon name={isPlaying ? 'pause' : 'play'} size={size === 'sm' ? 'sm' : 'md'} />
  </button>

  {#if showProgress}
    <div
      class="progress-container"
      onclick={handleSeek}
      onkeydown={handleKeydown}
      role="slider"
      tabindex="0"
      aria-valuenow={displayTime}
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-label="Audio progress"
    >
      <div class="progress-bar">
        <div class="progress-fill" style="width: {progress}%"></div>
      </div>
    </div>
  {/if}

  {#if showDuration}
    <span class="time">{formatTime(displayTime)} / {formatTime(duration)}</span>
  {/if}

  {#if showDownload && resolvedSrc}
    <a
      href={resolvedSrc}
      download={downloadFilename || ''}
      class="download-btn"
      aria-label="Download audio"
    >
      <Icon name="download" size={size === 'sm' ? 'xs' : 'sm'} />
    </a>
  {/if}
</div>

<style>
  .audio-player {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    width: 100%;
  }

  .audio-player.size-sm {
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .audio-player.size-lg {
    gap: 1rem;
    padding: 1rem;
  }

  .play-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    background-color: #0f172a;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.15s;
    flex-shrink: 0;
  }

  .size-sm .play-btn {
    width: 2rem;
    height: 2rem;
  }

  .size-lg .play-btn {
    width: 3rem;
    height: 3rem;
  }

  .play-btn:hover {
    background-color: #1e293b;
    transform: scale(1.05);
  }

  .play-btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px white, 0 0 0 4px #0f172a;
  }

  .progress-container {
    flex: 1;
    height: 2rem;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0.5rem 0;
  }

  .progress-container:focus-visible {
    outline: none;
  }

  .progress-container:focus-visible .progress-bar {
    box-shadow: 0 0 0 2px #0f172a;
  }

  .progress-bar {
    width: 100%;
    height: 0.375rem;
    background-color: #e2e8f0;
    border-radius: 9999px;
    overflow: hidden;
    position: relative;
  }

  .size-sm .progress-bar {
    height: 0.25rem;
  }

  .size-lg .progress-bar {
    height: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background-color: #0f172a;
    border-radius: 9999px;
    transition: width 0.1s ease-out;
  }

  .time {
    font-size: 0.75rem;
    color: #64748b;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .size-sm .time {
    font-size: 0.625rem;
  }

  .size-lg .time {
    font-size: 0.875rem;
  }

  .download-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    background: none;
    border: none;
    border-radius: 0.375rem;
    color: #64748b;
    cursor: pointer;
    transition: all 0.15s;
    text-decoration: none;
    flex-shrink: 0;
  }

  .size-sm .download-btn {
    width: 1.5rem;
    height: 1.5rem;
  }

  .download-btn:hover {
    color: #0f172a;
    background-color: #e2e8f0;
  }
</style>
