<script lang="ts">
  import type { ToastAtom } from '@daui/core';
  import { tv } from 'tailwind-variants';

  let {
    message,
    type = 'info',
    dismissible = true,
    onDismiss,
  }: Omit<ToastAtom, 'atom' | 'duration'> = $props();

  const toastVariants = tv({
    base: 'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm',
    variants: {
      type: {
        success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200',
        error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200',
        info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200',
      },
    },
    defaultVariants: {
      type: 'info',
    },
  });

  const icons: Record<string, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  function handleDismiss() {
    if (typeof onDismiss === 'function') {
      onDismiss();
    }
  }
</script>

<div class={toastVariants({ type })} role="alert">
  <span class="toast-icon">{icons[type ?? 'info']}</span>
  <span class="flex-1">{message}</span>
  {#if dismissible}
    <button
      type="button"
      class="toast-dismiss"
      onclick={handleDismiss}
      aria-label="Dismiss"
    >
      ✕
    </button>
  {/if}
</div>

<style>
  .toast-icon {
    font-size: 1rem;
    line-height: 1;
  }

  .toast-dismiss {
    opacity: 0.6;
    padding: 0.25rem;
    cursor: pointer;
    background: none;
    border: none;
    color: inherit;
    font-size: 0.75rem;
    line-height: 1;
    transition: opacity 0.15s;
  }

  .toast-dismiss:hover {
    opacity: 1;
  }
</style>
