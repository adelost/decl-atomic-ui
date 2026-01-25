<script lang="ts">
  import { AlertDialog } from 'bits-ui';

  interface Props {
    open: () => boolean;
    onOpenChange?: (open: boolean) => void;
    title: string;
    description: string;
    cancelLabel?: string;
    confirmLabel?: string;
    onCancel?: () => void;
    onConfirm?: () => void;
    variant?: 'default' | 'danger';
  }

  let {
    open,
    onOpenChange,
    title,
    description,
    cancelLabel = 'Cancel',
    confirmLabel = 'Confirm',
    onCancel,
    onConfirm,
    variant = 'default',
  }: Props = $props();

  let isOpen = $derived(open());

  function handleOpenChange(newOpen: boolean) {
    onOpenChange?.(newOpen);
  }

  function handleCancel() {
    onCancel?.();
    onOpenChange?.(false);
  }

  function handleConfirm() {
    onConfirm?.();
    onOpenChange?.(false);
  }
</script>

<AlertDialog.Root open={isOpen} onOpenChange={handleOpenChange}>
  <AlertDialog.Portal>
    <AlertDialog.Overlay class="alert-overlay" />
    <AlertDialog.Content class="alert-content">
      <AlertDialog.Title class="alert-title">{title}</AlertDialog.Title>
      <AlertDialog.Description class="alert-description">
        {description}
      </AlertDialog.Description>
      <div class="alert-footer">
        <AlertDialog.Cancel asChild>
          {#snippet child({ props }: { props: Record<string, unknown> })}
            <button {...props} class="alert-button alert-button-secondary" onclick={handleCancel}>
              {cancelLabel}
            </button>
          {/snippet}
        </AlertDialog.Cancel>
        <AlertDialog.Action asChild>
          {#snippet child({ props }: { props: Record<string, unknown> })}
            <button
              {...props}
              class="alert-button {variant === 'danger' ? 'alert-button-danger' : 'alert-button-primary'}"
              onclick={handleConfirm}
            >
              {confirmLabel}
            </button>
          {/snippet}
        </AlertDialog.Action>
      </div>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>

<style>
  :global(.alert-overlay) {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
  }

  :global(.alert-content) {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 50;
    width: 100%;
    max-width: 28rem;
    padding: 1.5rem;
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    animation: alert-in 0.15s ease-out;
  }

  :global(.alert-content:focus-visible) {
    outline: none;
  }

  :global(.alert-title) {
    margin: 0 0 0.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    color: #0f172a;
  }

  :global(.alert-description) {
    margin: 0 0 1.5rem;
    font-size: 0.875rem;
    color: #64748b;
    line-height: 1.5;
  }

  .alert-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }

  .alert-button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.15s;
    border: none;
  }

  .alert-button-secondary {
    background-color: hsl(var(--muted, 240 4.8% 95.9%));
    color: hsl(var(--foreground, 240 10% 3.9%));
  }

  .alert-button-secondary:hover {
    background-color: hsl(var(--muted, 240 4.8% 95.9%) / 0.8);
  }

  .alert-button-primary {
    background-color: hsl(var(--primary, 240 5.9% 10%));
    color: hsl(var(--primary-foreground, 0 0% 98%));
  }

  .alert-button-primary:hover {
    background-color: hsl(var(--primary, 240 5.9% 10%) / 0.9);
  }

  .alert-button-danger {
    background-color: hsl(var(--destructive, 0 84.2% 60.2%));
    color: hsl(var(--destructive-foreground, 0 0% 98%));
  }

  .alert-button-danger:hover {
    background-color: hsl(var(--destructive, 0 84.2% 60.2%) / 0.9);
  }

  @keyframes alert-in {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
</style>
