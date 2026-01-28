<script lang="ts">
  import type { MediaOverlayOrganism, MediaOverlayLayer } from '@daui/core';
  import { onMount, onDestroy } from 'svelte';
  import Icon from '../atoms/Icon.svelte';
  import OverlayToggles from '../molecules/OverlayToggles.svelte';
  import { CanvasRenderer, type CanvasLayer, type HitResult } from '../canvas';

  let {
    id,
    src,
    type = 'video',
    currentTime: getTime,
    duration: getDuration,
    onTimeUpdate,
    layers = [],
    showOverlayToggles = false,
    showLegend = false,
    showFps = false,
    maxOverlays = 100,
    onOverlayClick,
    onOverlayHover,
    aspectRatio = '16/9',
    controls = true,
  }: Omit<MediaOverlayOrganism, 'organism'> = $props();

  // Refs
  let containerRef = $state<HTMLDivElement | null>(null);
  let videoRef = $state<HTMLVideoElement | null>(null);
  let canvasRef = $state<HTMLCanvasElement | null>(null);
  let renderer: CanvasRenderer | null = null;

  // Resolved props
  let mediaSrc = $derived(typeof src === 'function' ? src() : src);
  let externalTime = $derived(getTime?.());
  let totalDuration = $derived(getDuration?.() ?? 0);

  // Internal state
  let internalTime = $state(0);
  let internalDuration = $state(0);
  let isPlaying = $state(false);
  let containerSize = $state({ width: 0, height: 0 });

  // Layer visibility state
  let layerVisibility = $state<Record<string, boolean>>({});

  // Hover state
  let hoveredItem = $state<HitResult | null>(null);

  // Computed values
  let currentTime = $derived(externalTime ?? internalTime);
  let duration = $derived(totalDuration || internalDuration);

  // Initialize visibility when layers change
  $effect(() => {
    const newVisibility: Record<string, boolean> = {};
    layers.forEach((l) => {
      newVisibility[l.id] = layerVisibility[l.id] ?? true;
    });
    layerVisibility = newVisibility;
  });

  // Sync external time to video
  $effect(() => {
    if (type === 'video' && videoRef && externalTime !== undefined) {
      if (Math.abs(videoRef.currentTime - externalTime) > 0.1) {
        videoRef.currentTime = externalTime;
      }
    }
  });

  // Update renderer when layers or visibility change
  $effect(() => {
    if (!renderer) return;

    const canvasLayers: CanvasLayer[] = layers
      .filter((layer) => {
        const layerVisible = typeof layer.visible === 'function' ? layer.visible() : (layer.visible ?? true);
        const toggleVisible = layerVisibility[layer.id] ?? true;
        return layerVisible && toggleVisible;
      })
      .map((layer) => {
        // Resolve data (can be function or array)
        const data = typeof layer.data === 'function' ? layer.data() : layer.data;

        // Filter by time if temporal
        let filteredData = data;
        if (layer.temporal && currentTime !== undefined) {
          filteredData = data.filter((item: any) => {
            if (item.startTime === undefined && item.endTime === undefined) return true;
            const start = item.startTime ?? 0;
            const end = item.endTime ?? Infinity;
            return currentTime >= start && currentTime <= end;
          });
        }

        return {
          id: layer.id,
          type: layer.type,
          visible: true,
          color: layer.color ?? 'hsl(220, 70%, 50%)',
          data: filteredData,
          options: layer.options,
          render: layer.render,
        } as CanvasLayer;
      });

    renderer.setLayers(canvasLayers);
  });

  // Update hovered state in renderer
  $effect(() => {
    if (renderer) {
      renderer.setHovered(hoveredItem?.item?.id);
    }
  });

  // Toggle items for overlay toggles component
  let toggleItems = $derived(
    layers.map((layer) => ({
      id: layer.id,
      label: layer.label ?? layer.id.charAt(0).toUpperCase() + layer.id.slice(1),
      icon: getLayerIcon(layer.type),
      enabled: () => layerVisibility[layer.id] ?? true,
      onChange: (enabled: boolean) => {
        layerVisibility = { ...layerVisibility, [layer.id]: enabled };
      },
    }))
  );

  function getLayerIcon(layerType: MediaOverlayLayer['type']): string {
    switch (layerType) {
      case 'boxes': return 'grid';
      case 'poses': return 'user';
      case 'masks': return 'image';
      case 'points': return 'circle-dot';
      case 'custom': return 'star';
      default: return 'eye';
    }
  }

  // Setup renderer on mount
  onMount(() => {
    if (!canvasRef) return;

    renderer = new CanvasRenderer(canvasRef, {
      showFps,
      maxOverlays,
    });

    // Set initial size
    updateCanvasSize();

    // Start render loop
    renderer.start();

    // Watch for container resize
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    if (containerRef) {
      resizeObserver.observe(containerRef);
    }

    return () => {
      resizeObserver.disconnect();
    };
  });

  onDestroy(() => {
    renderer?.destroy();
  });

  function updateCanvasSize() {
    if (!containerRef || !renderer) return;

    const rect = containerRef.getBoundingClientRect();
    containerSize = { width: rect.width, height: rect.height };
    renderer.setSize(rect.width, rect.height);
  }

  // Video event handlers
  function handleTimeUpdate() {
    if (!videoRef) return;
    internalTime = videoRef.currentTime;
    onTimeUpdate?.(videoRef.currentTime);
  }

  function handleLoadedMetadata() {
    if (!videoRef) return;
    internalDuration = videoRef.duration;
  }

  function handlePlay() {
    isPlaying = true;
  }

  function handlePause() {
    isPlaying = false;
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
    onTimeUpdate?.(newTime);
  }

  // Mouse event handlers for canvas
  function handleCanvasMouseMove(e: MouseEvent) {
    if (!renderer || !containerRef) return;

    const rect = containerRef.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const hit = renderer.hitTester.hitTest(x, y);

    if (hit?.item?.id !== hoveredItem?.item?.id) {
      hoveredItem = hit;
      onOverlayHover?.(hit?.item as any ?? null, hit?.layerId ?? null);
    }
  }

  function handleCanvasMouseLeave() {
    if (hoveredItem) {
      hoveredItem = null;
      onOverlayHover?.(null, null);
    }
  }

  function handleCanvasClick(e: MouseEvent) {
    if (!renderer || !containerRef) return;

    const rect = containerRef.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const hit = renderer.hitTester.hitTest(x, y);

    if (hit) {
      onOverlayClick?.(hit.item as any, hit.layerId);
    }
  }

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
</script>

