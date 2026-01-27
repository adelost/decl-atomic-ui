<script lang="ts">
  import type { BreadcrumbsMolecule } from '@daui/core';

  let { items, separator = '/' }: Omit<BreadcrumbsMolecule, 'molecule'> = $props();
</script>

<nav aria-label="Breadcrumb" class="breadcrumbs">
  <ol class="breadcrumb-list">
    {#each items as item, i}
      <li class="breadcrumb-item">
        {#if i < items.length - 1}
          {#if item.href}
            <a href={item.href} class="breadcrumb-link">{item.label}</a>
          {:else if item.onClick}
            <button type="button" class="breadcrumb-button" onclick={item.onClick}>
              {item.label}
            </button>
          {:else}
            <span class="breadcrumb-text">{item.label}</span>
          {/if}
          <span class="breadcrumb-separator" aria-hidden="true">{separator}</span>
        {:else}
          <span class="breadcrumb-current" aria-current="page">{item.label}</span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>

<style>
  .breadcrumbs {
    font-size: 0.875rem;
  }

  .breadcrumb-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .breadcrumb-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .breadcrumb-link,
  .breadcrumb-button {
    color: hsl(var(--muted-foreground));
    text-decoration: none;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    transition: color 0.15s;
  }

  .breadcrumb-link:hover,
  .breadcrumb-button:hover {
    color: hsl(var(--foreground));
  }

  .breadcrumb-text {
    color: hsl(var(--muted-foreground));
  }

  .breadcrumb-separator {
    color: hsl(var(--muted-foreground));
    opacity: 0.5;
  }

  .breadcrumb-current {
    color: hsl(var(--foreground));
    font-weight: 500;
  }
</style>
