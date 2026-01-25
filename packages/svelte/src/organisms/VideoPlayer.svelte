<script lang="ts">
  import type { VideoPlayerOrganism, VideoOverlay, TranscriptSegment } from '@daui/core';
  import { untrack } from 'svelte';
  import Icon from '../atoms/Icon.svelte';
  import DetectionBox from '../atoms/DetectionBox.svelte';
  import PoseSkeleton from '../atoms/PoseSkeleton.svelte';

  let {
    id,
    src,
    type = 'video',
    poster,
    currentTime: getTime,
    onTimeUpdate,
    playbackRate: getPlaybackRate,
    playing: getPlaying,
    onPlayPause,
    overlays: getOverlays,
    showOverlays = { boxes: true, poses: true },
    transcript: getTranscript,
    showSubtitles = true,
    onOverlayClick,
    onOverlayContextMenu,
    width,
    height,
    aspectRatio = '16/9',
    controls = true,
  }: Omit<VideoPlayerOrganism, 'organism'> = $props();

  let videoRef = $state<HTMLVideoElement | null>(null);
  let containerRef = $state<HTMLDivElement | null>(null);

  // Resolved props
  let videoSrc = $derived(typeof src === 'function' ? src() : src);
  let externalTime = $derived(getTime?.());
  let playbackRate = $derived(getPlaybackRate?.() ?? 1);
  let isExternalPlaying = $derived(getPlaying?.());
  let overlays = $derived(getOverlays?.() ?? []);
  let transcript = $derived(getTranscript?.() ?? []);

  // Internal state
  let internalTime = $state(0);
  let internalPlaying = $state(false);
  let duration = $state(0);
  let isFullscreen = $state(false);

  // Use external time if provided, otherwise internal
  let currentTime = $derived(externalTime ?? internalTime);
  let isPlaying = $derived(isExternalPlaying ?? internalPlaying);

  // Sync playback rate
  $effect(() => {
    if (videoRef && videoRef.playbackRate !== playbackRate) {
      videoRef.playbackRate = playbackRate;
    }
  });

  // Sync external time to video
  $effect(() => {
    if (videoRef && externalTime !== undefined) {
      // Only seek if difference is significant (> 0.1s)
      if (Math.abs(videoRef.currentTime - externalTime) > 0.1) {
        videoRef.currentTime = externalTime;
      }
    }
  });

  // Sync external play state
  $effect(() => {
    if (videoRef && isExternalPlaying !== undefined) {
      if (isExternalPlaying && videoRef.paused) {
        videoRef.play().catch(() => {});
      } else if (!isExternalPlaying && !videoRef.paused) {
        videoRef.pause();
      }
    }
  });

  // Filter overlays based on showOverlays settings
  let visibleOverlays = $derived.by(() => {
    return overlays.filter((overlay) => {
      if (overlay.type === 'box' && !showOverlays.boxes) return false;
      if (overlay.type === 'pose' && !showOverlays.poses) return false;
      return true;
    });
  });

  // Current subtitle based on time
  let currentSubtitle = $derived.by(() => {
    if (!showSubtitles || transcript.length === 0) return null;
    return transcript.find(
      (seg) => currentTime >= seg.start && currentTime < seg.end
    );
  });

  // Highlighted word in subtitle
  let highlightedWordIndex = $derived.by(() => {
    if (!currentSubtitle?.words) return -1;
    return currentSubtitle.words.findIndex(
      (word) => currentTime >= word.start && currentTime < word.end
    );
  });

  function handleTimeUpdate() {
    if (!videoRef) return;
    internalTime = videoRef.currentTime;
    onTimeUpdate?.(videoRef.currentTime, videoRef.duration);
  }

  function handleLoadedMetadata() {
    if (!videoRef) return;
    duration = videoRef.duration;
    if (playbackRate !== 1) {
      videoRef.playbackRate = playbackRate;
    }
  }

  function handlePlay() {
    internalPlaying = true;
    onPlayPause?.(true);
  }

  function handlePause() {
    internalPlaying = false;
    onPlayPause?.(false);
  }

  function togglePlayPause() {
    if (!videoRef) return;
    if (videoRef.paused) {
      videoRef.play().catch(() => {});
    } else {
      videoRef.pause();
    }
  }

  function handleSeek(e: Event) {
    const target = e.target as HTMLInputElement;
    const newTime = parseFloat(target.value);
    if (videoRef) {
      videoRef.currentTime = newTime;
    }
    internalTime = newTime;
  }

  function handleOverlayClick(overlay: VideoOverlay) {
    onOverlayClick?.(overlay);
  }

  function toggleFullscreen() {
    if (!containerRef) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
      isFullscreen = false;
    } else {
      containerRef.requestFullscreen();
      isFullscreen = true;
    }
  }

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
</script>

<div
  class="video-player"
  {id}
  bind:this={containerRef}
  style:width={width ? (typeof width === 'number' ? `${width}px` : width) : undefined}
  style:height={height ? (typeof height === 'number' ? `${height}px` : height) : undefined}
  style:aspect-ratio={!height ? aspectRatio : undefined}
