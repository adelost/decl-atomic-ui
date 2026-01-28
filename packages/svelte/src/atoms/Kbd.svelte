<script lang="ts">
  import type { KbdAtom } from '@daui/core';

  let { keys, size = 'md' }: KbdAtom = $props();

  // Normalize keys to array
  let keysList = $derived<string[]>(
    typeof keys === 'string'
      ? keys.split('+').map((k) => k.trim())
      : keys
  );

  // Map common key names to symbols
  const keySymbols: Record<string, string> = {
    cmd: '⌘',
    command: '⌘',
    ctrl: '⌃',
    control: '⌃',
    alt: '⌥',
    option: '⌥',
    shift: '⇧',
    enter: '↵',
    return: '↵',
    backspace: '⌫',
    delete: '⌦',
    escape: 'Esc',
    esc: 'Esc',
    tab: '⇥',
    space: '␣',
    up: '↑',
    down: '↓',
    left: '←',
    right: '→',
  };

  function formatKey(key: string): string {
    const lower = key.toLowerCase();
    return keySymbols[lower] ?? key;
  }
</script>

<span class="kbd-wrapper kbd-{size}">
  {#each keysList as key, i}
    {#if i > 0}
      <span class="kbd-separator">+</span>
    {/if}
    <kbd class="kbd">{formatKey(key)}</kbd>
  {/each}
</span>

<style>
  .kbd-wrapper {
    display: inline-flex;
    align-items: center;
    gap: 0.125rem;
  }

  .kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5em;
    padding: 0.125rem 0.375rem;
    font-family: inherit;
    font-weight: 500;
    color: #374151;
    background-color: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    box-shadow: 0 1px 0 1px #e5e7eb;
  }

  .kbd-separator {
    color: #9ca3af;
    margin: 0 0.125rem;
  }

  /* Size variants */
  .kbd-sm .kbd {
    font-size: 0.625rem;
    padding: 0.0625rem 0.25rem;
    min-width: 1.25em;
  }

  .kbd-sm .kbd-separator {
    font-size: 0.625rem;
  }

  .kbd-md .kbd {
    font-size: 0.75rem;
  }

  .kbd-md .kbd-separator {
    font-size: 0.75rem;
  }
</style>
