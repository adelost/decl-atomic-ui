<script lang="ts">
  import type { AlertPanelMolecule } from '@daui/core';
  import Icon from '../atoms/Icon.svelte';

  let { type, message, dismissible = false, onDismiss }: AlertPanelMolecule = $props();

  let resolvedType = $derived(typeof type === 'function' ? type() : type);
  let resolvedMessage = $derived(typeof message === 'function' ? message() : message);

  const iconMap: Record<string, string> = {
    info: 'info',
    success: 'check-circle',
    warning: 'alert-triangle',
    error: 'x-circle',
  };
</script>

<div class="alert-panel" data-type={resolvedType}>
  <Icon name={iconMap[resolvedType]} size="sm" />
  <span class="alert-message">{resolvedMessage}</span>
  {#if dismissible && onDismiss}
    <button class="alert-dismiss" onclick={onDismiss} aria-label="Dismiss">
      <Icon name="x" size="sm" />
    </button>
  {/if}
</div>

<style>
  .alert-panel {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
  }

  .alert-panel[data-type='info'] {
    background: hsl(210 100% 97%);
    border: 1px solid hsl(210 100% 80%);
    color: hsl(210 100% 30%);
  }

  .alert-panel[data-type='success'] {
    background: hsl(142 76% 97%);
    border: 1px solid hsl(142 76% 70%);
    color: hsl(142 76% 25%);
  }

  .alert-panel[data-type='warning'] {
    background: hsl(38 92% 97%);
    border: 1px solid hsl(38 92% 70%);
    color: hsl(38 92% 25%);
  }

  .alert-panel[data-type='error'] {
    background: hsl(0 84% 97%);
    border: 1px solid hsl(0 84% 75%);
    color: hsl(0 84% 35%);
  }

  .alert-message {
    flex: 1;
  }

  .alert-dismiss {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    border: none;
    background: transparent;
    color: inherit;
    opacity: 0.7;
    cursor: pointer;
    border-radius: 0.25rem;
    transition: opacity 0.15s;
  }

  .alert-dismiss:hover {
    opacity: 1;
  }
</style>
