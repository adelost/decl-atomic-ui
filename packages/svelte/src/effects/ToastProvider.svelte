<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Toast from '../atoms/Toast.svelte';

  interface ToastItem {
    id: number;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    dismissible: boolean;
    leaving: boolean;
  }

  interface Props {
    /** Position of toast stack */
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
    /** Default duration in ms (0 = no auto-dismiss) */
    duration?: number;
    /** Maximum number of visible toasts */
    maxToasts?: number;
  }

  let {
    position = 'bottom-right',
    duration = 4000,
    maxToasts = 5,
  }: Props = $props();

  let toasts = $state<ToastItem[]>([]);
  let nextId = 0;

  function addToast(detail: { text: string; variant?: 'success' | 'error' | 'warning' | 'info' }) {
    const id = nextId++;
    const type = detail.variant ?? 'success';

    const toast: ToastItem = {
      id,
      message: detail.text,
      type,
      dismissible: true,
      leaving: false,
    };

    toasts = [...toasts.slice(-(maxToasts - 1)), toast];

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => dismissToast(id), duration);
    }
  }

  function dismissToast(id: number) {
    // Mark as leaving for animation
    toasts = toasts.map((t) => (t.id === id ? { ...t, leaving: true } : t));

    // Remove after animation
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
    }, 300);
  }

  function handleToastEvent(e: CustomEvent<{ text: string; variant?: 'success' | 'error' | 'warning' | 'info' }>) {
    addToast(e.detail);
  }

  onMount(() => {
    window.addEventListener('daui:toast', handleToastEvent as EventListener);
  });

  onDestroy(() => {
    window.removeEventListener('daui:toast', handleToastEvent as EventListener);
  });

  const positionClasses: Record<string, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };
</script>

{#if toasts.length > 0}
  <div class="toast-container fixed z-50 flex flex-col gap-2 {positionClasses[position]}">
    {#each toasts as toast (toast.id)}
      <div class="toast-wrapper" class:leaving={toast.leaving}>
        <Toast
          message={toast.message}
          type={toast.type}
          dismissible={toast.dismissible}
          onDismiss={() => dismissToast(toast.id)}
        />
      </div>
    {/each}
  </div>
{/if}

<style>
  .toast-wrapper {
    animation: slideIn 0.3s ease-out;
  }

  .toast-wrapper.leaving {
    animation: slideOut 0.3s ease-in forwards;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
</style>
