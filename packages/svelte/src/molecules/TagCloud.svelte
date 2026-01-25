<script lang="ts">
  import type { TagCloudMolecule } from '@daui/core';

  let {
    tags,
    onTagClick,
  }: Omit<TagCloudMolecule, 'molecule'> = $props();

  // Calculate font size based on count (scales from 0.75rem to 1.25rem)
  function getFontSize(count: number | undefined): string {
    if (!count) return '0.85rem';
    const maxCount = Math.max(...tags.map((t) => t.count || 1));
    const minCount = Math.min(...tags.map((t) => t.count || 1));

    if (maxCount === minCount) return '0.85rem';

    const normalized = (count - minCount) / (maxCount - minCount);
    const size = 0.75 + normalized * 0.5;
    return `${size}rem`;
  }

  function handleTagClick(label: string) {
    onTagClick?.(label);
  }

  function handleKeyDown(e: KeyboardEvent, label: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onTagClick?.(label);
    }
  }
</script>

<div class="tag-cloud">
  {#each tags as tag (tag.label)}
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <span
      class="tag"
      class:active={tag.active}
      class:clickable={!!onTagClick}
      style:font-size={getFontSize(tag.count)}
      style:--tag-color={tag.color || 'hsl(var(--muted))'}
      onclick={() => handleTagClick(tag.label)}
      onkeydown={(e) => handleKeyDown(e, tag.label)}
      role={onTagClick ? 'button' : undefined}
      tabindex={onTagClick ? 0 : undefined}
    >
      {tag.label}
      {#if tag.count !== undefined}
        <span class="tag-count">{tag.count}</span>
      {/if}
    </span>
  {/each}
</div>

<style>
  .tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    background-color: var(--tag-color);
    border-radius: 9999px;
    color: hsl(var(--foreground));
    transition: all 0.15s ease;
  }

  .tag.clickable {
    cursor: pointer;
  }

  .tag.clickable:hover {
    filter: brightness(0.9);
  }

  .tag.active {
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
  }

  .tag-count {
    font-size: 0.7em;
    padding: 1px 5px;
    background-color: rgba(0, 0, 0, 0.15);
    border-radius: 9999px;
    min-width: 18px;
    text-align: center;
  }
</style>
