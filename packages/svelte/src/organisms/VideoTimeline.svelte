<script lang="ts">
  import type { VideoTimelineOrganism, VideoTimelineTrack } from '@daui/core';
  import { untrack } from 'svelte';
  import Icon from '../atoms/Icon.svelte';
  import Playhead from '../atoms/Playhead.svelte';
  import TrackSegment from '../atoms/TrackSegment.svelte';
  import TrackMarker from '../atoms/TrackMarker.svelte';

  let {
    id,
    duration,
    currentTime,
    onSeek,
    tracks,
    zoom: getZoom,
    onZoomChange,
    minZoom = 1,
    maxZoom = 10,
    selectedIds: getSelectedIds,
    onSelectionChange,
    shortcuts = {},
    height,
    showTimeRuler = true,
  }: Omit<VideoTimelineOrganism, 'organism'> = $props();

  let totalDuration = $derived(duration());
  let time = $derived(currentTime());
  let zoomLevel = $derived(getZoom?.() ?? 1);
  let selectedIds = $derived(getSelectedIds?.() ?? new Set<string>());

  let containerRef = $state<HTMLDivElement | null>(null);
  let tracksContainerRef = $state<HTMLDivElement | null>(null);
  let scrollLeft = $state(0);

  // Zoom affects the visible range
  let visibleWidth = $derived(100 / zoomLevel);

  // Time ruler intervals based on zoom
  let rulerInterval = $derived.by(() => {
    const secondsVisible = totalDuration / zoomLevel;
    if (secondsVisible <= 10) return 1;
    if (secondsVisible <= 30) return 5;
    if (secondsVisible <= 60) return 10;
    if (secondsVisible <= 300) return 30;
    return 60;
  });

  let rulerMarks = $derived.by(() => {
    const marks: { time: number; label: string }[] = [];
    for (let t = 0; t <= totalDuration; t += rulerInterval) {
      const m = Math.floor(t / 60);
      const s = Math.floor(t % 60);
      marks.push({
        time: t,
        label: m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${s}s`,
      });
    }
    return marks;
  });

  function handleSeek(newTime: number) {
    onSeek(Math.max(0, Math.min(newTime, totalDuration)));
  }

  function handleZoom(delta: number) {
    if (!onZoomChange) return;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoomLevel + delta));
    onZoomChange(newZoom);
  }

  function handleTrackClick(e: MouseEvent, track: VideoTimelineTrack) {
    if (!tracksContainerRef) return;

    const target = e.target as HTMLElement;
    if (target.closest('.track-segment') || target.closest('.track-marker')) return;

    const rect = tracksContainerRef.getBoundingClientRect();
    const x = e.clientX - rect.left + scrollLeft;
    const totalWidth = rect.width * zoomLevel;
    const percent = x / totalWidth;
    const newTime = percent * totalDuration;
    handleSeek(newTime);
  }

  function handleSegmentClick(segmentId: string, e: MouseEvent) {
    e.stopPropagation();
    if (!onSelectionChange) return;

    const newSelection = new Set(selectedIds);

    if (e.ctrlKey || e.metaKey) {
      // Toggle selection
      if (newSelection.has(segmentId)) {
        newSelection.delete(segmentId);
      } else {
        newSelection.add(segmentId);
      }
    } else if (e.shiftKey) {
      // Add to selection
      newSelection.add(segmentId);
    } else {
      // Replace selection
      newSelection.clear();
      newSelection.add(segmentId);
    }

    onSelectionChange(newSelection);
  }

  function handleKeyDown(e: KeyboardEvent) {
    // Zoom with +/-
    if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      handleZoom(0.5);
    } else if (e.key === '-') {
      e.preventDefault();
      handleZoom(-0.5);
    }

    // Shortcuts
    if (shortcuts.selectAll && (e.ctrlKey || e.metaKey) && e.key === 'a') {
      e.preventDefault();
      if (onSelectionChange) {
        const allIds = new Set<string>();
        tracks.forEach((track) => {
          const data = track.data();
          data.forEach((item) => allIds.add(item.id));
        });
        onSelectionChange(allIds);
      }
    }
  }

  function handleScroll(e: Event) {
    const target = e.target as HTMLElement;
    scrollLeft = target.scrollLeft;
  }

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function getTrackVisibility(track: VideoTimelineTrack): boolean {
    if (typeof track.visible === 'function') return track.visible();
    return track.visible ?? true;
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  class="video-timeline"
  {id}
  bind:this={containerRef}
  onkeydown={handleKeyDown}
  tabindex="0"
  role="application"
  aria-label="Video timeline"
  style:height={height ? `${height}px` : undefined}
>
  <!-- Toolbar -->
  <div class="timeline-toolbar">
    <div class="toolbar-left">
      <span class="time-display">{formatTime(time)} / {formatTime(totalDuration)}</span>
    </div>
    <div class="toolbar-right">
      <button
        class="zoom-button"
        onclick={() => handleZoom(-0.5)}
        disabled={zoomLevel <= minZoom}
        aria-label="Zoom out"
      >
        <Icon name="minus" size="xs" />
      </button>
      <span class="zoom-level">{Math.round(zoomLevel * 100)}%</span>
      <button
        class="zoom-button"
        onclick={() => handleZoom(0.5)}
        disabled={zoomLevel >= maxZoom}
        aria-label="Zoom in"
      >
        <Icon name="plus" size="xs" />
      </button>
    </div>
  </div>

  <!-- Time ruler -->
  {#if showTimeRuler}
    <div class="time-ruler">
      <div class="ruler-header"></div>
      <div class="ruler-track" style:width="{zoomLevel * 100}%">
        {#each rulerMarks as mark (mark.time)}
          <div
            class="ruler-mark"
            style:left="{(mark.time / totalDuration) * 100}%"
          >
            <span class="ruler-label">{mark.label}</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Tracks container -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="tracks-wrapper"
    onscroll={handleScroll}
    bind:this={tracksContainerRef}
  >
    <div class="tracks-content" style:width="{zoomLevel * 100}%">
      {#each tracks as track (track.id)}
        {@const trackData = track.data()}
        {@const isVisible = getTrackVisibility(track)}

        <div
          class="track"
          class:hidden={!isVisible}
          data-track-id={track.id}
        >
          <!-- Track header -->
          <div class="track-header">
            {#if track.onVisibilityChange}
              <button
                class="visibility-toggle"
                onclick={() => track.onVisibilityChange?.(!isVisible)}
                aria-label={isVisible ? 'Hide track' : 'Show track'}
              >
                <Icon name={isVisible ? 'eye' : 'eye-off'} size="xs" />
              </button>
            {/if}

            {#if track.icon}
              <Icon name={track.icon} size="xs" />
            {/if}

            <span class="track-label">{track.label}</span>
          </div>

          <!-- Track content -->
          <!-- svelte-ignore a11y_click_events_have_key_events a11y_role_has_required_aria_props -->
          <div
            class="track-content"
            onclick={(e) => handleTrackClick(e, track)}
            role="slider"
            tabindex="0"
            aria-valuenow={time}
            aria-valuemin={0}
            aria-valuemax={totalDuration}
          >
            {#if isVisible}
              {#if track.type === 'segments'}
                {#each trackData as item (item.id)}
                  <TrackSegment
                    start={item.start}
                    end={item.end ?? item.start + 1}
                    duration={totalDuration}
                    color={item.color ?? track.color}
                    label={item.label}
                    active={selectedIds.has(item.id)}
                    onClick={(e) => e && handleSegmentClick(item.id, e)}
                  />
                {/each}
              {:else if track.type === 'markers' || track.type === 'keyframes'}
                {#each trackData as item (item.id)}
                  <TrackMarker
                    time={item.start}
                    duration={totalDuration}
                    variant={track.type === 'keyframes' ? 'triangle' : 'dot'}
                    label={item.label}
                    color={item.color ?? track.color}
                    count={item.count}
                  />
                {/each}
              {/if}
            {/if}
          </div>
        </div>
      {/each}

      <!-- Playhead overlay -->
      <div class="playhead-overlay">
        <Playhead
          time={() => time}
          duration={() => totalDuration}
          onSeek={handleSeek}
          draggable={true}
        />
      </div>
    </div>
  </div>
</div>

<style>
  .video-timeline {
    display: flex;
    flex-direction: column;
    background-color: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: 6px;
    overflow: hidden;
  }

  .video-timeline:focus {
    outline: 2px solid hsl(var(--ring));
    outline-offset: -2px;
  }

  /* Toolbar */
  .timeline-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px;
    background-color: hsl(var(--muted) / 0.3);
    border-bottom: 1px solid hsl(var(--border));
  }

  .time-display {
    font-family: monospace;
    font-size: 0.8rem;
    color: hsl(var(--foreground));
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .zoom-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    background: transparent;
    border: 1px solid hsl(var(--border));
    border-radius: 4px;
    cursor: pointer;
    color: hsl(var(--foreground));
  }

  .zoom-button:hover:not(:disabled) {
    background-color: hsl(var(--muted));
  }

  .zoom-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .zoom-level {
    font-size: 0.75rem;
    min-width: 40px;
    text-align: center;
    color: hsl(var(--muted-foreground));
  }

  /* Time ruler */
  .time-ruler {
    display: flex;
    height: 24px;
    border-bottom: 1px solid hsl(var(--border));
    overflow: hidden;
  }

  .ruler-header {
    width: 140px;
    min-width: 140px;
    background-color: hsl(var(--muted) / 0.3);
    border-right: 1px solid hsl(var(--border));
  }

  .ruler-track {
    position: relative;
    flex: 1;
    min-width: 100%;
  }

  .ruler-mark {
    position: absolute;
    top: 0;
    bottom: 0;
    border-left: 1px solid hsl(var(--border) / 0.5);
  }

  .ruler-label {
    position: absolute;
    top: 4px;
    left: 4px;
    font-size: 0.65rem;
    color: hsl(var(--muted-foreground));
    white-space: nowrap;
  }

  /* Tracks */
  .tracks-wrapper {
    flex: 1;
    overflow-x: auto;
    overflow-y: auto;
    position: relative;
  }

  .tracks-content {
    position: relative;
    min-width: 100%;
  }

  .track {
    display: flex;
    align-items: stretch;
    min-height: 32px;
    border-bottom: 1px solid hsl(var(--border));
  }

  .track.hidden {
    opacity: 0.5;
  }

  .track-header {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 140px;
    min-width: 140px;
    padding: 0 8px;
    background-color: hsl(var(--muted) / 0.3);
    border-right: 1px solid hsl(var(--border));
    font-size: 0.75rem;
    position: sticky;
    left: 0;
    z-index: 5;
  }

  .visibility-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    background: transparent;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    color: hsl(var(--muted-foreground));
  }

  .visibility-toggle:hover {
    color: hsl(var(--foreground));
  }

  .track-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: hsl(var(--foreground));
  }

  .track-content {
    flex: 1;
    position: relative;
    background-color: hsl(var(--muted) / 0.1);
    cursor: pointer;
  }

  .track-content:hover {
    background-color: hsl(var(--muted) / 0.2);
  }

  /* Playhead overlay */
  .playhead-overlay {
    position: absolute;
    top: 0;
    left: 140px;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  .playhead-overlay :global(.playhead-container) {
    pointer-events: auto;
  }
</style>
