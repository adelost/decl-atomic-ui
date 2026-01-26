<script lang="ts">
  import type { Section, AsyncConfig } from '@daui/core';
  import { createAsyncResource } from './asyncHandler';
  import SectionRenderer from '../renderer/SectionRenderer.svelte';
  import type { Snippet } from 'svelte';
  import { untrack } from 'svelte';

  interface Props {
    /** Async resource configuration */
    async: string | AsyncConfig;
    /** Path to extract from response */
    path?: string;
    /** Field mapping */
    map?: Record<string, string>;
    /** Loading state UI */
    loading?: Section;
    /** Error state UI */
    error?: Section;
    /** Children snippet receives the fetched data */
    children?: Snippet<[unknown]>;
  }

  let {
    async: asyncConfig,
    path,
    map,
    loading,
    error,
    children,
  }: Props = $props();

  // Async resources are created once at mount and manage their own lifecycle
  // (polling, caching). Configuration is intentionally captured once.
  const resource = untrack(() =>
    createAsyncResource(asyncConfig, { $path: path, $map: map })
  );
</script>

{#if $resource.loading}
  {#if loading}
    <SectionRenderer section={loading} />
  {:else}
    <div class="async-loading">
      <div class="async-spinner"></div>
      <span>Loading...</span>
    </div>
  {/if}
{:else if $resource.error}
  {#if error}
    <SectionRenderer section={error} />
  {:else}
    <div class="async-error">
      <span class="error-icon">!</span>
      <span>{$resource.error}</span>
    </div>
  {/if}
{:else if children}
  {@render children($resource.data)}
{:else}
  <!-- No children provided, just render the data as JSON for debugging -->
  <pre class="async-data">{JSON.stringify($resource.data, null, 2)}</pre>
{/if}

<style>
  .async-loading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--muted-foreground, #666);
    padding: 1rem;
  }

  .async-spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .async-error {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--destructive, #ef4444);
    padding: 1rem;
    background: var(--destructive-foreground, #fef2f2);
    border-radius: 0.5rem;
  }

  .error-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: currentColor;
    color: white;
    font-size: 0.75rem;
    font-weight: bold;
  }

  .async-data {
    font-size: 0.75rem;
    background: var(--muted, #f5f5f5);
    padding: 0.5rem;
    border-radius: 0.25rem;
    overflow: auto;
    max-height: 200px;
  }
</style>
