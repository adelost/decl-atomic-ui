<script lang="ts">
  import type { PaginationMolecule } from '@daui/core';

  let {
    currentPage,
    totalPages,
    onPageChange,
    showFirstLast = true,
    maxVisiblePages = 5,
  }: Omit<PaginationMolecule, 'molecule'> = $props();

  let current = $derived(currentPage());
  let total = $derived(totalPages());

  // Calculate visible page numbers
  let visiblePages = $derived(() => {
    const pages: number[] = [];
    const half = Math.floor(maxVisiblePages / 2);

    let start = Math.max(1, current - half);
    let end = Math.min(total, start + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  });

  function goToPage(page: number) {
    if (page >= 1 && page <= total && page !== current) {
      onPageChange(page);
    }
  }
</script>

<nav class="pagination" aria-label="Pagination">
  <div class="pagination-content">
    {#if showFirstLast}
      <button
        type="button"
        class="pagination-button"
        disabled={current === 1}
        onclick={() => goToPage(1)}
        aria-label="First page"
      >
        ««
      </button>
    {/if}

    <button
      type="button"
      class="pagination-button"
      disabled={current === 1}
      onclick={() => goToPage(current - 1)}
      aria-label="Previous page"
    >
      ‹
    </button>

    {#each visiblePages() as page}
      <button
        type="button"
        class="pagination-button"
        class:active={page === current}
        onclick={() => goToPage(page)}
        aria-label="Page {page}"
        aria-current={page === current ? 'page' : undefined}
      >
        {page}
      </button>
    {/each}

    <button
      type="button"
      class="pagination-button"
      disabled={current === total}
      onclick={() => goToPage(current + 1)}
      aria-label="Next page"
    >
      ›
    </button>

    {#if showFirstLast}
      <button
        type="button"
        class="pagination-button"
        disabled={current === total}
        onclick={() => goToPage(total)}
        aria-label="Last page"
      >
        »»
      </button>
    {/if}
  </div>

  <div class="pagination-info">
    Page {current} of {total}
  </div>
</nav>

<style>
  .pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .pagination-content {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .pagination-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    height: 2rem;
    padding: 0 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(var(--muted-foreground));
    background: transparent;
    border: 1px solid hsl(var(--border));
    border-radius: calc(var(--radius) - 2px);
    cursor: pointer;
    transition: all 0.15s;
  }

  .pagination-button:hover:not(:disabled) {
    color: hsl(var(--foreground));
    background: hsl(var(--accent));
    border-color: hsl(var(--accent));
  }

  .pagination-button.active {
    color: hsl(var(--primary-foreground));
    background: hsl(var(--primary));
    border-color: hsl(var(--primary));
  }

  .pagination-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pagination-info {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }
</style>
