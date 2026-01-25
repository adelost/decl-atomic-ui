<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Matter from 'matter-js';

  interface Props {
    width?: number;
    height?: number;
    background?: string;
    gravity?: { x: number; y: number };
    wireframes?: boolean;
    onReady?: (context: { engine: Matter.Engine; world: Matter.World; render: Matter.Render }) => void;
    onFrame?: (delta: number) => void;
  }

  let {
    width = 800,
    height = 600,
    background = '#1a1a2e',
    gravity = { x: 0, y: 1 },
    wireframes = false,
    onReady,
    onFrame,
  }: Props = $props();

  let container: HTMLDivElement;
  let engine: Matter.Engine;
  let render: Matter.Render;
  let runner: Matter.Runner;

  onMount(() => {
    // Create engine
    engine = Matter.Engine.create();
    engine.gravity.x = gravity.x;
    engine.gravity.y = gravity.y;

    // Create renderer
    render = Matter.Render.create({
      element: container,
      engine: engine,
      options: {
        width,
        height,
        background,
        wireframes,
        showAngleIndicator: false,
      },
    });

    // Demo: add ground and falling boxes if no onReady
    if (!onReady) {
      const { Bodies, Composite } = Matter;

      // Ground
      const ground = Bodies.rectangle(width / 2, height - 30, width, 60, {
        isStatic: true,
        render: { fillStyle: '#374151' },
      });

      // Walls
      const leftWall = Bodies.rectangle(0, height / 2, 60, height, {
        isStatic: true,
        render: { fillStyle: '#374151' },
      });
      const rightWall = Bodies.rectangle(width, height / 2, 60, height, {
        isStatic: true,
        render: { fillStyle: '#374151' },
      });

      // Falling boxes
      const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];
      const boxes = [];
      for (let i = 0; i < 10; i++) {
        const size = 30 + Math.random() * 40;
        const box = Bodies.rectangle(
          100 + Math.random() * (width - 200),
          -100 - Math.random() * 300,
          size,
          size,
          {
            render: {
              fillStyle: colors[Math.floor(Math.random() * colors.length)],
            },
            restitution: 0.6,
            friction: 0.1,
          }
        );
        boxes.push(box);
      }

      Composite.add(engine.world, [ground, leftWall, rightWall, ...boxes]);
    }

    // Notify ready
    onReady?.({ engine, world: engine.world, render });

    // Create runner
    runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    // Custom frame callback
    if (onFrame) {
      Matter.Events.on(engine, 'afterUpdate', () => {
        onFrame?.(engine.timing.lastDelta);
      });
    }
  });

  onDestroy(() => {
    if (render) {
      Matter.Render.stop(render);
      render.canvas.remove();
    }
    if (runner) {
      Matter.Runner.stop(runner);
    }
    if (engine) {
      Matter.Engine.clear(engine);
    }
  });
</script>

<div
  bind:this={container}
  class="matter-canvas"
  style:width="{width}px"
  style:height="{height}px"
></div>

<style>
  .matter-canvas {
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .matter-canvas :global(canvas) {
    display: block;
  }
</style>