>
  <!-- Video container -->
  <div class="video-container">
    {#if type === 'video'}
      <video
        bind:this={videoRef}
        src={videoSrc}
        {poster}
        ontimeupdate={handleTimeUpdate}
        onloadedmetadata={handleLoadedMetadata}
        onplay={handlePlay}
        onpause={handlePause}
        preload="metadata"
      >
        <track kind="captions" />
      </video>
    {:else}
      <img src={videoSrc} alt="" class="image-display" />
    {/if}

    <!-- Overlay container -->
    <div class="overlay-container">
      {#each visibleOverlays as overlay, i (overlay.id ?? i)}
        {#if overlay.type === 'box' && overlay.bbox}
          <DetectionBox
            bbox={overlay.bbox}
            label={overlay.label}
            color={overlay.color}
            confidence={overlay.confidence}
            onClick={() => handleOverlayClick(overlay)}
          />
        {:else if overlay.type === 'pose' && overlay.keypoints}
          <PoseSkeleton
            keypoints={overlay.keypoints}
            color={overlay.color}
          />
        {/if}
      {/each}
    </div>

    <!-- Subtitle display -->
    {#if currentSubtitle && showSubtitles}
      <div class="subtitle-container">
        <div class="subtitle-text">
          {#if currentSubtitle.words}
            {#each currentSubtitle.words as word, i}
              <span
                class="subtitle-word"
                class:highlighted={i === highlightedWordIndex}
              >{word.word}</span>{' '}
            {/each}
          {:else}
            {currentSubtitle.text}
          {/if}
        </div>
      </div>
    {/if}

    <!-- Click overlay for play/pause -->
    {#if type === 'video'}
      <button
        class="click-overlay"
        onclick={togglePlayPause}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {#if !isPlaying}
          <div class="play-button-overlay">
            <Icon name="play" size="xl" />
          </div>
        {/if}
      </button>
    {/if}
  </div>

  <!-- Controls -->
  {#if controls && type === 'video'}
    <div class="video-controls">
      <!-- Play/Pause button -->
      <button
        class="control-button"
        onclick={togglePlayPause}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        <Icon name={isPlaying ? 'pause' : 'play'} size="sm" />
      </button>

      <!-- Time display -->
      <span class="time-display">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>

      <!-- Progress bar -->
      <input
        type="range"
        class="progress-bar"
        min="0"
        max={duration || 100}
        step="0.01"
        value={currentTime}
        oninput={handleSeek}
        aria-label="Seek"
      />

      <!-- Fullscreen button -->
      <button
        class="control-button"
        onclick={toggleFullscreen}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
      >
        <Icon name={isFullscreen ? 'minimize' : 'maximize'} size="sm" />
      </button>
    </div>
  {/if}
</div>

<style>
  .video-player {
    display: flex;
    flex-direction: column;
    background-color: hsl(var(--card));
    border-radius: 6px;
    overflow: hidden;
    width: 100%;
  }

  .video-container {
    position: relative;
    width: 100%;
    flex: 1;
    background-color: black;
  }

  video,
  .image-display {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .overlay-container {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .overlay-container > :global(*) {
    pointer-events: auto;
  }

  /* Click overlay */
  .click-overlay {
    position: absolute;
    inset: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .play-button-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    color: white;
    opacity: 0.8;
    transition: opacity 0.2s ease;
  }

  .click-overlay:hover .play-button-overlay {
    opacity: 1;
  }

  /* Subtitles */
  .subtitle-container {
    position: absolute;
    bottom: 40px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    padding: 0 16px;
    pointer-events: none;
  }

  .subtitle-text {
    background-color: rgba(0, 0, 0, 0.75);
    color: white;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 1rem;
    line-height: 1.4;
    max-width: 80%;
    text-align: center;
  }

  .subtitle-word {
    transition: color 0.1s ease;
  }

  .subtitle-word.highlighted {
    color: hsl(var(--primary));
    font-weight: 500;
  }

  /* Controls */
  .video-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background-color: hsl(var(--muted) / 0.5);
    border-top: 1px solid hsl(var(--border));
  }

  .control-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: hsl(var(--foreground));
    transition: background-color 0.15s ease;
  }

  .control-button:hover {
    background-color: hsl(var(--muted));
  }

  .time-display {
    font-family: monospace;
    font-size: 0.8rem;
    color: hsl(var(--muted-foreground));
    min-width: 85px;
  }

  .progress-bar {
    flex: 1;
    height: 4px;
    cursor: pointer;
    accent-color: hsl(var(--primary));
  }

  /* Fullscreen styles */
  :global(.video-player:fullscreen) {
    border-radius: 0;
  }

  :global(.video-player:fullscreen) .video-container {
    flex: 1;
  }

  :global(.video-player:fullscreen) .video-controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.7);
    border-top: none;
  }

  :global(.video-player:fullscreen) .subtitle-container {
    bottom: 80px;
  }
</style>
