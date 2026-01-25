<script lang="ts">
  // @ts-nocheck - Motion Canvas dev-only experimental file
  import { onMount } from 'svelte';

  let status = $state('Loading...');
  let error = $state<string | null>(null);

  onMount(async () => {
    try {
      // Try to import the project
      const project = await import('./animations/project');
      status = 'Project loaded!';
      console.log('Project:', project.default);

      // Try to create Player and Stage
      const { Player, Stage, Vector2 } = await import('@motion-canvas/core');
      status = 'Core loaded!';

      const stage = new Stage();
      stage.configure({
        size: new Vector2(400, 300),
        resolutionScale: 1,
      });
      status = 'Stage created!';

      const _player = new Player(project.default);
      status = 'Player created! Motion Canvas works! 🎉';
    } catch (e: any) {
      error = e.message;
      status = 'Error';
      console.error('Motion Canvas error:', e);
    }
  });
</script>

<div class="test-container">
  <h2>Motion Canvas Integration Test</h2>
  <p>Status: <strong>{status}</strong></p>
  {#if error}
    <pre class="error">{error}</pre>
  {/if}
</div>

<style>
  .test-container {
    padding: 2rem;
    background: #1a1a2e;
    color: white;
    border-radius: 8px;
    margin: 1rem;
  }
  .error {
    background: #ff6470;
    color: white;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
  }
</style>
