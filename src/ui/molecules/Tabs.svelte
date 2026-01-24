<script lang="ts">
  import type { TabsMolecule } from "../types";
  import SectionRenderer from "../renderer/SectionRenderer.svelte";

  let {
    id,
    activeTab,
    onTabChange,
    tabs
  }: TabsMolecule = $props();

  // Use first tab as default if no activeTab provided
  let currentTab = $derived(activeTab?.() ?? tabs[0]?.id ?? "");

  function handleTabClick(tabId: string) {
    if (onTabChange) {
      onTabChange(tabId);
    }
  }

  function handleKeydown(e: KeyboardEvent, tabId: string, index: number) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (index + 1) % tabs.length;
      const nextTab = tabs[nextIndex];
      if (!nextTab.disabled) {
        onTabChange?.(nextTab.id);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (index - 1 + tabs.length) % tabs.length;
      const prevTab = tabs[prevIndex];
      if (!prevTab.disabled) {
        onTabChange?.(prevTab.id);
      }
    }
  }

  let activeTabContent = $derived(
    tabs.find(t => t.id === currentTab)?.content ?? []
  );
</script>

<div class="tabs" {id}>
  <div class="tabs-list" role="tablist">
    {#each tabs as tab, i (tab.id)}
      <button
        type="button"
        role="tab"
        id="{id}-tab-{tab.id}"
        aria-selected={currentTab === tab.id}
        aria-controls="{id}-panel-{tab.id}"
        tabindex={currentTab === tab.id ? 0 : -1}
        class="tab-trigger"
        class:active={currentTab === tab.id}
        class:disabled={tab.disabled}
        disabled={tab.disabled}
        onclick={() => handleTabClick(tab.id)}
        onkeydown={(e) => handleKeydown(e, tab.id, i)}
      >
        {#if tab.icon}
          <span class="tab-icon">{tab.icon}</span>
        {/if}
        {tab.label}
      </button>
    {/each}
  </div>

  <div
    class="tab-content"
    role="tabpanel"
    id="{id}-panel-{currentTab}"
    aria-labelledby="{id}-tab-{currentTab}"
  >
    {#each activeTabContent as section}
      <SectionRenderer {section} />
    {/each}
  </div>
</div>

<style>
  .tabs {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .tabs-list {
    display: flex;
    gap: 0;
    border-bottom: 1px solid hsl(var(--border, 240 5.9% 90%));
    margin-bottom: 1.5rem;
  }

  .tab-trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    color: hsl(var(--muted-foreground, 240 3.8% 46.1%));
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }

  .tab-trigger:hover:not(.disabled) {
    color: hsl(var(--foreground, 240 10% 3.9%));
  }

  .tab-trigger.active {
    color: hsl(var(--foreground, 240 10% 3.9%));
    border-bottom-color: hsl(var(--primary, 240 5.9% 10%));
  }

  .tab-trigger.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .tab-trigger:focus-visible {
    outline: 2px solid hsl(var(--ring, 240 5.9% 10%));
    outline-offset: -2px;
    border-radius: 0.25rem;
  }

  .tab-icon {
    font-size: 1rem;
  }

  .tab-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
