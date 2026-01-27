<script lang="ts">
  import type { HeaderOrganism } from '@daui/core';
  import SectionRenderer from '../renderer/SectionRenderer.svelte';

  let { logo, title, nav, actions, sticky = false }: Omit<HeaderOrganism, 'organism'> = $props();
</script>

<header class="header" class:sticky>
  <div class="header-content">
    <div class="header-left">
      {#if logo}
        {#if logo.href}
          <a href={logo.href} class="header-logo">
            <img src={logo.src} alt={logo.alt} />
          </a>
        {:else}
          <img src={logo.src} alt={logo.alt} class="header-logo" />
        {/if}
      {/if}
      {#if title}
        <span class="header-title">{title}</span>
      {/if}
    </div>

    {#if nav && nav.length > 0}
      <nav class="header-nav">
        {#each nav as item}
          {#if item.href}
            <a
              href={item.href}
              class="nav-link"
              class:active={item.active?.()}
            >
              {item.label}
            </a>
          {:else if item.onClick}
            <button
              type="button"
              class="nav-link"
              class:active={item.active?.()}
              onclick={item.onClick}
            >
              {item.label}
            </button>
          {:else}
            <span class="nav-link">{item.label}</span>
          {/if}
        {/each}
      </nav>
    {/if}

    {#if actions && actions.length > 0}
      <div class="header-actions">
        {#each actions as action}
          <SectionRenderer section={action} />
        {/each}
      </div>
    {/if}
  </div>
</header>

<style>
  .header {
    background: hsl(var(--background));
    border-bottom: 1px solid hsl(var(--border));
  }

  .header.sticky {
    position: sticky;
    top: 0;
    z-index: 40;
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0.75rem 1.5rem;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .header-logo {
    display: block;
    height: 2rem;
    width: auto;
  }

  .header-logo img {
    height: 100%;
    width: auto;
  }

  .header-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: hsl(var(--foreground));
  }

  .header-nav {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(var(--muted-foreground));
    text-decoration: none;
    background: none;
    border: none;
    border-radius: calc(var(--radius) - 2px);
    cursor: pointer;
    transition: color 0.15s, background-color 0.15s;
  }

  .nav-link:hover {
    color: hsl(var(--foreground));
    background: hsl(var(--accent));
  }

  .nav-link.active {
    color: hsl(var(--foreground));
    background: hsl(var(--accent));
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .header-actions :global(.section-wrapper) {
    margin-bottom: 0;
  }
</style>
