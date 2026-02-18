<script lang="ts">
  import type { SearchSelectMolecule, SearchSelectOption } from '@daui/core';

  let {
    id,
    label,
    options: getOptions,
    placeholder = 'Search...',
    value,
    onChange,
    onSearch,
  }: SearchSelectMolecule = $props();

  // State
  let searchQuery = $state('');
  let isOpen = $state(false);
  let inputRef = $state<HTMLInputElement | null>(null);
  let highlightedIndex = $state(0);

  // Options loading (lazy - only on first open)
  let allOptions = $state<SearchSelectOption[]>([]);
  let optionsLoaded = $state(false);
  let loading = $state(false);

  // Current value from getter
  let currentValue = $derived(value?.() ?? '');

  // Selected option
  let selectedOption = $derived(allOptions.find((o) => o.value === currentValue) ?? null);

  // Filtered options
  let filteredOptions = $derived.by(() => {
    if (!searchQuery.trim()) return allOptions.slice(0, 10);
    const q = searchQuery.toLowerCase();
    return allOptions
      .filter((o) => o.label.toLowerCase().includes(q) || o.subtitle?.toLowerCase().includes(q))
      .slice(0, 10);
  });

  // Load options on first open (lazy loading)
  async function ensureOptionsLoaded() {
    if (optionsLoaded || loading) return;
    loading = true;
    try {
      const result = getOptions();
      allOptions = result instanceof Promise ? await result : result;
      optionsLoaded = true;
    } catch (e) {
      console.error('Failed to load options', e);
      allOptions = [];
    } finally {
      loading = false;
    }
  }

  function handleSelect(option: SearchSelectOption) {
    onChange?.(option.value);
    searchQuery = '';
    isOpen = false;
    highlightedIndex = 0;
  }

  function handleClear() {
    onChange?.('');
    searchQuery = '';
    isOpen = false;
    inputRef?.focus();
  }

  function handleInputFocus() {
    isOpen = true;
    ensureOptionsLoaded();
  }

  function handleInputBlur(_e: FocusEvent) {
    // Delay to allow click on option
    setTimeout(() => {
      if (!document.activeElement?.closest('.search-select')) {
        isOpen = false;
        searchQuery = '';
        highlightedIndex = 0;
      }
    }, 150);
  }

  function handleInput() {
    onSearch?.(searchQuery);
    highlightedIndex = 0;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      isOpen = false;
      searchQuery = '';
      highlightedIndex = 0;
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        isOpen = true;
        ensureOptionsLoaded();
      } else {
        highlightedIndex = Math.min(highlightedIndex + 1, filteredOptions.length - 1);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightedIndex = Math.max(highlightedIndex - 1, 0);
    } else if (e.key === 'Enter' && isOpen && filteredOptions[highlightedIndex]) {
      e.preventDefault();
      handleSelect(filteredOptions[highlightedIndex]);
    }
  }
</script>

<div class="search-select">
  {#if label}
    <label class="search-select-label" for={id}>{label}</label>
  {/if}

  <input type="hidden" name={id} value={currentValue} />

  {#if selectedOption && !isOpen}
    <!-- Selected state -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="selected-display"
      role="button"
      tabindex="0"
      onclick={() => {
        isOpen = true;
        ensureOptionsLoaded();
        inputRef?.focus();
      }}
      onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          isOpen = true;
          ensureOptionsLoaded();
          inputRef?.focus();
        }
      }}
    >
      <span class="selected-label">
        {selectedOption.label}
        {#if selectedOption.subtitle}
          <span class="selected-subtitle">{selectedOption.subtitle}</span>
        {/if}
      </span>
      <button
        type="button"
        class="clear-btn"
        onclick={(e) => {
          e.stopPropagation();
          handleClear();
        }}
        aria-label="Clear selection"
      >
        ✕
      </button>
    </div>
  {:else}
    <!-- Search state -->
    <div class="search-wrapper">
      <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
      <input
        bind:this={inputRef}
        type="text"
        {id}
        class="search-input"
        {placeholder}
        bind:value={searchQuery}
        onfocus={handleInputFocus}
        onblur={handleInputBlur}
        oninput={handleInput}
        onkeydown={handleKeydown}
        autocomplete="off"
      />
    </div>

    {#if isOpen}
      <div class="options-dropdown">
        {#if loading}
          <div class="options-status">Loading...</div>
        {:else if filteredOptions.length === 0}
          <div class="options-status">
            {searchQuery ? 'No results found' : 'No options'}
          </div>
        {:else}
          {#each filteredOptions as option, i (option.value)}
            <button
              type="button"
              class="option-item"
              class:highlighted={i === highlightedIndex}
              class:selected={option.value === currentValue}
              onclick={() => handleSelect(option)}
              onmouseenter={() => (highlightedIndex = i)}
            >
              <span class="option-label">{option.label}</span>
              {#if option.subtitle}
                <span class="option-subtitle">{option.subtitle}</span>
              {/if}
            </button>
          {/each}
        {/if}
      </div>
    {/if}
  {/if}
</div>

<style>
  .search-select {
    position: relative;
    width: 100%;
  }

  .search-select-label {
    display: block;
    margin-bottom: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  /* Search input */
  .search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    opacity: 0.5;
  }

  .search-input {
    width: 100%;
    padding: 0.625rem 0.875rem 0.625rem 2.25rem;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    color: #1f2937;
    font-size: 0.875rem;
    transition:
      border-color 0.15s,
      box-shadow 0.15s;
  }

  .search-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }

  .search-input::placeholder {
    color: #9ca3af;
  }

  /* Selected display */
  .selected-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.625rem 0.875rem;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    color: #1f2937;
    font-size: 0.875rem;
    cursor: pointer;
    transition: border-color 0.15s;
  }

  .selected-display:hover {
    border-color: #9ca3af;
  }

  .selected-display:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }

  .selected-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .selected-subtitle {
    color: #6b7280;
    font-size: 0.75rem;
  }

  .clear-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 0.25rem;
    color: #9ca3af;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .clear-btn:hover {
    background: #f3f4f6;
    color: #374151;
  }

  /* Options dropdown */
  .options-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 0.25rem;
    max-height: 15rem;
    overflow-y: auto;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 50;
  }

  .options-status {
    padding: 1rem;
    text-align: center;
    color: #6b7280;
    font-size: 0.875rem;
  }

  .option-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.625rem 0.875rem;
    background: transparent;
    border: none;
    color: #1f2937;
    font-size: 0.875rem;
    text-align: left;
    cursor: pointer;
    transition: background 0.1s;
  }

  .option-item:hover,
  .option-item.highlighted {
    background: #f3f4f6;
  }

  .option-item.selected {
    background: #eff6ff;
  }

  .option-label {
    font-weight: 500;
  }

  .option-subtitle {
    color: #6b7280;
    font-size: 0.75rem;
  }
</style>
