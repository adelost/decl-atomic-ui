<script lang="ts">
  import type { PageHeaderMolecule, Section } from '@daui/core';
  import SectionRenderer from '../renderer/SectionRenderer.svelte';

  let { title, subtitle, actions, badge }: PageHeaderMolecule = $props();

  // Handle reactive values
  let displayTitle = $derived(typeof title === 'function' ? title() : title);
  let displaySubtitle = $derived(
    subtitle ? (typeof subtitle === 'function' ? subtitle() : subtitle) : null
  );
</script>

<div class="page-header">
  <div class="page-header-content">
    <div class="page-header-titles">
      <div class="page-header-title-row">
        <h1 class="page-header-title">{displayTitle}</h1>
        {#if badge}
          <SectionRenderer section={badge} />
        {/if}
      </div>
      {#if displaySubtitle}
        <p class="page-header-subtitle">{displaySubtitle}</p>
      {/if}
    </div>
    {#if actions && actions.length > 0}
      <div class="page-header-actions">
        {#each actions as action}
          <SectionRenderer section={action} />
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .page-header {
    padding: 1rem 1.5rem;
  }

  .page-header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .page-header-titles {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .page-header-title-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .page-header-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: hsl(var(--foreground, 240 10% 3.9%));
    line-height: 1.2;
    letter-spacing: -0.025em;
  }

  .page-header-subtitle {
    margin: 0;
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground, 240 3.8% 46.1%));
  }

  .page-header-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }
</style>
