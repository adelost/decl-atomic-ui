<script lang="ts">
  import type { Page, KeyboardShortcut } from '@daui/core';
  import SectionRenderer from './SectionRenderer.svelte';
  import { cn, executeCallback } from '@daui/core';
  import { Tooltip } from 'bits-ui';

  let { page }: { page: Page } = $props();

  // Keyboard shortcut handling
  const KEY_MAP: Record<string, string> = {
    '↑': 'ArrowUp', '↓': 'ArrowDown', '←': 'ArrowLeft', '→': 'ArrowRight',
    'arrowup': 'ArrowUp', 'arrowdown': 'ArrowDown', 'arrowleft': 'ArrowLeft', 'arrowright': 'ArrowRight',
  };

  let inputSequence: string[] = [];
  let lastInputTime = 0;
  const SEQUENCE_TIMEOUT = 2000;
  const triggeredOnce = new Set<string>();

  function normalizeKey(key: string): string {
    return KEY_MAP[key] ?? KEY_MAP[key.toLowerCase()] ?? key;
  }

  function parseKeys(keys: string): string[] {
    // Handle arrow sequences like ↑↑↓↓←→←→
    if (/[↑↓←→]/.test(keys)) {
      return [...keys].map(normalizeKey);
    }
    // Single key
    return [normalizeKey(keys)];
  }

  function checkShortcut(shortcut: KeyboardShortcut, e: KeyboardEvent): boolean {
    const keys = parseKeys(shortcut.keys);

    // Single key with modifiers
    if (keys.length === 1) {
      const key = keys[0];
      const modifiersMatch =
        (!shortcut.modifiers?.includes('ctrl') || e.ctrlKey || e.metaKey) &&
        (!shortcut.modifiers?.includes('shift') || e.shiftKey) &&
        (!shortcut.modifiers?.includes('alt') || e.altKey) &&
        (!shortcut.modifiers?.includes('meta') || e.metaKey);

      if (!modifiersMatch) return false;
      return e.key === key || e.code === key;
    }

    // Sequence (like Konami)
    const recent = inputSequence.slice(-keys.length);
    return recent.length === keys.length && recent.every((k, i) => k === keys[i]);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!page.shortcuts?.length) return;

    // Ignore if typing in input/textarea
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    const now = Date.now();
    if (now - lastInputTime > SEQUENCE_TIMEOUT) {
      inputSequence = [];
    }
    lastInputTime = now;

    // Track for sequences
    inputSequence.push(e.key);
    if (inputSequence.length > 20) {
      inputSequence = inputSequence.slice(-15);
    }

    // Check shortcuts
    for (const shortcut of page.shortcuts) {
      if (shortcut.once && triggeredOnce.has(shortcut.keys)) continue;

      if (checkShortcut(shortcut, e)) {
        if (shortcut.preventDefault) e.preventDefault();
        if (shortcut.once) triggeredOnce.add(shortcut.keys);
        executeCallback(shortcut.action);
        break;
      }
    }
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

<Tooltip.Provider>
<div class="min-h-screen bg-background text-foreground font-sans antialiased">
  <div
    class={cn(
      'container mx-auto py-10',
      page.layout === 'centered' && 'max-w-md',
      page.layout === 'full' && 'max-w-7xl',
      page.layout === 'sidebar' && 'grid grid-cols-[250px_1fr] gap-6'
    )}
  >
    {#if page.title}
      <header class="mb-8">
        <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {page.title}
        </h1>
      </header>
    {/if}

    <main class="space-y-6">
      {#each page.sections as section}
        <SectionRenderer {section} />
      {/each}
    </main>
  </div>
</div>
</Tooltip.Provider>
