<script lang="ts">
  import { Tabs } from 'bits-ui';
  import type { TabsMolecule } from '@daui/core';
  import SectionRenderer from '../renderer/SectionRenderer.svelte';
  import Icon from '../atoms/Icon.svelte';

  let { id, activeTab, onTabChange, tabs }: TabsMolecule = $props();

  let currentTab = $derived(activeTab?.() ?? tabs[0]?.id ?? '');

  function handleValueChange(newValue: string) {
    onTabChange?.(newValue);
  }
</script>

<div class="tabs-wrapper">
  <Tabs.Root {id} value={currentTab} onValueChange={handleValueChange} class="tabs">
    <Tabs.List class="tabs-list">
      {#each tabs as tab (tab.id)}
        <Tabs.Trigger
          value={tab.id}
          disabled={tab.disabled}
          class="tab-trigger"
        >
          {#if tab.icon}
            <Icon name={tab.icon} size="sm" />
          {/if}
          {tab.label}
        </Tabs.Trigger>
      {/each}
    </Tabs.List>

    {#each tabs as tab (tab.id)}
      <Tabs.Content value={tab.id} class="tab-content">
        {#each tab.content as section}
          <SectionRenderer {section} />
        {/each}
      </Tabs.Content>
    {/each}
  </Tabs.Root>
</div>

<style>
  .tabs-wrapper {
    display: contents;
  }

  :global(.tabs) {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  :global(.tabs-list) {
    display: flex;
    gap: 0;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 1.5rem;
  }

  :global(.tab-trigger) {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    color: #64748b;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }

  :global(.tab-trigger:hover:not([data-disabled])) {
    color: #0f172a;
  }

  :global(.tab-trigger[data-state='active']) {
    color: #0f172a;
    border-bottom-color: #0f172a;
  }

  :global(.tab-trigger[data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global(.tab-trigger:focus-visible) {
    outline: 2px solid #0f172a;
    outline-offset: -2px;
    border-radius: 0.25rem;
  }

  :global(.tab-content) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  :global(.tab-content:focus-visible) {
    outline: none;
  }
</style>
