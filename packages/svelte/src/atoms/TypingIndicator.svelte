<script lang="ts">
  import type { TypingIndicatorAtom } from '@daui/core';
  import { cn } from '@daui/core';

  let { author, size = 'md' }: Omit<TypingIndicatorAtom, 'atom'> = $props();

  function getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  const sizeClasses = {
    sm: 'typing-indicator--sm',
    md: 'typing-indicator--md',
    lg: 'typing-indicator--lg',
  };
</script>

<div class={cn('typing-indicator', sizeClasses[size ?? 'md'])}>
  {#if author}
    <div class="typing-indicator__avatar">
      {#if author.avatar}
        <img src={author.avatar} alt={author.name} class="typing-indicator__avatar-img" />
      {:else}
        <span class="typing-indicator__avatar-fallback">{getInitials(author.name)}</span>
      {/if}
    </div>
  {/if}

  <div class="typing-indicator__bubble">
    <span class="typing-indicator__dot"></span>
    <span class="typing-indicator__dot"></span>
    <span class="typing-indicator__dot"></span>
  </div>
</div>

<style>
  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    max-width: 80%;
    margin-bottom: 0.5rem;
  }

  .typing-indicator__avatar {
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

  .typing-indicator--sm .typing-indicator__avatar {
    width: 1.5rem;
    height: 1.5rem;
  }

  .typing-indicator--lg .typing-indicator__avatar {
    width: 2.5rem;
    height: 2.5rem;
  }

  .typing-indicator__avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .typing-indicator__avatar-fallback {
    font-size: 0.625rem;
    font-weight: 500;
    color: var(--color-muted-foreground, #64748b);
  }

  .typing-indicator--lg .typing-indicator__avatar-fallback {
    font-size: 0.75rem;
  }

  .typing-indicator__bubble {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.75rem 1rem;
    background-color: var(--color-muted, #f1f5f9);
    border-radius: 1rem;
    border-bottom-left-radius: 0.25rem;
  }

  .typing-indicator--sm .typing-indicator__bubble {
    padding: 0.5rem 0.75rem;
    gap: 0.1875rem;
  }

  .typing-indicator--lg .typing-indicator__bubble {
    padding: 1rem 1.25rem;
    gap: 0.375rem;
  }

  .typing-indicator__dot {
    width: 0.5rem;
    height: 0.5rem;
    background-color: var(--color-muted-foreground, #94a3b8);
    border-radius: 9999px;
    animation: typing-bounce 1.4s infinite ease-in-out both;
  }

  .typing-indicator--sm .typing-indicator__dot {
    width: 0.375rem;
    height: 0.375rem;
  }

  .typing-indicator--lg .typing-indicator__dot {
    width: 0.625rem;
    height: 0.625rem;
  }

  .typing-indicator__dot:nth-child(1) {
    animation-delay: -0.32s;
  }

  .typing-indicator__dot:nth-child(2) {
    animation-delay: -0.16s;
  }

  .typing-indicator__dot:nth-child(3) {
    animation-delay: 0s;
  }

  @keyframes typing-bounce {
    0%,
    80%,
    100% {
      transform: scale(0.6);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