<div class="media-overlay" {id}>
  <!-- Overlay toggles -->
  {#if showOverlayToggles && layers.length > 1}
    <div class="toggles-bar">
      <OverlayToggles items={toggleItems} showAllToggle={true} size="sm" />
    </div>
  {/if}

  <!-- Media container -->
  <div
    class="media-container"
    bind:this={containerRef}
    style:aspect-ratio={aspectRatio}
  >
    <!-- Video or Image -->
    {#if type === 'video'}
      <video
        bind:this={videoRef}
        src={mediaSrc}
        ontimeupdate={handleTimeUpdate}
        onloadedmetadata={handleLoadedMetadata}
        onplay={handlePlay}
        onpause={handlePause}
        preload="metadata"
      >
        <track kind="captions" />
      </video>
    {:else}
      <img src={mediaSrc} alt="" class="image-display" />
    {/if}

    <!-- Canvas overlay -->
    <canvas
      bind:this={canvasRef}
      class="overlay-canvas"
      class:clickable={!!onOverlayClick}
      onmousemove={handleCanvasMouseMove}
      onmouseleave={handleCanvasMouseLeave}
      onclick={handleCanvasClick}
    ></canvas>

    <!-- Click overlay for play/pause (only when not hovering an item) -->
    {#if type === 'video' && !hoveredItem}
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
      <button
        class="control-button"
        onclick={togglePlayPause}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        <Icon name={isPlaying ? 'pause' : 'play'} size="sm" />
      </button>

      <span class="time-display">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>

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
    </div>
  {/if}

  <!-- Legend -->
  {#if showLegend && layers.length > 0}
    <div class="legend">
      {#each layers as layer (layer.id)}
        {#if layerVisibility[layer.id] ?? true}
          <div class="legend-item">
            <span
              class="legend-color"
              style:background-color={layer.color ?? 'hsl(var(--primary))'}
            ></span>
            <span class="legend-label">{layer.label ?? layer.id}</span>
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
  .media-overlay {
    display: flex;
    flex-direction: column;
    background-color: hsl(var(--card));
    border-radius: 6px;
    overflow: hidden;
    width: 100%;
  }

  .toggles-bar {
    padding: 8px;
    border-bottom: 1px solid hsl(var(--border));
  }

  .media-container {
    position: relative;
    width: 100%;
    background-color: black;
  }

  video,
  .image-display {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .overlay-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: auto;
  }

  .overlay-canvas.clickable {
    cursor: pointer;
  }

  /* Click overlay for play/pause */
  .click-overlay {
    position: absolute;
    inset: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
    pointer-events: auto;
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

  /* Legend */
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 8px 12px;
    background-color: hsl(var(--muted) / 0.3);
    border-top: 1px solid hsl(var(--border));
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
  }

  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }
</style>
