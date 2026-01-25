<script lang="ts">
  import type { ShowcaseMolecule, Section } from '@daui/core';
  import SectionRenderer from '../renderer/SectionRenderer.svelte';

  let {
    title,
    description,
    component,
    variants,
    children,
    layout = 'side-by-side',
    previewAlign = 'center',
    codeLanguage = 'typescript',
    showLineNumbers = false,
  }: ShowcaseMolecule = $props();

  // Track selected variant (0-indexed)
  let selectedIndex = $state(0);

  // Get the active component to display
  let activeComponent = $derived<Section | undefined>(
    variants && variants.length > 0 ? variants[selectedIndex]?.component : component
  );

  // Convert object to pretty-printed code string
  function formatValue(obj: unknown, depth: number): string {
    const indent = '  '.repeat(depth);
    const nextIndent = '  '.repeat(depth + 1);

    if (obj === null) return 'null';
    if (obj === undefined) return 'undefined';

    if (typeof obj === 'function') {
      const fnStr = obj.toString();
      if (fnStr.includes('=>')) {
        return fnStr.replace(/\s+/g, ' ').trim();
      }
      return '() => { ... }';
    }

    if (typeof obj === 'string') {
      if (obj.includes('\n') || (obj.includes("'") && obj.includes('"'))) {
        return '`' + obj.replace(/`/g, '\\`').replace(/\$/g, '\\$') + '`';
      }
      if (obj.includes("'")) {
        return `"${obj.replace(/"/g, '\\"')}"`;
      }
      return `'${obj}'`;
    }

    if (typeof obj === 'number' || typeof obj === 'boolean') {
      return String(obj);
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      if (obj.length <= 3 && obj.every((x) => typeof x !== 'object')) {
        return `[${obj.map((x) => formatValue(x, 0)).join(', ')}]`;
      }
      const items = obj.map((item) => `${nextIndent}${formatValue(item, depth + 1)}`).join(',\n');
      return `[\n${items}\n${indent}]`;
    }

    if (typeof obj === 'object') {
      const entries = Object.entries(obj).filter(([, v]) => v !== undefined);
      if (entries.length === 0) return '{}';

      const formatted = entries
        .map(([key, value]) => {
          const formattedValue = formatValue(value, depth + 1);
          return `${nextIndent}${key}: ${formattedValue}`;
        })
        .join(',\n');

      return `{\n${formatted}\n${indent}}`;
    }

    return String(obj);
  }

  let codeString = $derived(activeComponent ? formatValue(activeComponent, 0) : '');
  let hasVariants = $derived(variants && variants.length > 0);
</script>

<div class="showcase">
  {#if title || description}
    <div class="showcase-header">
      {#if title}
        <h3 class="showcase-title">{title}</h3>
      {/if}
      {#if description}
        <p class="showcase-description">{description}</p>
      {/if}
    </div>
  {/if}

  {#if hasVariants && variants}
    <div class="variant-selector">
      {#each variants as variant, i}
        <button
          class="variant-button"
          class:active={selectedIndex === i}
          onclick={() => (selectedIndex = i)}
        >
          {variant.label}
        </button>
      {/each}
    </div>
  {/if}

  <div class="showcase-content" class:side-by-side={layout === 'side-by-side'}>
    <div class="showcase-preview">
      <div class="preview-content align-{previewAlign}">
        {#if activeComponent}
          {#key selectedIndex}
            <SectionRenderer section={activeComponent} />
          {/key}
        {/if}
      </div>
    </div>

    <div class="showcase-code">
      <SectionRenderer
        section={{
          atom: 'code-block',
          code: codeString,
          language: codeLanguage,
          showLineNumbers,
          maxHeight: 400,
        }}
      />
    </div>
  </div>

  {#if children && children.length > 0}
    <div class="showcase-children">
      {#each children as child}
        <SectionRenderer section={child} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .showcase {
    border: 1px solid hsl(var(--border));
    border-radius: 0.5rem;
    overflow: hidden;
    background: hsl(var(--card));
  }

  .showcase-header {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid hsl(var(--border));
  }

  .showcase-title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: hsl(var(--foreground));
  }

  .showcase-description {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }

  .variant-selector {
    display: flex;
    gap: 0.25rem;
    padding: 0.75rem 1.25rem;
    background: hsl(var(--muted) / 0.3);
    border-bottom: 1px solid hsl(var(--border));
    flex-wrap: wrap;
  }

  .variant-button {
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
    font-weight: 500;
    border: 1px solid hsl(var(--border));
    border-radius: 0.375rem;
    background: hsl(var(--background));
    color: hsl(var(--muted-foreground));
    cursor: pointer;
    transition: all 0.15s;
  }

  .variant-button:hover {
    background: hsl(var(--muted));
    color: hsl(var(--foreground));
  }

  .variant-button.active {
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    border-color: hsl(var(--primary));
  }

  .showcase-content {
    display: flex;
    flex-direction: column;
  }

  .showcase-content.side-by-side {
    flex-direction: row;
  }

  @media (max-width: 768px) {
    .showcase-content.side-by-side {
      flex-direction: column;
    }
  }

  .showcase-preview {
    flex: 3;
    min-width: 0;
  }

  .showcase-code {
    flex: 2;
    min-width: 0;
  }

  .showcase-preview {
    border-bottom: 1px solid hsl(var(--border));
  }

  .showcase-content.side-by-side .showcase-preview {
    border-bottom: none;
    border-right: 1px solid hsl(var(--border));
  }

  @media (max-width: 768px) {
    .showcase-content.side-by-side .showcase-preview {
      border-right: none;
      border-bottom: 1px solid hsl(var(--border));
    }
  }

  .preview-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80px;
    width: 100%;
  }

  .preview-content.align-stretch {
    align-items: stretch;
  }

  .showcase-code :global(.code-block) {
    border: none;
    border-radius: 0;
  }

  .showcase-children {
    padding: 1.5rem;
    border-top: 1px solid hsl(var(--border));
    background: hsl(var(--muted) / 0.2);
  }
</style>
