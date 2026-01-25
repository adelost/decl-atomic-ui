<script lang="ts">
  import type { CodeEditorAtom } from '@daui/core';
  import { onMount, onDestroy } from 'svelte';
  import {
    EditorView,
    keymap,
    highlightSpecialChars,
    drawSelection,
    highlightActiveLine,
    dropCursor,
    rectangularSelection,
    crosshairCursor,
    lineNumbers,
    highlightActiveLineGutter,
  } from '@codemirror/view';
  import { EditorState, type Extension } from '@codemirror/state';
  import {
    defaultHighlightStyle,
    syntaxHighlighting,
    indentOnInput,
    bracketMatching,
    foldGutter,
    foldKeymap,
  } from '@codemirror/language';
  import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
  import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
  import {
    autocompletion,
    completionKeymap,
    closeBrackets,
    closeBracketsKeymap,
  } from '@codemirror/autocomplete';
  import { lintKeymap, lintGutter, linter } from '@codemirror/lint';

  // Language imports (dynamic based on usage)
  import { json as jsonLang, jsonParseLinter } from '@codemirror/lang-json';
  import { javascript } from '@codemirror/lang-javascript';
  import { markdown } from '@codemirror/lang-markdown';
  import { python } from '@codemirror/lang-python';
  import { yaml } from '@codemirror/lang-yaml';

  let {
    id,
    language,
    value,
    onChange,
    height = 300,
    readonly = false,
    showLineNumbers = true,
    foldGutter: showFoldGutter = true,
    lineWrapping = true,
    placeholder,
  }: Omit<CodeEditorAtom, 'atom'> = $props();

  let containerEl: HTMLDivElement;
  let view: EditorView | null = null;

  // Get initial value
  let initialValue = $derived(typeof value === 'function' ? value() : (value ?? ''));

  // Language extension based on prop
  function getLanguageExtension(): Extension[] {
    switch (language) {
      case 'json':
        return [jsonLang(), linter(jsonParseLinter())];
      case 'javascript':
        return [javascript()];
      case 'typescript':
        return [javascript({ typescript: true })];
      case 'markdown':
        return [markdown()];
      case 'python':
        return [python()];
      case 'yaml':
        return [yaml()];
      case 'html':
        return [javascript()]; // Basic fallback
      case 'css':
        return [javascript()]; // Basic fallback
      default:
        return [];
    }
  }

  // Dark theme matching app
  const darkTheme = EditorView.theme(
    {
      '&': {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        color: 'hsl(var(--foreground))',
        backgroundColor: 'hsl(var(--muted) / 0.3)',
      },
      '.cm-scroller': {
        flex: '1',
        overflow: 'auto',
        minHeight: '0',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
        fontSize: '0.875rem',
      },
      '.cm-content': {
        padding: '0.75rem',
        caretColor: 'hsl(var(--foreground))',
      },
      '.cm-line': {
        padding: '0 0.25rem',
      },
      '.cm-gutters': {
        backgroundColor: 'hsl(var(--muted) / 0.5)',
        color: 'hsl(var(--muted-foreground))',
        border: 'none',
        borderRight: '1px solid hsl(var(--border))',
      },
      '.cm-activeLineGutter': {
        backgroundColor: 'hsl(var(--primary) / 0.1)',
      },
      '.cm-activeLine': {
        backgroundColor: 'hsl(var(--primary) / 0.05)',
      },
      '.cm-selectionBackground': {
        backgroundColor: 'hsl(var(--primary) / 0.2) !important',
      },
      '&.cm-focused .cm-selectionBackground': {
        backgroundColor: 'hsl(var(--primary) / 0.3) !important',
      },
      '.cm-cursor': {
        borderLeftColor: 'hsl(var(--foreground))',
      },
      '.cm-foldPlaceholder': {
        backgroundColor: 'hsl(var(--primary) / 0.2)',
        border: '1px solid hsl(var(--primary) / 0.4)',
        color: 'hsl(var(--primary))',
      },
      '.cm-tooltip': {
        backgroundColor: 'hsl(var(--popover))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '6px',
      },
      '.cm-tooltip-autocomplete': {
        '& > ul': {
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
          fontSize: '0.875rem',
        },
        '& > ul > li[aria-selected]': {
          backgroundColor: 'hsl(var(--primary) / 0.2)',
          color: 'hsl(var(--foreground))',
        },
      },
    },
    { dark: true }
  );

  onMount(() => {
    const extensions: Extension[] = [
      highlightSpecialChars(),
      history(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      rectangularSelection(),
      crosshairCursor(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        ...lintKeymap,
      ]),
      darkTheme,
      ...getLanguageExtension(),
    ];

    // Optional features
    if (showLineNumbers) {
      extensions.push(lineNumbers(), highlightActiveLineGutter());
    }
    if (showFoldGutter) {
      extensions.push(foldGutter());
    }
    if (lineWrapping) {
      extensions.push(EditorView.lineWrapping);
    }
    if (readonly) {
      extensions.push(EditorState.readOnly.of(true));
    }
    if (language === 'json') {
      extensions.push(lintGutter());
    }

    // Update listener
    extensions.push(
      EditorView.updateListener.of((update) => {
        if (update.docChanged && onChange) {
          onChange(update.state.doc.toString());
        }
      })
    );

    view = new EditorView({
      parent: containerEl,
      state: EditorState.create({
        doc: initialValue,
        extensions,
      }),
    });
  });

  onDestroy(() => {
    view?.destroy();
    view = null;
  });

  // Update content when value changes externally
  $effect(() => {
    const newValue = typeof value === 'function' ? value() : (value ?? '');
    if (view && view.state.doc.toString() !== newValue) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: newValue },
      });
    }
  });
</script>

<div
  class="code-editor"
  {id}
  style:height={typeof height === 'number' ? `${height}px` : height}
  bind:this={containerEl}
></div>

<style>
  .code-editor {
    border: 1px solid hsl(var(--border));
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .code-editor :global(.cm-editor) {
    height: 100%;
  }

  .code-editor :global(.cm-focused) {
    outline: 2px solid hsl(var(--ring));
    outline-offset: -2px;
  }
</style>
