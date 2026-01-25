<script lang="ts">
  import type { TableOrganism, TableColumn, TableAction, BulkAction } from '@daui/core';
  import SectionRenderer from '../renderer/SectionRenderer.svelte';

  type Row = Record<string, unknown>;

  let {
    id,
    data: getData,
    columns,
    onRowClick,
    // Search
    searchable = false,
    searchKeys,
    searchPlaceholder = 'Search...',
    showSearchCount,
    // Pagination
    paginated = false,
    pageSize: initialPageSize = 10,
    pageSizeOptions = [10, 25, 50, 100],
    // Selection
    selectable = false,
    selectedRows: getSelectedRows,
    onSelectionChange,
    bulkActions,
    // Styling
    rowClass,
    emptyText = 'No data',
    searchEmptyText = 'No results found',
    actions,
  }: TableOrganism<Row> = $props();

  // Data loading
  let rows = $state<Row[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  // Search
  let searchQuery = $state('');

  // Sorting
  let sortField = $state<string | null>(null);
  let sortDirection = $state<'asc' | 'desc'>('asc');

  // Pagination
  let currentPage = $state(1);
  // Note: initialPageSize is intentionally captured once at mount
  let pageSize = $state((() => initialPageSize)());

  // Selection
  let internalSelectedRows = $state<Row[]>([]);
  let selectedRows = $derived(getSelectedRows ? getSelectedRows() : internalSelectedRows);

  // Action loading states
  let actionLoading = $state<Record<string, boolean>>({});
  let bulkActionLoading = $state<Record<string, boolean>>({});

  $effect(() => {
    async function loadData() {
      loading = true;
      error = null;
      try {
        const result = getData();
        rows = result instanceof Promise ? await result : result;
      } catch (e) {
        error = e instanceof Error ? e.message : 'Failed to load data';
        rows = [];
      } finally {
        loading = false;
      }
    }
    loadData();
  });

  // Reset to page 1 when search or pageSize changes
  $effect(() => {
    searchQuery;
    pageSize;
    currentPage = 1;
  });

  // Filtered and sorted rows
  let filteredRows = $derived.by(() => {
    let result = [...rows];

    // Search filter
    if (searchable && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const keys = searchKeys ?? columns.map((c) => c.field);
      result = result.filter((row) =>
        keys.some((key) => {
          const value = row[key as string];
          return String(value ?? '')
            .toLowerCase()
            .includes(query);
        })
      );
    }

    // Sort
    if (sortField) {
      const field = sortField; // Capture for closure
      result.sort((a, b) => {
        const aVal = a[field] ?? '';
        const bVal = b[field] ?? '';
        const cmp = String(aVal).localeCompare(String(bVal));
        return sortDirection === 'asc' ? cmp : -cmp;
      });
    }

    return result;
  });

  // Paginated rows
  let displayRows = $derived.by(() => {
    if (!paginated) return filteredRows;
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  });

  // Pagination info
  let totalPages = $derived(paginated ? Math.ceil(filteredRows.length / pageSize) : 1);
  let startIndex = $derived((currentPage - 1) * pageSize + 1);
  let endIndex = $derived(Math.min(currentPage * pageSize, filteredRows.length));

  // Selection helpers
  let allSelected = $derived(
    selectable && displayRows.length > 0 && displayRows.every((row) => isRowSelected(row))
  );
  let someSelected = $derived(
    selectable && displayRows.some((row) => isRowSelected(row)) && !allSelected
  );

  function isRowSelected(row: Row): boolean {
    return selectedRows.some((r) => r === row || JSON.stringify(r) === JSON.stringify(row));
  }

  function toggleRowSelection(row: Row) {
    if (!selectable) return;
    let newSelection: Row[];
    if (isRowSelected(row)) {
      newSelection = selectedRows.filter(
        (r) => r !== row && JSON.stringify(r) !== JSON.stringify(row)
      );
    } else {
      newSelection = [...selectedRows, row];
    }
    if (onSelectionChange) {
      onSelectionChange(newSelection);
    } else {
      internalSelectedRows = newSelection;
    }
  }

  function toggleAllSelection() {
    if (!selectable) return;
    let newSelection: Row[];
    if (allSelected) {
      // Deselect all displayed rows
      newSelection = selectedRows.filter((r) => !displayRows.includes(r));
    } else {
      // Select all displayed rows (merge with existing)
      const currentSet = new Set(selectedRows.map((r) => JSON.stringify(r)));
      newSelection = [...selectedRows];
      for (const row of displayRows) {
        if (!currentSet.has(JSON.stringify(row))) {
          newSelection.push(row);
        }
      }
    }
    if (onSelectionChange) {
      onSelectionChange(newSelection);
    } else {
      internalSelectedRows = newSelection;
    }
  }

  function clearSelection() {
    if (onSelectionChange) {
      onSelectionChange([]);
    } else {
      internalSelectedRows = [];
    }
  }

  function handleSort(column: TableColumn<Row>) {
    if (!column.sortable) return;
    if (sortField === column.field) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = column.field;
      sortDirection = 'asc';
    }
  }

  function handleRowClick(row: Row) {
    onRowClick?.(row);
  }

  async function handleAction(action: TableAction<Row>, row: Row, rowIndex: number) {
    const key = `${rowIndex}-${action.label}`;
    if (actionLoading[key]) return;

    const result = action.onClick(row);
    if (result instanceof Promise) {
      actionLoading[key] = true;
      try {
        await result;
      } finally {
        actionLoading[key] = false;
      }
    }
  }

  async function handleBulkAction(action: BulkAction<Row>) {
    if (bulkActionLoading[action.label]) return;

    const result = action.onClick(selectedRows);
    if (result instanceof Promise) {
      bulkActionLoading[action.label] = true;
      try {
        await result;
        clearSelection();
      } finally {
        bulkActionLoading[action.label] = false;
      }
    } else {
      clearSelection();
    }
  }

  function isActionVisible(action: TableAction<Row>, row: Row): boolean {
    return action.visible ? action.visible(row) : true;
  }

  function getRowClasses(row: Row): string {
    const classes: string[] = [];
    if (onRowClick) classes.push('clickable');
    if (rowClass) {
      const custom = rowClass(row);
      if (custom) classes.push(custom);
    }
    if (selectable && isRowSelected(row)) classes.push('selected');
    return classes.join(' ');
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

  function getAlignClass(align?: 'left' | 'center' | 'right'): string {
    if (align === 'center') return 'text-center';
    if (align === 'right') return 'text-right';
    return '';
  }

  // Show search count by default when searchable, unless explicitly disabled
  const displaySearchCount = $derived(showSearchCount ?? searchable);
</script>

<div class="table-container" {id}>
  <!-- Toolbar: Search + Bulk Actions -->
  {#if searchable || (selectable && selectedRows.length > 0)}
    <div class="table-toolbar">
      {#if searchable}
        <div class="search-wrapper">
          <input
            type="text"
            placeholder={searchPlaceholder}
            bind:value={searchQuery}
            class="search-input"
          />
          {#if displaySearchCount && searchQuery.trim()}
            <span class="search-count">{filteredRows.length} of {rows.length}</span>
          {/if}
        </div>
      {/if}

      {#if selectable && selectedRows.length > 0}
        <div class="bulk-actions">
          <span class="selection-count">{selectedRows.length} selected</span>
          {#if bulkActions}
            {#each bulkActions as action}
              <button
                class="bulk-btn variant-{action.variant ?? 'default'}"
                disabled={bulkActionLoading[action.label]}
                onclick={() => handleBulkAction(action)}
              >
                {#if bulkActionLoading[action.label]}
                  <span class="spinner"></span>
                {:else if action.icon}
                  {action.icon}
                {/if}
                {action.label}
              </button>
            {/each}
          {/if}
          <button class="bulk-btn variant-ghost" onclick={clearSelection}>Clear</button>
        </div>
      {/if}
    </div>
  {/if}

  {#if loading}
    <div class="table-status">Loading...</div>
  {:else if error}
    <div class="table-status table-error">{error}</div>
  {:else if displayRows.length === 0}
    <div class="table-status">{searchQuery.trim() ? searchEmptyText : emptyText}</div>
  {:else}
    <div class="table-scroll">
      <table class="table">
        <thead>
          <tr>
            {#if selectable}
              <th class="checkbox-cell">
                <input
                  type="checkbox"
                  checked={allSelected}
                  indeterminate={someSelected}
                  onchange={toggleAllSelection}
                />
              </th>
            {/if}
            {#each columns as column}
              <th
                style:width={column.width}
                class="{column.sortable ? 'sortable' : ''} {getAlignClass(column.align)}"
                onclick={() => handleSort(column)}
              >
                {column.header}
                {#if column.sortable && sortField === column.field}
                  <span class="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </th>
            {/each}
            {#if actions?.length}
              <th class="actions-header">Actions</th>
            {/if}
          </tr>
        </thead>
        <tbody>
          {#each displayRows as row, rowIndex}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <tr
              class={getRowClasses(row)}
              onclick={() => handleRowClick(row)}
              role={onRowClick ? 'button' : undefined}
              tabindex={onRowClick ? 0 : undefined}
            >
              {#if selectable}
                <td class="checkbox-cell" onclick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isRowSelected(row)}
                    onchange={() => toggleRowSelection(row)}
                  />
                </td>
              {/if}
              {#each columns as column}
                <td class={getAlignClass(column.align)}>
                  {#if column.render}
                    <SectionRenderer section={column.render(row[column.field], row)} />
                  {:else}
                    {row[column.field] ?? ''}
                  {/if}
                </td>
              {/each}
              {#if actions?.length}
                <td class="actions-cell">
                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div class="actions" onclick={(e) => e.stopPropagation()}>
                    {#each actions as action}
                      {#if isActionVisible(action, row)}
                        <button
                          class="action-btn variant-{action.variant ?? 'default'}"
                          title={action.label}
                          aria-label={action.label}
                          disabled={actionLoading[`${rowIndex}-${action.label}`]}
                          onclick={() => handleAction(action, row, rowIndex)}
                        >
                          {#if actionLoading[`${rowIndex}-${action.label}`]}
                            <span class="spinner"></span>
                          {:else}
                            {action.icon}
                          {/if}
                        </button>
                      {/if}
                    {/each}
                  </div>
                </td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  <!-- Pagination -->
  {#if paginated && filteredRows.length > 0}
    <div class="table-pagination">
      <div class="pagination-info">
        Showing {startIndex} to {endIndex} of {filteredRows.length}
      </div>

      <div class="pagination-controls">
        <select bind:value={pageSize} class="page-size-select">
          {#each pageSizeOptions as size}
            <option value={size}>{size} per page</option>
          {/each}
        </select>

        <div class="pagination-buttons">
          <button
            class="page-btn"
            disabled={currentPage === 1}
            onclick={() => goToPage(1)}
            aria-label="First page"
          >
            ««
          </button>
          <button
            class="page-btn"
            disabled={currentPage === 1}
            onclick={() => goToPage(currentPage - 1)}
            aria-label="Previous page"
          >
            «
          </button>
          <span class="page-indicator">
            Page {currentPage} of {totalPages}
          </span>
          <button
            class="page-btn"
            disabled={currentPage === totalPages}
            onclick={() => goToPage(currentPage + 1)}
            aria-label="Next page"
          >
            »
          </button>
          <button
            class="page-btn"
            disabled={currentPage === totalPages}
            onclick={() => goToPage(totalPages)}
            aria-label="Last page"
          >
            »»
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .table-container {
    width: 100%;
  }

  /* Toolbar */
  .table-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 0;
    margin-bottom: 0.5rem;
  }

  .search-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .search-input {
    width: 100%;
    max-width: 300px;
    padding: 0.5rem 0.75rem;
    border: 1px solid hsl(var(--border, 220 13% 91%));
    border-radius: 0.375rem;
    font-size: 0.875rem;
    background: hsl(var(--background, 0 0% 100%));
    color: hsl(var(--foreground, 222 47% 11%));
  }

  .search-input:focus {
    outline: none;
    border-color: hsl(var(--primary, 220 90% 56%));
    box-shadow: 0 0 0 2px hsl(var(--primary, 220 90% 56%) / 0.2);
  }

  .search-count {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground, 220 9% 46%));
    white-space: nowrap;
  }

  /* Bulk Actions */
  .bulk-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .selection-count {
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(var(--primary, 220 90% 56%));
  }

  .bulk-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.375rem 0.75rem;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
  }

  .bulk-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .bulk-btn.variant-default {
    background: hsl(var(--primary, 220 90% 56%));
    color: white;
  }

  .bulk-btn.variant-default:hover:not(:disabled) {
    background: hsl(var(--primary, 220 90% 56%) / 0.9);
  }

  .bulk-btn.variant-danger {
    background: hsl(var(--destructive, 0 84% 60%));
    color: white;
  }

  .bulk-btn.variant-danger:hover:not(:disabled) {
    background: hsl(var(--destructive, 0 84% 60%) / 0.9);
  }

  .bulk-btn.variant-ghost {
    background: transparent;
    color: hsl(var(--muted-foreground, 220 9% 46%));
  }

  .bulk-btn.variant-ghost:hover:not(:disabled) {
    background: hsl(var(--muted, 220 14% 96%));
  }

  /* Table */
  .table-scroll {
    overflow-x: auto;
  }

  .table-status {
    padding: 2rem;
    text-align: center;
    color: hsl(var(--muted-foreground, 220 9% 46%));
  }

  .table-error {
    color: hsl(var(--destructive, 0 84% 60%));
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  th,
  td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid hsl(var(--border, 220 13% 91%));
  }

  th {
    background: hsl(var(--muted, 220 14% 96%));
    font-weight: 600;
    color: hsl(var(--foreground, 222 47% 11%));
  }

  th.sortable {
    cursor: pointer;
    user-select: none;
  }

  th.sortable:hover {
    background: hsl(var(--muted, 220 14% 96%) / 0.8);
  }

  .sort-icon {
    margin-left: 0.25rem;
    font-size: 0.75rem;
  }

  /* Alignment */
  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  /* Row states */
  tr.clickable {
    cursor: pointer;
  }

  tr.clickable:hover {
    background: hsl(var(--muted, 220 14% 96%) / 0.5);
  }

  tr.selected {
    background: hsl(var(--primary, 220 90% 56%) / 0.1);
  }

  tr.selected:hover {
    background: hsl(var(--primary, 220 90% 56%) / 0.15);
  }

  /* Row class styling */
  tr :global(.inactive) {
    opacity: 0.5;
  }

  /* Checkbox */
  .checkbox-cell {
    width: 2.5rem;
    padding: 0.5rem 0.75rem;
  }

  .checkbox-cell input[type='checkbox'] {
    width: 1rem;
    height: 1rem;
    cursor: pointer;
    accent-color: hsl(var(--primary, 220 90% 56%));
  }

  /* Actions */
  .actions-header {
    width: 1%;
    white-space: nowrap;
  }

  .actions-cell {
    width: 1%;
    white-space: nowrap;
  }

  .actions {
    display: flex;
    gap: 0.25rem;
  }

  .action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    padding: 0;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.15s;
  }

  .action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .action-btn.variant-default {
    background: hsl(var(--muted, 220 14% 96%));
    color: hsl(var(--foreground, 222 47% 11%));
  }
  .action-btn.variant-default:hover:not(:disabled) {
    background: hsl(var(--muted, 220 14% 96%) / 0.8);
  }

  .action-btn.variant-danger {
    background: hsl(var(--destructive, 0 84% 60%) / 0.1);
    color: hsl(var(--destructive, 0 84% 60%));
  }
  .action-btn.variant-danger:hover:not(:disabled) {
    background: hsl(var(--destructive, 0 84% 60%) / 0.2);
  }

  /* Spinner */
  .spinner {
    width: 0.875rem;
    height: 0.875rem;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Pagination */
  .table-pagination {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 0;
    margin-top: 0.5rem;
    border-top: 1px solid hsl(var(--border, 220 13% 91%));
  }

  .pagination-info {
    font-size: 0.8125rem;
    color: hsl(var(--muted-foreground, 220 9% 46%));
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .page-size-select {
    padding: 0.375rem 0.5rem;
    border: 1px solid hsl(var(--border, 220 13% 91%));
    border-radius: 0.375rem;
    font-size: 0.8125rem;
    background: hsl(var(--background, 0 0% 100%));
    color: hsl(var(--foreground, 222 47% 11%));
    cursor: pointer;
  }

  .pagination-buttons {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .page-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    border: 1px solid hsl(var(--border, 220 13% 91%));
    border-radius: 0.375rem;
    background: hsl(var(--background, 0 0% 100%));
    color: hsl(var(--foreground, 222 47% 11%));
    font-size: 0.8125rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .page-btn:hover:not(:disabled) {
    background: hsl(var(--muted, 220 14% 96%));
  }

  .page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .page-indicator {
    font-size: 0.8125rem;
    color: hsl(var(--muted-foreground, 220 9% 46%));
    padding: 0 0.5rem;
  }
</style>
