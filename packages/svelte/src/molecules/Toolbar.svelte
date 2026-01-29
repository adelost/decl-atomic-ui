<script lang="ts">
  import type { ToolbarMolecule, ToolbarItem } from '@daui/core';
  import { Toolbar, ToggleGroup } from 'bits-ui';
  import Icon from '../atoms/Icon.svelte';
  import Tooltip from '../atoms/Tooltip.svelte';

  let {
    id,
    orientation = 'horizontal',
    loop = true,
    items,
  }: ToolbarMolecule = $props();

  function isButton(item: ToolbarItem): item is Extract<ToolbarItem, { type: 'button' }> {
    return item.type === 'button';
  }

  function isToggleGroup(item: ToolbarItem): item is Extract<ToolbarItem, { type: 'toggle-group' }> {
    return item.type === 'toggle-group';
  }

  function isSeparator(item: ToolbarItem): item is Extract<ToolbarItem, { type: 'separator' }> {
    return item.type === 'separator';
  }

  function isLink(item: ToolbarItem): item is Extract<ToolbarItem, { type: 'link' }> {
    return item.type === 'link';
  }
</script>

<Toolbar.Root {id} {orientation} {loop} class="toolbar toolbar-{orientation}">
  {#each items as item, i}
    {#if isButton(item)}
      {#if item.tooltip}
        <Tooltip content={item.tooltip} side="bottom" delayDuration={300}>
          {#snippet children()}
            <Toolbar.Button
              class="toolbar-button"
              disabled={item.disabled}
              onclick={item.onClick}
              aria-label={item.label || item.tooltip}
            >
              {#if item.icon}
                <Icon name={item.icon} size="sm" />
              {/if}
              {#if item.label}
                <span class="toolbar-label">{item.label}</span>
              {/if}
            </Toolbar.Button>
          {/snippet}
        </Tooltip>
      {:else}
        <Toolbar.Button
          class="toolbar-button"
          disabled={item.disabled}
          onclick={item.onClick}
          aria-label={item.label}
        >
          {#if item.icon}
            <Icon name={item.icon} size="sm" />
          {/if}
          {#if item.label}
            <span class="toolbar-label">{item.label}</span>
          {/if}
        </Toolbar.Button>
      {/if}
    {:else if isToggleGroup(item)}
      {#if item.mode === 'single'}
        <Toolbar.Group type="single" class="toolbar-toggle-group">
          <ToggleGroup.Root
            id={item.id}
            type="single"
            value={item.value() as string}
            onValueChange={(v: string) => item.onChange(v)}
            class="toolbar-toggle-group-inner"
          >
            {#each item.items as toggleItem (toggleItem.value)}
              {#if toggleItem.tooltip}
                <Tooltip content={toggleItem.tooltip} side="bottom" delayDuration={300}>
                  {#snippet children()}
                    <ToggleGroup.Item
                      value={toggleItem.value}
                      class="toolbar-toggle-item"
                      aria-label={toggleItem.label || toggleItem.tooltip}
                    >
                      {#if toggleItem.icon}
                        <Icon name={toggleItem.icon} size="sm" />
                      {/if}
                      {#if toggleItem.label}
                        <span class="toolbar-label">{toggleItem.label}</span>
                      {/if}
                    </ToggleGroup.Item>
                  {/snippet}
                </Tooltip>
              {:else}
                <ToggleGroup.Item
                  value={toggleItem.value}
                  class="toolbar-toggle-item"
                  aria-label={toggleItem.label}
                >
                  {#if toggleItem.icon}
                    <Icon name={toggleItem.icon} size="sm" />
                  {/if}
                  {#if toggleItem.label}
                    <span class="toolbar-label">{toggleItem.label}</span>
                  {/if}
                </ToggleGroup.Item>
              {/if}
            {/each}
          </ToggleGroup.Root>
        </Toolbar.Group>
      {:else}
        <Toolbar.Group type="multiple" class="toolbar-toggle-group">
          <ToggleGroup.Root
            id={item.id}
            type="multiple"
            value={item.value() as string[]}
            onValueChange={(v: string[]) => item.onChange(v)}
            class="toolbar-toggle-group-inner"
          >
            {#each item.items as toggleItem (toggleItem.value)}
              {#if toggleItem.tooltip}
                <Tooltip content={toggleItem.tooltip} side="bottom" delayDuration={300}>
                  {#snippet children()}
                    <ToggleGroup.Item
                      value={toggleItem.value}
                      class="toolbar-toggle-item"
                      aria-label={toggleItem.label || toggleItem.tooltip}
                    >
                      {#if toggleItem.icon}
                        <Icon name={toggleItem.icon} size="sm" />
                      {/if}
                      {#if toggleItem.label}
                        <span class="toolbar-label">{toggleItem.label}</span>
                      {/if}
                    </ToggleGroup.Item>
                  {/snippet}
                </Tooltip>
              {:else}
                <ToggleGroup.Item
                  value={toggleItem.value}
                  class="toolbar-toggle-item"
                  aria-label={toggleItem.label}
                >
                  {#if toggleItem.icon}
                    <Icon name={toggleItem.icon} size="sm" />
                  {/if}
                  {#if toggleItem.label}
                    <span class="toolbar-label">{toggleItem.label}</span>
                  {/if}
                </ToggleGroup.Item>
              {/if}
            {/each}
          </ToggleGroup.Root>
        </Toolbar.Group>
      {/if}
    {:else if isSeparator(item)}
      <div class="toolbar-separator" role="separator"></div>
    {:else if isLink(item)}
      <Toolbar.Link href={item.href} class="toolbar-link">
        {#if item.icon}
          <Icon name={item.icon} size="sm" />
        {/if}
        {#if item.label}
          <span class="toolbar-label">{item.label}</span>
        {/if}
      </Toolbar.Link>
    {/if}
  {/each}
</Toolbar.Root>

<style>
  :global(.toolbar) {
    display: flex;
    align-items: center;
    padding: 0.25rem;
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    gap: 0.25rem;
  }

  :global(.toolbar-horizontal) {
    flex-direction: row;
  }

  :global(.toolbar-vertical) {
    flex-direction: column;
    width: fit-content;
  }

  :global(.toolbar-button),
  :global(.toolbar-link) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    height: 2rem;
    padding: 0 0.5rem;
    background-color: transparent;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    transition: all 0.15s;
    text-decoration: none;
  }

  :global(.toolbar-button:hover:not(:disabled)),
  :global(.toolbar-link:hover) {
    background-color: #f1f5f9;
    color: #0f172a;
  }

  :global(.toolbar-button:focus-visible),
  :global(.toolbar-link:focus-visible) {
    outline: 2px solid #0f172a;
    outline-offset: 2px;
  }

  :global(.toolbar-button:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global(.toolbar-toggle-group) {
    display: flex;
  }

  :global(.toolbar-toggle-group-inner) {
    display: flex;
    border-radius: 0.375rem;
    overflow: hidden;
    background-color: #f1f5f9;
  }

  :global(.toolbar-toggle-item) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    height: 2rem;
    padding: 0 0.5rem;
    background-color: transparent;
    border: none;
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    transition: all 0.15s;
  }

  :global(.toolbar-toggle-item:hover:not(:disabled)) {
    color: #0f172a;
  }

  :global(.toolbar-toggle-item:focus-visible) {
    outline: 2px solid #0f172a;
    outline-offset: -2px;
  }

  :global(.toolbar-toggle-item[data-state='on']) {
    background-color: white;
    color: #0f172a;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  :global(.toolbar-separator) {
    width: 1px;
    height: 1.5rem;
    background-color: #e2e8f0;
    margin: 0 0.25rem;
  }

  :global(.toolbar-vertical .toolbar-separator) {
    width: 100%;
    height: 1px;
    margin: 0.25rem 0;
  }

  .toolbar-label {
    white-space: nowrap;
  }
</style>
