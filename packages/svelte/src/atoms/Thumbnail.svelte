<script lang="ts">
  import type { ThumbnailAtom } from '@daui/core';

  let {
    src,
    time,
    width = 120,
    height = 68,
    rounded = false,
    placeholder,
    onClick,
  }: Omit<ThumbnailAtom, 'atom'> = $props();

  let video: HTMLVideoElement;
  let canvas: HTMLCanvasElement;
  let thumbnailUrl = $state<string | null>(null);
  let loading = $state(true);
  let error = $state(false);

  // Resolve reactive props
  let resolvedSrc = $derived(typeof src === 'function' ? src() : src);
  let resolvedTime = $derived(typeof time === 'function' ? time() : time);

  // Rounded class
  let roundedClass = $derived.by(() => {
    if (rounded === true) return 'rounded-md';
    if (rounded === 'sm') return 'rounded-sm';
    if (rounded === 'md') return 'rounded-md';
    if (rounded === 'lg') return 'rounded-lg';
    return '';
  });

  // Cache for thumbnails: src:time -> dataUrl
  const thumbnailCache = new Map<string, string>();

  // Extract frame when video metadata is loaded
  $effect(() => {
    if (!resolvedSrc || resolvedTime === undefined) return;

    const cacheKey = `${resolvedSrc}:${resolvedTime.toFixed(2)}`;

    // Check cache first
    if (thumbnailCache.has(cacheKey)) {
      thumbnailUrl = thumbnailCache.get(cacheKey)!;
      loading = false;
      return;
    }

    loading = true;
    error = false;

    // Create offscreen video to extract frame
    const offscreenVideo = document.createElement('video');
    offscreenVideo.crossOrigin = 'anonymous';
    offscreenVideo.preload = 'metadata';
    offscreenVideo.muted = true;
    offscreenVideo.playsInline = true;

    const cleanup = () => {
      offscreenVideo.removeAttribute('src');
      offscreenVideo.load();
    };

    offscreenVideo.onloadedmetadata = () => {
      // Clamp time to valid range
      const seekTime = Math.min(resolvedTime, offscreenVideo.duration || 0);
      offscreenVideo.currentTime = Math.max(0, seekTime);
    };

    offscreenVideo.onseeked = () => {
      // Extract frame to canvas
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = offscreenVideo.videoWidth || width;
      offscreenCanvas.height = offscreenVideo.videoHeight || height;

      const ctx = offscreenCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(offscreenVideo, 0, 0);
        const dataUrl = offscreenCanvas.toDataURL('image/jpeg', 0.8);
        thumbnailCache.set(cacheKey, dataUrl);
        thumbnailUrl = dataUrl;
      }

      loading = false;
      cleanup();
    };

    offscreenVideo.onerror = () => {
      error = true;
      loading = false;
      cleanup();
    };

    offscreenVideo.src = resolvedSrc;
  });

  function handleClick() {
    onClick?.();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  class="thumbnail {roundedClass}"
  class:clickable={!!onClick}
  style:width="{width}px"
  style:height="{height}px"
  role={onClick ? 'button' : undefined}
  tabindex={onClick ? 0 : undefined}
  onclick={onClick ? handleClick : undefined}
  onkeydown={onClick ? handleKeyDown : undefined}
>
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
    </div>
  {:else if error || !thumbnailUrl}
    <div class="placeholder">
      {#if placeholder}
        <img src={placeholder} alt="Video thumbnail placeholder" />
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
          <line x1="7" y1="2" x2="7" y2="22"></line>
          <line x1="17" y1="2" x2="17" y2="22"></line>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <line x1="2" y1="7" x2="7" y2="7"></line>
          <line x1="2" y1="17" x2="7" y2="17"></line>
          <line x1="17" y1="17" x2="22" y2="17"></line>
          <line x1="17" y1="7" x2="22" y2="7"></line>
        </svg>
      {/if}
    </div>
  {:else}
    <img src={thumbnailUrl} alt="Video thumbnail at {resolvedTime?.toFixed(1)}s" />
  {/if}
</div>

<style>
  .thumbnail {
    position: relative;
    overflow: hidden;
    background-color: hsl(var(--muted));
    flex-shrink: 0;
  }

  .thumbnail.clickable {
    cursor: pointer;
  }

  .thumbnail.clickable:hover {
    opacity: 0.9;
  }

  .thumbnail.clickable:focus {
    outline: 2px solid hsl(var(--primary));
    outline-offset: 2px;
  }

  .thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .loading,
  .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: hsl(var(--muted-foreground));
  }

  .placeholder svg {
    width: 32px;
    height: 32px;
    opacity: 0.5;
  }

  .placeholder img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.5;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid hsl(var(--muted-foreground) / 0.3);
    border-top-color: hsl(var(--primary));
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Rounded variants */
  .rounded-sm {
    border-radius: 0.125rem;
  }

  .rounded-md {
    border-radius: 0.375rem;
  }

  .rounded-lg {
    border-radius: 0.5rem;
  }
</style>
