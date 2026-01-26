<script lang="ts">
  import type { ChatInputMolecule } from '@daui/core';
  import { cn } from '@daui/core';

  let {
    id,
    placeholder = 'Type a message...',
    disabled,
    onSend,
    onTyping,
    maxLength,
    showCharCount = false,
  }: Omit<ChatInputMolecule, 'molecule'> = $props();

  let inputValue = $state('');
  let textareaEl = $state<HTMLTextAreaElement | null>(null);
  let typingTimeout = $state<ReturnType<typeof setTimeout> | null>(null);

  let isDisabled = $derived(typeof disabled === 'function' ? disabled() : !!disabled);
  let charCount = $derived(inputValue.length);
  let canSend = $derived(inputValue.trim().length > 0 && !isDisabled);

  function handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    inputValue = target.value;

    // Auto-resize textarea
    target.style.height = 'auto';
    target.style.height = Math.min(target.scrollHeight, 150) + 'px';

    // Handle typing indicator
    if (onTyping) {
      onTyping(true);

      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      typingTimeout = setTimeout(() => {
        onTyping?.(false);
      }, 1000);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function send() {
    if (!canSend) return;

    const message = inputValue.trim();
    inputValue = '';

    // Reset textarea height
    if (textareaEl) {
      textareaEl.style.height = 'auto';
    }

    // Clear typing indicator
    if (onTyping) {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      onTyping(false);
    }

    onSend(message);
  }
</script>

<div class="chat-input" class:chat-input--disabled={isDisabled}>
  <div class="chat-input__wrapper">
    <textarea
      bind:this={textareaEl}
      {id}
      class="chat-input__textarea"
      {placeholder}
      disabled={isDisabled}
      maxlength={maxLength}
      rows="1"
      value={inputValue}
      oninput={handleInput}
      onkeydown={handleKeydown}
    ></textarea>

    <button
      type="button"
      class="chat-input__send"
      disabled={!canSend}
      onclick={send}
      aria-label="Send message"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="chat-input__send-icon"
      >
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
    </button>
  </div>

  {#if showCharCount && maxLength}
    <div class="chat-input__char-count" class:chat-input__char-count--limit={charCount >= maxLength}>
      {charCount}/{maxLength}
    </div>
  {/if}
</div>

<style>
  .chat-input {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem;
    border-top: 1px solid var(--color-border, #e2e8f0);
    background-color: var(--color-background, #ffffff);
  }

  .chat-input--disabled {
    opacity: 0.6;
  }

  .chat-input__wrapper {
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;
    background-color: var(--color-muted, #f1f5f9);
    border-radius: 1.25rem;
    padding: 0.5rem 0.5rem 0.5rem 1rem;
  }

  .chat-input__textarea {
    flex: 1;
    border: none;
    background: transparent;
    resize: none;
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--color-foreground, #0f172a);
    min-height: 1.5rem;
    max-height: 150px;
    padding: 0;
    margin: 0;
    font-family: inherit;
  }

  .chat-input__textarea::placeholder {
    color: var(--color-muted-foreground, #94a3b8);
  }

  .chat-input__textarea:focus {
    outline: none;
  }

  .chat-input__textarea:disabled {
    cursor: not-allowed;
  }

  .chat-input__send {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: none;
    border-radius: 9999px;
    background-color: var(--color-primary, #3b82f6);
    color: var(--color-primary-foreground, #ffffff);
    cursor: pointer;
    transition: background-color 0.15s, opacity 0.15s;
  }

  .chat-input__send:hover:not(:disabled) {
    background-color: var(--color-primary-hover, #2563eb);
  }

  .chat-input__send:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .chat-input__send-icon {
    width: 1rem;
    height: 1rem;
  }

  .chat-input__char-count {
    font-size: 0.625rem;
    color: var(--color-muted-foreground, #94a3b8);
    text-align: right;
    padding-right: 0.5rem;
  }

  .chat-input__char-count--limit {
    color: var(--color-destructive, #ef4444);
  }
</style>
