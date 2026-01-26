<script lang="ts">
  import type { ChatMessagesListMolecule, ChatMessage } from '@daui/core';
  import ChatBubble from '../atoms/ChatBubble.svelte';
  import TypingIndicator from '../atoms/TypingIndicator.svelte';

  let {
    id,
    messages: getMessages,
    currentUserId,
    showTimestamps = true,
    groupByDate = true,
    typingIndicator,
    onMessageClick,
    emptyText = 'No messages yet',
  }: Omit<ChatMessagesListMolecule, 'molecule'> = $props();

  let resolvedMessages = $state<ChatMessage[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let containerEl = $state<HTMLDivElement | null>(null);
  let shouldAutoScroll = $state(true);

  // Resolve typing indicator
  let typingAuthor = $derived(
    typeof typingIndicator === 'function' ? typingIndicator() : typingIndicator
  );

  // Load messages
  $effect(() => {
    async function loadMessages() {
      loading = true;
      error = null;
      try {
        const result = getMessages();
        resolvedMessages = result instanceof Promise ? await result : result;
      } catch (e) {
        error = e instanceof Error ? e.message : 'Failed to load messages';
        resolvedMessages = [];
      } finally {
        loading = false;
      }
    }
    loadMessages();
  });

  // Auto-scroll to bottom when new messages arrive
  $effect(() => {
    if (shouldAutoScroll && containerEl && resolvedMessages.length > 0) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        if (containerEl) {
          containerEl.scrollTop = containerEl.scrollHeight;
        }
      }, 10);
    }
  });

  // Track scroll position to determine if user has scrolled up
  function handleScroll() {
    if (!containerEl) return;
    const { scrollTop, scrollHeight, clientHeight } = containerEl;
    // If user is near bottom (within 100px), enable auto-scroll
    shouldAutoScroll = scrollHeight - scrollTop - clientHeight < 100;
  }

  // Group messages by date
  function getDateLabel(timestamp: number): string {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
    }
  }

  // Get grouped messages with date separators
  let groupedMessages = $derived.by(() => {
    if (!groupByDate) return resolvedMessages.map((msg) => ({ type: 'message' as const, message: msg }));

    const groups: Array<{ type: 'date'; label: string } | { type: 'message'; message: ChatMessage }> = [];
    let lastDate = '';

    for (const msg of resolvedMessages) {
      const dateLabel = getDateLabel(msg.timestamp);
      if (dateLabel !== lastDate) {
        groups.push({ type: 'date', label: dateLabel });
        lastDate = dateLabel;
      }
      groups.push({ type: 'message', message: msg });
    }

    return groups;
  });

  function getVariant(msg: ChatMessage): 'user' | 'assistant' | 'system' {
    if (msg.variant) return msg.variant;
    if (currentUserId && msg.author.id === currentUserId) return 'user';
    return 'assistant';
  }

  function handleMessageClick(msg: ChatMessage) {
    onMessageClick?.(msg);
  }
</script>

<div
  bind:this={containerEl}
  {id}
  class="chat-messages-list"
  onscroll={handleScroll}
  role="log"
  aria-live="polite"
>
  {#if loading}
    <div class="chat-messages-list__loading">
      <div class="chat-messages-list__spinner"></div>
      <span>Loading messages...</span>
    </div>
  {:else if error}
    <div class="chat-messages-list__error">{error}</div>
  {:else if resolvedMessages.length === 0}
    <div class="chat-messages-list__empty">{emptyText}</div>
  {:else}
    <div class="chat-messages-list__content">
      {#each groupedMessages as item}
        {#if item.type === 'date'}
          <div class="chat-messages-list__date-separator">
            <span class="chat-messages-list__date-label">{item.label}</span>
          </div>
        {:else}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="chat-messages-list__message"
            class:chat-messages-list__message--clickable={!!onMessageClick}
            onclick={() => handleMessageClick(item.message)}
          >
            <ChatBubble
              content={item.message.content}
              author={item.message.author}
              timestamp={showTimestamps ? item.message.timestamp : undefined}
              variant={getVariant(item.message)}
              status={item.message.status}
              replyTo={item.message.replyTo}
            />
          </div>
        {/if}
      {/each}

      {#if typingAuthor}
        <TypingIndicator author={typingAuthor} />
      {/if}
    </div>
  {/if}
</div>

<style>
  .chat-messages-list {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 1rem;
    background-color: var(--color-background, #ffffff);
  }

  .chat-messages-list__content {
    display: flex;
    flex-direction: column;
  }

  .chat-messages-list__loading,
  .chat-messages-list__error,
  .chat-messages-list__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 200px;
    gap: 0.75rem;
    color: var(--color-muted-foreground, #64748b);
    font-size: 0.875rem;
  }

  .chat-messages-list__error {
    color: var(--color-destructive, #ef4444);
  }

  .chat-messages-list__spinner {
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid var(--color-muted, #e2e8f0);
    border-top-color: var(--color-primary, #3b82f6);
    border-radius: 9999px;
    animation: spin 0.75s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .chat-messages-list__date-separator {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem 0;
  }

  .chat-messages-list__date-label {
    padding: 0.25rem 0.75rem;
    background-color: var(--color-muted, #f1f5f9);
    border-radius: 9999px;
    font-size: 0.6875rem;
    font-weight: 500;
    color: var(--color-muted-foreground, #64748b);
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  .chat-messages-list__message {
    transition: opacity 0.15s;
  }

  .chat-messages-list__message--clickable {
    cursor: pointer;
  }

  .chat-messages-list__message--clickable:hover {
    opacity: 0.85;
  }
</style>
