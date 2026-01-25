/**
 * Shiki integration for DAUI
 *
 * Provides syntax-highlighted code blocks using Shiki.
 *
 * Requires peer dependency: shiki
 *
 * @example
 * ```bash
 * pnpm add shiki
 * ```
 *
 * ```typescript
 * import { register } from 'svelte-daui';
 * import { shiki } from 'svelte-daui/integrations/shiki';
 *
 * register(shiki);
 * ```
 *
 * Then in a page definition:
 * ```typescript
 * {
 *   atom: 'code-block',
 *   code: `const x = 1;`,
 *   language: 'typescript',
 *   showLineNumbers: true,
 * }
 * ```
 */
import type { Preset } from '@daui/core';
import CodeBlock from './CodeBlock.svelte';

export const shiki: Preset = {
  atoms: {
    'code-block': CodeBlock,
  },
};

// Also export component directly for standalone use
export { CodeBlock };
