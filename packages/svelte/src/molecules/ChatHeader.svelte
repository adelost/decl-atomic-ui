<script lang="ts">
  import type { ChatHeaderMolecule } from '@daui/core';
  import SectionRenderer from '../renderer/SectionRenderer.svelte';

  let {
    title,
    subtitle,
    avatar,
    status,
    actions,
    onClose,
    onMinimize,
  }: Omit<ChatHeaderMolecule, 'molecule'> = $props();

  let resolvedTitle = $derived(typeof title === 'function' ? title() : title);
  let resolvedSubtitle = $derived(typeof subtitle === 'function' ? subtitle() : subtitle);
  let resolvedStatus = $derived(typeof status === 'function' ? status() : status);

  function getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  function getStatusText(s: typeof resolvedStatus): string {
    switch (s) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'typing':
        return 'Typing...';
      default:
        return '';
    }
  }
</script>

<div class="chat-header">
  <div class="chat-header__left">
    {#if avatar}
      <div class="chat-header__avatar">
        {#if avatar.avatar}
          <img src={avatar.avatar} alt={avatar.name} class="chat-header__avatar-img" />
        {:else}
          <span class="chat-header__avatar-fallback">{getInitials(avatar.name)}</span>
        {/if}
        {#if resolvedStatus}
          <span
            class="chat-header__status-dot"
            class:chat-header__status-dot--online={resolvedStatus === 'online'}
            class:chat-header__status-dot--offline={resolvedStatus === 'offline'}
            class:chat-header__status-dot--typing={resolvedStatus === 'typing'}
          ></span>
        {/if}
      </div>
    {/if}

    <div class="chat-header__info">
      <h3 class="chat-header__title">{resolvedTitle}</h3>
      {#if resolvedSubtitle || resolvedStatus}
        <p class="chat-header__subtitle">
          {resolvedSubtitle ?? getStatusText(resolvedStatus)}
        </p>
      {/if}
    </div>
  </div>

  <div class="chat-header__right">
    {#if actions}
      {#each actions as action}
        <SectionRenderer section={action} />
      {/each}
    {/if}

    {#if onMinimize}
      <button
        type="button"
        class="chat-header__action"
        onclick={() => onMinimize?.()}
        aria-label="Minimize"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="chat-header__action-icon"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    {/if}

    {#if onClose}
      <button
        type="button"
        class="chat-header__action"
        onclick={() => onClose?.()}
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="chat-header__action-icon"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    {/if}
  </div>
</div>

<style>
  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--color-border, #e2e8f0);
    background-color: var(--color-background, #ffffff);
  }

  .chat-header__left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
  }

  .chat-header__avatar {
    position: relative;
    flex-shrink: 0;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 9999px;
    overflow: hidden;
    background-color: var(--color-muted, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chat-header__avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .chat-header__avatar-fallback {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-muted-foreground, #64748b);
  }

  .chat-header__status-dot {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 9999px;
    border: 2px solid var(--color-background, #ffffff);
  }

  .chat-header__status-dot--online {
    background-color: #22c55e;
  }

  .chat-header__status-dot--offline {
    background-color: #94a3b8;
  }

  .chat-header__status-dot--typing {
    background-color: #3b82f6;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .chat-header__info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .chat-header__title {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-foreground, #0f172a);
    line-height: 1.25;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .chat-header__subtitle {
    margin: 0;
    font-size: 0.75rem;
    color: var(--color-muted-foreground, #64748b);
    line-height: 1.25;
  }

  .chat-header__right {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex-shrink: 0;
  }

  .chat-header__action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: none;
    border-radius: 9999px;
    background: transparent;
    color: var(--color-muted-foreground, #64748b);
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;
  }

  .chat-header__action:hover {
    background-color: var(--color-muted, #f1f5f9);
    color: var(--color-foreground, #0f172a);
  }

  .chat-header__action-icon {
    width: 1.125rem;
    height: 1.125rem;
  }
</style>
