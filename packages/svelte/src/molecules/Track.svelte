<script lang="ts">
  import type { TrackMolecule } from '@daui/core';
  import Icon from '../atoms/Icon.svelte';
  import TrackSegment from '../atoms/TrackSegment.svelte';
  import TrackMarker from '../atoms/TrackMarker.svelte';

  let {
    id,
    label,
    icon,
    duration,
    currentTime,
    trackVisible = true,
    onVisibilityChange,
    onSeek,
    segments = [],
    markers = [],
  }: Omit<TrackMolecule, 'molecule'> = $props();

  let isVisible = $derived(typeof trackVisible === 'function' ? trackVisible() : trackVisible);
  let totalDuration = $derived(duration());

  let trackRef = $state<HTMLDivElement | null>(null);

  function handleTrackClick(e: MouseEvent) {
    if (!onSeek || !trackRef) return;

    const target = e.target as HTMLElement;
    // Don't seek if clicking on a segment or marker
    if (target.closest('.track-segment') || target.closest('.track-marker')) return;

    const rect = trackRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    const newTime = percent * totalDuration;
    onSeek(newTime);
  }

  function toggleVisibility() {
    onVisibilityChange?.(!isVisible);
  }
</script>

<div class="track" class:hidden={!isVisible} data-track-id={id}>
  <!-- Track header -->
  <div class="track-header">
    {#if onVisibilityChange}
      <button
        class="visibility-toggle"
        onclick={toggleVisibility}
        aria-label={isVisible ? 'Hide track' : 'Show track'}
      >
        <Icon name={isVisible ? 'eye' : 'eye-off'} size="xs" />
      </button>
    {/if}

    {#if icon}
      <Icon name={icon} size="xs" />
    {/if}

    <span class="track-label">{label}</span>
  </div>

  <!-- Track content -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="track-content"
    bind:this={trackRef}
    onclick={handleTrackClick}
    role="slider"
    tabindex="0"
    aria-label="{label} track"
    aria-valuenow={currentTime()}
    aria-valuemin={0}
    aria-valuemax={totalDuration}
  >
    {#if isVisible}
      <!-- Segments -->
      {#each segments as segment (segment.id)}
        <TrackSegment
          start={segment.start}
          end={segment.end}
          duration={totalDuration}
          color={segment.color}
          label={segment.label}
        />
      {/each}

      <!-- Markers -->
      {#each markers as marker (marker.id)}
        <TrackMarker
          time={marker.time}
          duration={totalDuration}
          variant={marker.variant}
          label={marker.label}
          color={marker.color}
          count={marker.count}
        />
      {/each}
    {/if}
  </div>
</div>

<style>
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
    overflow: hidden;
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
    transition: color 0.15s ease;
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
</style>
