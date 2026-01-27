<script lang="ts">
  import type { SearchInputAtom } from '@daui/core';

  let {
    id,
    placeholder = 'Search...',
    value,
    onChange,
    onSearch,
  }: Omit<SearchInputAtom, 'atom'> = $props();

  let currentValue = $derived(typeof value === 'function' ? value() : (value ?? ''));
  let debounceTimer: ReturnType<typeof setTimeout>;

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    if (onChange) {
      onChange(target.value);
    }

    // Debounced search
    if (onSearch) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        onSearch(target.value);
      }, 300);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && onSearch) {
      clearTimeout(debounceTimer);
      onSearch((e.target as HTMLInputElement).value);
    }
  }

  function handleClear() {
    if (onChange) onChange('');
    if (onSearch) onSearch('');
  }
</script>

<div class="search-input-wrapper">
  <span class="search-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
  </span>
  <input
    type="search"
    {id}
    name={id}
    class="search-input"
    {placeholder}
    value={currentValue}
    oninput={handleInput}
    onkeydown={handleKeydown}
  />
  {#if currentValue}
    <button type="button" class="clear-button" onclick={handleClear} aria-label="Clear search">
      ✕
    </button>
  {/if}
</div>

<style>
  .search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
  }

  .search-icon {
    position: absolute;
    left: 0.75rem;
    color: hsl(var(--muted-foreground));
    pointer-events: none;
    display: flex;
    align-items: center;
  }

  .search-input {
    width: 100%;
    height: 2.5rem;
    padding: 0 2.5rem 0 2.5rem;
    font-size: 0.875rem;
    color: hsl(var(--foreground));
    background-color: hsl(var(--background));
    border: 1px solid hsl(var(--input));
    border-radius: calc(var(--radius) - 2px);
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .search-input::placeholder {
    color: hsl(var(--muted-foreground));
  }

  .search-input:focus {
    outline: none;
    border-color: hsl(var(--ring));
    box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
  }

  /* Hide default clear button in webkit */
  .search-input::-webkit-search-cancel-button {
    display: none;
  }

  .clear-button {
    position: absolute;
    right: 0.5rem;
    padding: 0.25rem;
    background: none;
    border: none;
    color: hsl(var(--muted-foreground));
    cursor: pointer;
    font-size: 0.75rem;
    line-height: 1;
    border-radius: 2px;
    transition: color 0.15s;
  }

  .clear-button:hover {
    color: hsl(var(--foreground));
  }
</style>
