<script lang="ts">
  import type { ModalOrganism } from "../types";
  import SectionRenderer from "../renderer/SectionRenderer.svelte";

  let {
    id,
    title,
    open,
    onClose,
    size = "md",
    closeOnBackdrop = true,
    closeOnEscape = true,
    content,
    footer
  }: ModalOrganism = $props();

  let isOpen = $derived(open());
  let dialogRef = $state<HTMLDialogElement | null>(null);

  // Sync dialog with open state
  $effect(() => {
    if (!dialogRef) return;

    if (isOpen && !dialogRef.open) {
      dialogRef.showModal();
    } else if (!isOpen && dialogRef.open) {
      dialogRef.close();
    }
  });

  function handleBackdropClick(e: MouseEvent) {
    if (closeOnBackdrop && e.target === dialogRef) {
      onClose();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (closeOnEscape && e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  }

  function handleClose() {
    onClose();
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
  bind:this={dialogRef}
  {id}
  class="modal size-{size}"
  onclick={handleBackdropClick}
  onkeydown={handleKeydown}
  onclose={handleClose}
>
  <div class="modal-container">
    <div class="modal-header">
      <h2 class="modal-title">{title}</h2>
      <button
        type="button"
        class="modal-close"
        onclick={onClose}
        aria-label="Close"
      >
        ✕
      </button>
    </div>

    <div class="modal-content">
      {#each content as section}
        <SectionRenderer {section} />
      {/each}
    </div>

    {#if footer && footer.length > 0}
      <div class="modal-footer">
        {#each footer as section}
          <SectionRenderer {section} />
        {/each}
      </div>
    {/if}
  </div>
</dialog>

<style>
  .modal {
    position: fixed;
    padding: 0;
    border: none;
    border-radius: 0.75rem;
    background: hsl(var(--background, 0 0% 100%));
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    max-height: 85vh;
    overflow: hidden;
  }

  .modal::backdrop {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
  }

  /* Sizes */
  .modal.size-sm { width: 24rem; max-width: 90vw; }
  .modal.size-md { width: 32rem; max-width: 90vw; }
  .modal.size-lg { width: 48rem; max-width: 90vw; }
  .modal.size-fullscreen {
    width: 95vw;
    height: 90vh;
    max-width: none;
    max-height: none;
  }

  .modal-container {
    display: flex;
    flex-direction: column;
    max-height: 85vh;
  }

  .modal.size-fullscreen .modal-container {
    height: 90vh;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid hsl(var(--border, 240 5.9% 90%));
    flex-shrink: 0;
  }

  .modal-title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: hsl(var(--foreground, 240 10% 3.9%));
  }

  .modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 0.375rem;
    color: hsl(var(--muted-foreground, 240 3.8% 46.1%));
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .modal-close:hover {
    background: hsl(var(--muted, 240 4.8% 95.9%));
    color: hsl(var(--foreground, 240 10% 3.9%));
  }

  .modal-content {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid hsl(var(--border, 240 5.9% 90%));
    background: hsl(var(--muted, 240 4.8% 95.9%) / 0.5);
    flex-shrink: 0;
  }
</style>
