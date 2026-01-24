<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Player, Stage, Vector2 } from '@motion-canvas/core';

  interface Props {
    project: any; // Motion Canvas project
    width?: number;
    height?: number;
    autoplay?: boolean;
    loop?: boolean;
  }

  let {
    project,
    width = 400,
    height = 300,
    autoplay = true,
    loop = true
  }: Props = $props();

  let container: HTMLDivElement;
  let player: Player | null = null;
  let stage: Stage | null = null;

  onMount(() => {
    if (!project) return;

    try {
      // Create stage for rendering
      stage = new Stage();
      stage.configure({
        size: new Vector2(width, height),
        resolutionScale: 1
      });

      // Create player
      player = new Player(project);
      player.configure({
        size: new Vector2(width, height),
        resolutionScale: 1,
        fps: 60,
        range: [0, Infinity],
        audioOffset: 0
      });

      // Subscribe to render events
      player.onRender.subscribe(async () => {
        if (player && stage) {
          await stage.render(
            player.playback.currentScene,
            player.playback.previousScene
          );
        }
      });

      // Add canvas to container
      container.appendChild(stage.finalBuffer);
      stage.finalBuffer.style.width = '100%';
      stage.finalBuffer.style.height = '100%';

      // Configure loop and start
      player.toggleLoop(loop);
      if (autoplay) {
        player.togglePlayback(true);
      }
    } catch (e) {
      console.error('Motion Canvas init error:', e);
    }
  });

  onDestroy(() => {
    if (player) {
      player.deactivate();
    }
  });
</script>

<div
  bind:this={container}
  class="motion-canvas-container"
  style:width="{width}px"
  style:height="{height}px"
></div>

<style>
  .motion-canvas-container {
    position: relative;
    overflow: hidden;
    background: #141414;
    border-radius: 8px;
  }

  .motion-canvas-container :global(canvas) {
    display: block;
  }
</style>
