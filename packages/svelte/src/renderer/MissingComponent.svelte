<script lang="ts">
  let { type, name }: { type: string; name: string } = $props();

  interface PresetHint {
    preset: string;
    isIntegration?: boolean;
    peerDep?: string;
  }

  const presetHints: Record<string, PresetHint> = {
    // Media atoms/molecules/organisms
    'video-timeline': { preset: 'media' },
    'video-player': { preset: 'media' },
    playhead: { preset: 'media' },
    'track-segment': { preset: 'media' },
    'track-marker': { preset: 'media' },
    'detection-box': { preset: 'media' },
    'pose-skeleton': { preset: 'media' },
    'frame-controls': { preset: 'media' },
    'speed-control': { preset: 'media' },
    track: { preset: 'media' },
    'data-point': { preset: 'media' },
    // Integrations (require external dependencies)
    'motion-canvas': {
      preset: 'motionCanvas',
      isIntegration: true,
      peerDep: '@motion-canvas/core',
    },
    'three-canvas': {
      preset: 'three',
      isIntegration: true,
      peerDep: 'three',
    },
    'matter-canvas': {
      preset: 'matter',
      isIntegration: true,
      peerDep: 'matter-js',
    },
  };

  let hint = $derived(presetHints[name]);
</script>

<div class="missing-component">
  <strong>"{name}" ({type}) is not registered</strong>

  {#if hint}
    {#if hint.isIntegration}
      <p>This component requires an external library.</p>
      <pre>pnpm add {hint.peerDep}

import {'{'} register {'}'} from 'svelte-daui';
import {'{'} {hint.preset} {'}'} from 'svelte-daui/integrations/{name}';

register({hint.preset});</pre>
    {:else}
      <pre>import {'{'} register {'}'} from 'svelte-daui';
import {'{'} {hint.preset} {'}'} from 'svelte-daui/{hint.preset}';

register({hint.preset});</pre>
    {/if}
  {:else}
    <p>Register it via a preset or create a custom component.</p>
  {/if}
</div>

<style>
  .missing-component {
    border: 2px dashed hsl(0 84% 60%);
    background: hsl(0 84% 60% / 0.1);
    padding: 1rem;
    border-radius: 0.5rem;
    font-family: monospace;
    font-size: 0.875rem;
  }
  pre {
    background: hsl(0 0% 90%);
    padding: 0.5rem;
    border-radius: 0.25rem;
    margin-top: 0.5rem;
    white-space: pre-wrap;
  }
  p {
    margin: 0.5rem 0;
  }
</style>
