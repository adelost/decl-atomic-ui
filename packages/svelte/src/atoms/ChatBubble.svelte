<script lang="ts">
  import type { ChatBubbleAtom } from '@daui/core';
  import { cn } from '@daui/core';

  let {
    content,
    author,
    timestamp,
    variant = 'assistant',
    status,
    replyTo,
  }: Omit<ChatBubbleAtom, 'atom'> = $props();

  let resolvedContent = $derived(typeof content === 'function' ? content() : content);
  let resolvedTimestamp = $derived(typeof timestamp === 'function' ? timestamp() : timestamp);

  function formatTime(ts: number): string {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
</script>

<div
  class={cn(
    'chat-bubble',
    variant === 'user' && 'chat-bubble--user',
    variant === 'assistant' && 'chat-bubble--assistant',
    variant === 'system' && 'chat-bubble--system'
  )}
>
  {#if variant !== 'system' && variant !== 'user'}
    <div class="chat-bubble__avatar">
      {#if author.avatar}
        <img src={author.avatar} alt={author.name} class="chat-bubble__avatar-img" />
      {:else}
        <span class="chat-bubble__avatar-fallback">{getInitials(author.name)}</span>
      {/if}
    </div>
  {/if}

  <div class="chat-bubble__content-wrapper">
    {#if variant !== 'system' && variant !== 'user'}
      <span class="chat-bubble__author">{author.name}</span>
    {/if}

    {#if replyTo}
      <div class="chat-bubble__reply">
        <span class="chat-bubble__reply-author">{replyTo.author}</span>
        <span class="chat-bubble__reply-content">{replyTo.content}</span>
      </div>
    {/if}

    <div class="chat-bubble__body">
      <p class="chat-bubble__text">{resolvedContent}</p>
    </div>

    <div class="chat-bubble__meta">
      {#if resolvedTimestamp}
        <span class="chat-bubble__time">{formatTime(resolvedTimestamp)}</span>
      {/if}
      {#if status && variant === 'user'}
        <span class="chat-bubble__status chat-bubble__status--{status}">
          {#if status === 'sending'}
            ○
          {:else if status === 'sent'}
            ✓
          {:else if status === 'delivered'}
            ✓✓
          {:else if status === 'read'}
            ✓✓
          {:else if status === 'error'}
            ⚠
          {/if}
        </span>
      {/if}
    </div>
  </div>
</div>

<style>
  .chat-bubble {
    display: flex;
    gap: 0.5rem;
    max-width: 80%;
    margin-bottom: 0.5rem;
  }

  .chat-bubble--user {
    margin-left: auto;
    flex-direction: row-reverse;
  }

  .chat-bubble--assistant {
    margin-right: auto;
  }

  .chat-bubble--system {
    margin: 0 auto;
    max-width: 90%;
  }

  .chat-bubble__avatar {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    overflow: hidden;
    background-color: var(--color-muted, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chat-bubble__avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .chat-bubble__avatar-fallback {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-muted-foreground, #64748b);
  }

  .chat-bubble__content-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .chat-bubble__author {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-muted-foreground, #64748b);
    margin-bottom: 0.125rem;
  }

  .chat-bubble--user .chat-bubble__author {
    text-align: right;
  }

  .chat-bubble__reply {
    display: flex;
    flex-direction: column;
    padding: 0.375rem 0.5rem;
    margin-bottom: 0.25rem;
    border-left: 2px solid var(--color-primary, #3b82f6);
    background-color: var(--color-muted, #f1f5f9);
    border-radius: 0.25rem;
    font-size: 0.75rem;
  }

  .chat-bubble__reply-author {
    font-weight: 500;
    color: var(--color-primary, #3b82f6);
  }

  .chat-bubble__reply-content {
    color: var(--color-muted-foreground, #64748b);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
  }

  .chat-bubble__body {
    padding: 0.625rem 0.875rem;
    border-radius: 1rem;
  }

  .chat-bubble--user .chat-bubble__body {
    background-color: var(--color-primary, #3b82f6);
    color: var(--color-primary-foreground, #ffffff);
    border-bottom-right-radius: 0.25rem;
  }

  .chat-bubble--assistant .chat-bubble__body {
    background-color: var(--color-muted, #f1f5f9);
    color: var(--color-foreground, #0f172a);
    border-bottom-left-radius: 0.25rem;
  }

  .chat-bubble--system .chat-bubble__body {
    background-color: transparent;
    color: var(--color-muted-foreground, #64748b);
    text-align: center;
    font-size: 0.75rem;
    padding: 0.5rem;
  }

  .chat-bubble__text {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.4;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .chat-bubble__meta {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0 0.25rem;
  }

  .chat-bubble--user .chat-bubble__meta {
    justify-content: flex-end;
  }

  .chat-bubble__time {
    font-size: 0.625rem;
    color: var(--color-muted-foreground, #94a3b8);
  }

  .chat-bubble__status {
    font-size: 0.625rem;
  }

  .chat-bubble__status--sending {
    color: var(--color-muted-foreground, #94a3b8);
  }

  .chat-bubble__status--sent,
  .chat-bubble__status--delivered {
    color: var(--color-muted-foreground, #94a3b8);
  }

  .chat-bubble__status--read {
    color: var(--color-primary, #3b82f6);
  }

  .chat-bubble__status--error {
    color: var(--color-destructive, #ef4444);
  }
</style>
