<script lang="ts">
  import { Dialog } from 'bits-ui';
  import type { ModalOrganism } from '@daui/core';
  import SectionRenderer from '../renderer/SectionRenderer.svelte';
  import Icon from '../atoms/Icon.svelte';

  let {
    id,
    title,
    open,
    onClose,
    size = 'md',
    closeOnBackdrop = true,
    closeOnEscape = true,
    content,
    footer,
  }: Omit<ModalOrganism, 'organism'> = $props();

  let resolvedTitle = $derived(typeof title === 'function' ? title() : title);
  let isOpen = $derived(open());

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      onClose();
    }
  }

  const sizeClasses: Record<string, string> = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
    fullscreen: 'modal-fullscreen',
  };
</script>

<Dialog.Root
  open={isOpen}
  onOpenChange={handleOpenChange}
  closeOnEscapeKeyDown={closeOnEscape}
  closeOnOutsideClick={closeOnBackdrop}
>
  <Dialog.Portal>
    <Dialog.Overlay class="modal-overlay" />
    <Dialog.Content {id} class="modal {sizeClasses[size]}">
      <div class="modal-header">
        <Dialog.Title class="modal-title">{resolvedTitle}</Dialog.Title>
        <Dialog.Close class="modal-close">
          <Icon name="x" size="sm" />
        </Dialog.Close>
      </div>

      <Dialog.Description class="sr-only">
        {resolvedTitle}
      </Dialog.Description>

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
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  :global(.modal-overlay) {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
  }

  :global(.modal) {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 50;
    display: flex;
    flex-direction: column;
    padding: 0;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    background: white;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    max-height: 85vh;
    overflow: hidden;
  }

  :global(.modal-sm) {
    width: 24rem;
    max-width: 90vw;
  }

  :global(.modal-md) {
    width: 32rem;
    max-width: 90vw;
  }

  :global(.modal-lg) {
    width: 48rem;
    max-width: 90vw;
  }

  :global(.modal-fullscreen) {
    width: 95vw;
    height: 90vh;
    max-width: none;
    max-height: none;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    flex-shrink: 0;
  }

  :global(.modal-title) {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #0f172a;
  }

  :global(.modal-close) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 0.375rem;
    color: #64748b;
    cursor: pointer;
    transition: all 0.15s;
  }

  :global(.modal-close:hover) {
    background: #f1f5f9;
    color: #0f172a;
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
    border-top: 1px solid #e2e8f0;
    background: #f8fafc;
    flex-shrink: 0;
  }

  :global(.sr-only) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
