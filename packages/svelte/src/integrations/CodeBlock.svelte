<script module lang="ts">
  import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
  import { createOnigurumaEngine } from 'shiki/engine/oniguruma';

  // Singleton highlighter - shared across all CodeBlock instances
  let highlighterPromise: Promise<HighlighterCore> | null = null;
  const loadedLanguages = new Set<string>();

  // Map our language names to dynamic imports
  const languageImports: Record<string, () => Promise<any>> = {
    typescript: () => import('shiki/langs/typescript.mjs'),
    javascript: () => import('shiki/langs/javascript.mjs'),
    json: () => import('shiki/langs/json.mjs'),
    yaml: () => import('shiki/langs/yaml.mjs'),
    markdown: () => import('shiki/langs/markdown.mjs'),
    python: () => import('shiki/langs/python.mjs'),
    html: () => import('shiki/langs/html.mjs'),
    css: () => import('shiki/langs/css.mjs'),
    svelte: () => import('shiki/langs/svelte.mjs'),
    bash: () => import('shiki/langs/bash.mjs'),
  };

  // Map our language names to Shiki's
  const languageMap: Record<string, string> = {
    typescript: 'typescript',
    javascript: 'javascript',
    json: 'json',
    yaml: 'yaml',
    markdown: 'markdown',
    python: 'python',
    html: 'html',
    css: 'css',
    svelte: 'svelte',
    shell: 'bash',
  };

  function getHighlighter(): Promise<HighlighterCore> {
    if (!highlighterPromise) {
      highlighterPromise = createHighlighterCore({
        themes: [
          import('shiki/themes/github-dark.mjs'),
          import('shiki/themes/github-light.mjs'),
        ],
        langs: [], // No languages initially
        engine: createOnigurumaEngine(import('shiki/wasm')),
      });
    }
    return highlighterPromise;
  }
</script>

<script lang="ts">
  import type { CodeBlockAtom } from '@daui/core';
  import { untrack } from 'svelte';

  let {
    code,
    language,
    theme = 'auto',
    showLineNumbers = true,
    highlightLines = [],
    maxHeight,
    copyable = true,
  }: Omit<CodeBlockAtom, 'atom'> = $props();

  let resolvedCode = $derived(typeof code === 'function' ? code() : code);
  let html = $state('');
  let copied = $state(false);

  // Determine theme based on preference
  function getTheme(): 'github-dark' | 'github-light' {
    if (theme === 'light') return 'github-light';
    if (theme === 'dark') return 'github-dark';
    // Auto: check system preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'github-dark';
    }
    return 'github-light';
  }

  // Generate highlighted HTML
  async function highlight() {
    try {
      const highlighter = await getHighlighter();
      const lang = languageMap[language] || 'text';

      // Load language on demand if not already loaded
      if (lang !== 'text' && !loadedLanguages.has(lang) && languageImports[lang]) {
        const langModule = await languageImports[lang]();
        await highlighter.loadLanguage(langModule.default || langModule);
        loadedLanguages.add(lang);
      }

      const result = highlighter.codeToHtml(resolvedCode, {
        lang: loadedLanguages.has(lang) ? lang : 'text',
        theme: getTheme(),
        transformers: [
          {
            line(node, line) {
              // Add line numbers if enabled
              if (showLineNumbers) {
                node.properties['data-line'] = line;
              }
              // Highlight specific lines
              if (highlightLines.includes(line)) {
                node.properties['class'] = (node.properties['class'] || '') + ' highlighted';
              }
            },
          },
        ],
      });
      html = result;
    } catch (e) {
      console.error('Shiki highlighting error:', e);
      html = `<pre><code>${escapeHtml(resolvedCode)}</code></pre>`;
    }
  }

  function escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(resolvedCode);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch (e) {
      console.error('Copy failed:', e);
    }
  }

  // Re-highlight when code or language changes
  $effect(() => {
    const _ = resolvedCode;
    const __ = language;
    untrack(() => highlight());
  });
</script>

<div
  class="code-block"
  style:max-height={maxHeight ? (typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight) : undefined}
>
  {#if copyable}
    <button class="copy-button" onclick={copyToClipboard} aria-label="Copy code">
      {copied ? '✓' : 'Copy'}
    </button>
  {/if}
  <div class="code-content" class:line-numbers={showLineNumbers}>
    {@html html}
  </div>
</div>

<style>
  .code-block {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    background-color: hsl(var(--muted) / 0.3);
    border: 1px solid hsl(var(--border));
  }

  .code-content {
    overflow: auto;
  }

  .code-content :global(pre) {
    margin: 0;
    padding: 1rem;
    overflow-x: auto;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .code-content :global(code) {
    font-family: inherit;
  }

  /* Line numbers */
  .code-content.line-numbers :global(.line) {
    display: inline-block;
    width: 100%;
  }

  .code-content.line-numbers :global(.line)::before {
    content: attr(data-line);
    display: inline-block;
    width: 2rem;
    margin-right: 1rem;
    text-align: right;
    color: hsl(var(--muted-foreground));
    opacity: 0.5;
    user-select: none;
  }

  /* Highlighted lines */
  .code-content :global(.line.highlighted) {
    background-color: hsl(var(--primary) / 0.1);
    margin: 0 -1rem;
    padding: 0 1rem;
  }

  /* Copy button */
  .copy-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    background: hsl(var(--muted));
    border: 1px solid hsl(var(--border));
    border-radius: 4px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s ease;
    z-index: 10;
    color: hsl(var(--foreground));
  }

  .code-block:hover .copy-button {
    opacity: 1;
  }

  .copy-button:hover {
    background: hsl(var(--muted) / 0.8);
  }
</style>
