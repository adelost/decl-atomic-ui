<script lang="ts">
  import type { ChatPanelOrganism } from '@daui/core';
  import { cn } from '@daui/core';
  import ChatHeader from '../molecules/ChatHeader.svelte';
  import ChatMessagesList from '../molecules/ChatMessagesList.svelte';
  import ChatInput from '../molecules/ChatInput.svelte';

  let {
    id,
    // Header
    title,
    subtitle,
    avatar,
    status,
    showHeader = true,
    // Messages
    messages,
    currentUserId,
    showTimestamps = true,
    groupByDate = true,
    typingIndicator,
    emptyText = 'No messages yet. Start the conversation!',
    // Input
    placeholder = 'Type a message...',
    onSend,
    onTyping,
    inputDisabled,
    // Actions
    onClose,
    onMinimize,
    headerActions,
    // Styling
    height,
    maxHeight,
    variant = 'default',
  }: Omit<ChatPanelOrganism, 'organism'> = $props();

  // Resolve reactive props
  let resolvedTitle = $derived(typeof title === 'function' ? title() : title);
</script>

<div
  {id}
  class={cn(
    'chat-panel',
    variant === 'floating' && 'chat-panel--floating',
    variant === 'embedded' && 'chat-panel--embedded'
  )}
  style:height={typeof height === 'number' ? `${height}px` : height}
  style:max-height={typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight}
>
  {#if showHeader && (resolvedTitle || avatar || onClose || onMinimize)}
    <ChatHeader
      title={title ?? ''}
      {subtitle}
      {avatar}
      {status}
      actions={headerActions}
      {onClose}
      {onMinimize}
    />
  {/if}

  <ChatMessagesList
    {messages}
    {currentUserId}
    {showTimestamps}
    {groupByDate}
    {typingIndicator}
    {emptyText}
  />

  <ChatInput
    {placeholder}
    {onSend}
    {onTyping}
    disabled={inputDisabled}
  />
</div>

<style>
  .chat-panel {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 300px;
    background-color: var(--color-background, #ffffff);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .chat-panel--floating {
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -4px rgba(0, 0, 0, 0.1);
    border-radius: 0.75rem;
  }

  .chat-panel--embedded {
    border: none;
    border-radius: 0;
  }
</style>
