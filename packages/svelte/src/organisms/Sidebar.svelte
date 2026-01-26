<script lang="ts">
  import type { SidebarOrganism } from '@daui/core';
  import { untrack } from 'svelte';

  let { items }: Omit<SidebarOrganism, 'organism'> = $props();

  // Track active route - initialized once from first item
  // (in a real app, this would come from a router)
  let activeRoute = $state(untrack(() => items[0]?.route ?? ''));

  function handleClick(route: string) {
    activeRoute = route;
    // In a real app, this would navigate
    window.dispatchEvent(new CustomEvent('daui:navigate', { detail: { route } }));
  }
</script>

<aside class="sidebar">
  <nav class="sidebar-nav">
    {#each items as item}
      <button
        type="button"
        class="sidebar-item"
        class:active={activeRoute === item.route}
        onclick={() => handleClick(item.route)}
      >
        {#if item.icon}
          <span class="sidebar-icon">{item.icon}</span>
        {/if}
        <span class="sidebar-label">{item.label}</span>
      </button>
    {/each}
  </nav>
</aside>

<style>
  .sidebar {
    display: flex;
    flex-direction: column;
    width: 240px;
    min-height: 100%;
    background: hsl(var(--card));
    border-right: 1px solid hsl(var(--border));
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    gap: 0.125rem;
  }

  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(var(--muted-foreground));
    text-align: left;
    background: none;
    border: none;
    border-radius: calc(var(--radius) - 2px);
    cursor: pointer;
    transition: color 0.15s, background-color 0.15s;
  }

  .sidebar-item:hover {
    color: hsl(var(--foreground));
    background: hsl(var(--accent));
  }

  .sidebar-item.active {
    color: hsl(var(--foreground));
    background: hsl(var(--accent));
  }

  .sidebar-icon {
    font-size: 1.125rem;
    line-height: 1;
    opacity: 0.8;
  }

  .sidebar-label {
    flex: 1;
  }
</style>
