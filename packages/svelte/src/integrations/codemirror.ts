/**
 * CodeMirror 6 integration for DAUI
 *
 * Provides a full-featured code editor using CodeMirror 6.
 *
 * Requires peer dependencies:
 * @example
 * ```bash
 * pnpm add @codemirror/view @codemirror/state @codemirror/language @codemirror/commands \
 *          @codemirror/search @codemirror/autocomplete @codemirror/lint \
 *          @codemirror/lang-json @codemirror/lang-javascript @codemirror/lang-markdown \
 *          @codemirror/lang-python @codemirror/lang-yaml
 * ```
 *
 * @example
 * ```typescript
 * import { register } from 'svelte-daui';
 * import { codemirror } from 'svelte-daui/integrations/codemirror';
 *
 * register(codemirror);
 * ```
 *
 * Then in a page definition:
 * ```typescript
 * {
 *   atom: 'code-editor',
 *   id: 'config',
 *   language: 'json',
 *   value: () => store.configJson,
 *   onChange: (v) => store.configJson = v,
 *   height: 400,
 * }
 * ```
 *
 * Supported languages:
 * - json (with validation)
 * - yaml
 * - typescript
 * - javascript
 * - markdown
 * - python
 * - html (basic)
 * - css (basic)
 */
import type { Preset } from '@daui/core';
import CodeEditor from './CodeEditor.svelte';

export const codemirror: Preset = {
  atoms: {
    'code-editor': CodeEditor,
  },
};

// Also export component directly for standalone use
export { CodeEditor };
