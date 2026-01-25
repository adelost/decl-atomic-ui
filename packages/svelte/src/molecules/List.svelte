<script lang="ts">
  import type { ListMolecule, ListItem } from '@daui/core';
  import SectionRenderer from '../renderer/SectionRenderer.svelte';
  import { cn } from '@daui/core';

  let {
    id,
    items: getItems,
    onItemClick,
    emptyText = 'No items',
  }: ListMolecule<unknown> = $props();

  // Handle both sync and async items
  let resolvedItems = $state<ListItem<unknown>[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  $effect(() => {
    async function loadItems() {
      loading = true;
      error = null;
      try {
        const result = getItems();
        resolvedItems = result instanceof Promise ? await result : result;
      } catch (e) {
        error = e instanceof Error ? e.message : 'Failed to load items';
        resolvedItems = [];
      } finally {
        loading = false;
      }
    }
    loadItems();
  });

  function handleItemClick(item: ListItem<unknown>) {
    if (onItemClick && item.data !== undefined) {
      onItemClick(item.data);
    }
  }

  function handleKeydown(e: KeyboardEvent, item: ListItem<unknown>) {
    if ((e.key === 'Enter' || e.key === ' ') && onItemClick && item.data !== undefined) {
      e.preventDefault();
      onItemClick(item.data);
    }
  }
</script>

<ul class="flex flex-col m-0 p-0 list-none divide-y divide-border" {id}>
  {#if loading}
    <li class="p-8 text-center text-muted-foreground">Loading...</li>
  {:else if error}
    <li class="p-8 text-center text-destructive">{error}</li>
  {:else if resolvedItems.length === 0}
    <li class="p-8 text-center text-muted-foreground">{emptyText}</li>
  {:else}
    {#each resolvedItems as item (item.key)}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <li
        class={cn(
          'flex items-center gap-3 px-4 py-3 bg-background',
          onItemClick &&
            'cursor-pointer hover:bg-muted/50 transition-colors active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset'
        )}
        onclick={() => handleItemClick(item)}
        onkeydown={(e) => handleKeydown(e, item)}
        role={onItemClick ? 'button' : undefined}
        tabindex={onItemClick ? 0 : undefined}
      >
        {#if item.leading}
          <div class="shrink-0">
            <SectionRenderer section={item.leading} />
          </div>
        {/if}

        <div class="flex-1 min-w-0">
          <SectionRenderer section={item.content} />
        </div>

        {#if item.trailing}
          <div class="shrink-0">
            <SectionRenderer section={item.trailing} />
          </div>
        {/if}
      </li>
    {/each}
  {/if}
</ul>
