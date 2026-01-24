<script lang="ts">
  import type { TableOrganism, TableColumn, TableAction } from "../types";
  import SectionRenderer from "../renderer/SectionRenderer.svelte";

  type Row = Record<string, unknown>;

  let {
    id,
    data: getData,
    columns,
    onRowClick,
    searchable = false,
    searchKeys,
    searchPlaceholder = "Search...",
    emptyText = "No data",
    actions
  }: TableOrganism<Row> = $props();

  // Data loading
  let rows = $state<Row[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  // Search
  let searchQuery = $state("");

  // Sorting
  let sortField = $state<string | null>(null);
  let sortDirection = $state<"asc" | "desc">("asc");

  // Action loading states
  let actionLoading = $state<Record<string, boolean>>({});

  $effect(() => {
    async function loadData() {
      loading = true;
      error = null;
      try {
        const result = getData();
        rows = result instanceof Promise ? await result : result;
      } catch (e) {
        error = e instanceof Error ? e.message : "Failed to load data";
        rows = [];
      } finally {
        loading = false;
      }
    }
    loadData();
  });

  // Filtered and sorted rows
  let displayRows = $derived.by(() => {
    let result = [...rows];

    // Search filter
    if (searchable && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const keys = searchKeys ?? columns.map((c) => c.field);
      result = result.filter((row) =>
        keys.some((key) => {
          const value = row[key as string];
          return String(value ?? "").toLowerCase().includes(query);
        })
      );
    }

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        const aVal = a[sortField] ?? "";
        const bVal = b[sortField] ?? "";
        const cmp = String(aVal).localeCompare(String(bVal));
        return sortDirection === "asc" ? cmp : -cmp;
      });
    }

    return result;
  });

  function handleSort(column: TableColumn<Row>) {
    if (!column.sortable) return;
    if (sortField === column.field) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortField = column.field;
      sortDirection = "asc";
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

  function isActionVisible(action: TableAction<Row>, row: Row): boolean {
    return action.visible ? action.visible(row) : true;
  }
</script>

<div class="table-container" {id}>
  {#if searchable}
    <div class="table-search">
      <input
        type="text"
        placeholder={searchPlaceholder}
        bind:value={searchQuery}
        class="search-input"
      />
    </div>
  {/if}

  {#if loading}
    <div class="table-status">Loading...</div>
  {:else if error}
    <div class="table-status table-error">{error}</div>
  {:else if displayRows.length === 0}
    <div class="table-status">{emptyText}</div>
  {:else}
    <table class="table">
      <thead>
        <tr>
          {#each columns as column}
            <th
              style:width={column.width}
              class:sortable={column.sortable}
              onclick={() => handleSort(column)}
            >
              {column.header}
              {#if column.sortable && sortField === column.field}
                <span class="sort-icon">{sortDirection === "asc" ? "↑" : "↓"}</span>
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
            class:clickable={!!onRowClick}
            onclick={() => handleRowClick(row)}
            role={onRowClick ? "button" : undefined}
            tabindex={onRowClick ? 0 : undefined}
          >
            {#each columns as column}
              <td>
                {#if column.render}
                  <SectionRenderer section={column.render(row[column.field], row)} />
                {:else}
                  {row[column.field] ?? ""}
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
  {/if}
</div>

<style>
  .table-container {
    width: 100%;
    overflow-x: auto;
  }

  .table-search {
    margin-bottom: 1rem;
  }

  .search-input {
    width: 100%;
    max-width: 300px;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 0.875rem;
  }

  .search-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  .table-status {
    padding: 2rem;
    text-align: center;
    color: #6b7280;
  }

  .table-error {
    color: #dc2626;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  th, td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    background: #f9fafb;
    font-weight: 600;
    color: #374151;
  }

  th.sortable {
    cursor: pointer;
    user-select: none;
  }

  th.sortable:hover {
    background: #f3f4f6;
  }

  .sort-icon {
    margin-left: 0.25rem;
    font-size: 0.75rem;
  }

  tr.clickable {
    cursor: pointer;
  }

  tr.clickable:hover {
    background: #f9fafb;
  }

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
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.15s;
  }

  .action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .action-btn.variant-default {
    background: #f3f4f6;
    color: #374151;
  }
  .action-btn.variant-default:hover:not(:disabled) {
    background: #e5e7eb;
  }

  .action-btn.variant-danger {
    background: #fee2e2;
    color: #dc2626;
  }
  .action-btn.variant-danger:hover:not(:disabled) {
    background: #fecaca;
  }

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
</style>
