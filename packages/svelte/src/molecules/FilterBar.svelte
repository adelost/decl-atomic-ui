<script lang="ts">
  import type { FilterBarMolecule, SelectOption } from '@daui/core';
  import { untrack } from 'svelte';

  let { search, filters }: FilterBarMolecule = $props();

  // Handle search state
  let searchValue = $state(untrack(() => search?.value?.() ?? ''));

  $effect(() => {
    if (search?.value) {
      searchValue = search.value();
    }
  });

  function handleSearch(e: Event) {
    const target = e.target as HTMLInputElement;
    searchValue = target.value;
    search?.onChange?.(searchValue);
  }

  // Resolve options (handle both static and dynamic)
  function getOptions(options: SelectOption[] | (() => SelectOption[])): SelectOption[] {
    return typeof options === 'function' ? options() : options;
  }
</script>

<div class="filter-bar">
  {#if search}
    <div class="filter-bar-search">
      <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
      </svg>
      <input
        type="text"
        id={search.id ?? 'filter-search'}
        placeholder={search.placeholder ?? 'Search...'}
        value={searchValue}
        oninput={handleSearch}
        class="search-input"
      />
    </div>
  {/if}

  {#if filters && filters.length > 0}
    {#each filters as filter}
      <div class="filter-select-wrapper">
        {#if filter.label}
          <label for={filter.id} class="filter-label">{filter.label}</label>
        {/if}
        <select
          id={filter.id}
          class="filter-select"
          value={filter.value()}
          onchange={(e) => filter.onChange((e.target as HTMLSelectElement).value)}
        >
          {#each getOptions(filter.options) as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>
    {/each}
  {/if}
</div>

<style>
  .filter-bar {
    display: flex;
    align-items: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    flex-wrap: wrap;
  }

  .filter-bar-search {
    position: relative;
    flex: 1;
    min-width: 200px;
  }

  .search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: hsl(var(--muted-foreground, 240 3.8% 46.1%));
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    height: 2.5rem;
    padding: 0 0.75rem 0 2.5rem;
    border: 1px solid hsl(var(--border, 240 5.9% 90%));
    border-radius: 0.375rem;
    background: hsl(var(--background, 0 0% 100%));
    color: hsl(var(--foreground, 240 10% 3.9%));
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .search-input::placeholder {
    color: hsl(var(--muted-foreground, 240 3.8% 46.1%));
  }

  .search-input:focus {
    border-color: hsl(var(--ring, 240 5.9% 10%));
    box-shadow: 0 0 0 2px hsl(var(--ring, 240 5.9% 10%) / 0.2);
  }

  .filter-select-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .filter-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: hsl(var(--muted-foreground, 240 3.8% 46.1%));
  }

  .filter-select {
    height: 2.5rem;
    min-width: 140px;
    padding: 0 2rem 0 0.75rem;
    border: 1px solid hsl(var(--border, 240 5.9% 90%));
    border-radius: 0.375rem;
    background: hsl(var(--background, 0 0% 100%));
    color: hsl(var(--foreground, 240 10% 3.9%));
    font-size: 0.875rem;
    cursor: pointer;
    outline: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .filter-select:focus {
    border-color: hsl(var(--ring, 240 5.9% 10%));
    box-shadow: 0 0 0 2px hsl(var(--ring, 240 5.9% 10%) / 0.2);
  }
</style>
