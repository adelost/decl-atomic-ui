import type { Page } from 'svelte-daui';

/**
 * Code Components Demo
 *
 * Showcases CodeBlock (Shiki) and CodeEditor (CodeMirror) components
 */

// Sample code snippets
const typescriptCode = `import type { Page } from 'svelte-daui';

interface User {
  id: string;
  name: string;
  email: string;
}

export const userPage: Page = {
  layout: 'centered',
  title: 'User Profile',
  sections: [
    {
      atom: 'input',
      id: 'name',
      label: 'Name',
      value: () => user.name,
      onChange: (v) => user.name = v,
    },
  ],
};`;

const jsonCode = `{
  "name": "declarative-ui",
  "version": "1.0.0",
  "dependencies": {
    "svelte": "^5.0.0",
    "@daui/core": "^0.1.0"
  },
  "scripts": {
    "dev": "vite dev",
    "build": "vite build"
  }
}`;

const yamlCode = `name: CI Pipeline
on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test`;

const pythonCode = `from dataclasses import dataclass
from typing import List

@dataclass
class User:
    id: str
    name: str
    email: str

def get_active_users(users: List[User]) -> List[User]:
    """Filter and return only active users."""
    return [u for u in users if u.is_active]

if __name__ == "__main__":
    users = load_users()
    active = get_active_users(users)
    print(f"Found {len(active)} active users")`;

const markdownCode = `# DAUI - Declarative Atomic UI

A **declarative** approach to building user interfaces.

## Features

- 🎯 Type-safe page definitions
- 🧱 Atomic Design principles
- ⚡ Svelte 5 powered

## Quick Start

\`\`\`bash
pnpm add svelte-daui @daui/core
\`\`\`

> Pages are data, not code.`;

const svelteCode = `<script lang="ts">
  import { PageRenderer } from 'svelte-daui';
  import { myPage } from './pages/my-page';
</script>

<PageRenderer page={myPage} />

<style>
  :global(body) {
    font-family: system-ui, sans-serif;
  }
</style>`;

// Editable state
let editableJson = $state(jsonCode);
let editableTs = $state(`// Try editing this TypeScript code!
const greeting: string = "Hello, World!";

interface Props {
  name: string;
  age: number;
}

function greet(props: Props): string {
  return \`Hello, \${props.name}!\`;
}`);

export const codePage: Page = {
  layout: 'full',
  title: 'Code Components',
  sections: [
    {
      molecule: 'stack',
      direction: 'vertical',
      gap: 'sm',
      padding: 'md',
      items: [
        { atom: 'text', variant: 'heading', text: 'Code Components' },
        {
          atom: 'text',
          variant: 'muted',
          text: 'Display and edit code with syntax highlighting',
        },
      ],
    },
    {
      molecule: 'tabs',
      id: 'code-tabs',
      tabs: [
        {
          id: 'display',
          label: 'Code Display (Shiki)',
          content: [
            {
              molecule: 'stack',
              direction: 'vertical',
              gap: 'lg',
              padding: 'md',
              items: [
                // TypeScript example
                {
                  organism: 'card',
                  header: { atom: 'text', variant: 'heading', text: 'TypeScript' },
                  content: [
                    {
                      atom: 'text',
                      variant: 'muted',
                      text: 'Page definition with type safety',
                    },
                    {
                      atom: 'code-block',
                      code: typescriptCode,
                      language: 'typescript',
                      showLineNumbers: true,
                      highlightLines: [3, 4, 5, 6],
                      maxHeight: 350,
                    },
                  ],
                },
                // JSON example
                {
                  organism: 'card',
                  header: { atom: 'text', variant: 'heading', text: 'JSON' },
                  content: [
                    {
                      atom: 'text',
                      variant: 'muted',
                      text: 'Package configuration',
                    },
                    {
                      atom: 'code-block',
                      code: jsonCode,
                      language: 'json',
                      showLineNumbers: true,
                    },
                  ],
                },
                // Side by side: YAML and Python
                {
                  molecule: 'grid',
                  columns: 2,
                  gap: 'md',
                  items: [
                    {
                      organism: 'card',
                      header: { atom: 'text', variant: 'heading', text: 'YAML' },
                      content: [
                        {
                          atom: 'text',
                          variant: 'muted',
                          text: 'CI/CD pipeline',
                        },
                        {
                          atom: 'code-block',
                          code: yamlCode,
                          language: 'yaml',
                          showLineNumbers: true,
                          maxHeight: 280,
                        },
                      ],
                    },
                    {
                      organism: 'card',
                      header: { atom: 'text', variant: 'heading', text: 'Python' },
                      content: [
                        {
                          atom: 'text',
                          variant: 'muted',
                          text: 'Data processing script',
                        },
                        {
                          atom: 'code-block',
                          code: pythonCode,
                          language: 'python',
                          showLineNumbers: true,
                          maxHeight: 280,
                        },
                      ],
                    },
                  ],
                },
                // Markdown and Svelte
                {
                  molecule: 'grid',
                  columns: 2,
                  gap: 'md',
                  items: [
                    {
                      organism: 'card',
                      header: { atom: 'text', variant: 'heading', text: 'Markdown' },
                      content: [
                        {
                          atom: 'text',
                          variant: 'muted',
                          text: 'Documentation',
                        },
                        {
                          atom: 'code-block',
                          code: markdownCode,
                          language: 'markdown',
                          showLineNumbers: false,
                        },
                      ],
                    },
                    {
                      organism: 'card',
                      header: { atom: 'text', variant: 'heading', text: 'Svelte' },
                      content: [
                        {
                          atom: 'text',
                          variant: 'muted',
                          text: 'Component template',
                        },
                        {
                          atom: 'code-block',
                          code: svelteCode,
                          language: 'svelte',
                          showLineNumbers: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'editor',
          label: 'Code Editor (CodeMirror)',
          content: [
            {
              molecule: 'stack',
              direction: 'vertical',
              gap: 'lg',
              padding: 'md',
              items: [
                {
                  atom: 'text',
                  variant: 'muted',
                  text: 'Full-featured code editor with syntax highlighting, auto-completion, and validation',
                },
                // JSON Editor with validation
                {
                  organism: 'card',
                  header: { atom: 'text', variant: 'heading', text: 'JSON Editor' },
                  content: [
                    {
                      atom: 'text',
                      variant: 'muted',
                      text: 'Edit JSON with real-time validation. Try adding a syntax error!',
                    },
                    {
                      atom: 'code-editor',
                      id: 'json-editor',
                      language: 'json',
                      value: () => editableJson,
                      onChange: (v: string) => (editableJson = v),
                      height: 300,
                    },
                  ],
                },
                // TypeScript Editor
                {
                  organism: 'card',
                  header: { atom: 'text', variant: 'heading', text: 'TypeScript Editor' },
                  content: [
                    {
                      atom: 'text',
                      variant: 'muted',
                      text: 'Edit TypeScript with syntax highlighting and bracket matching',
                    },
                    {
                      atom: 'code-editor',
                      id: 'ts-editor',
                      language: 'typescript',
                      value: () => editableTs,
                      onChange: (v: string) => (editableTs = v),
                      height: 350,
                    },
                  ],
                },
                // Readonly example
                {
                  organism: 'card',
                  header: { atom: 'text', variant: 'heading', text: 'Readonly Mode' },
                  content: [
                    {
                      atom: 'text',
                      variant: 'muted',
                      text: 'CodeEditor can also be used in readonly mode for viewing code',
                    },
                    {
                      atom: 'code-editor',
                      id: 'readonly-editor',
                      language: 'python',
                      value: () => pythonCode,
                      readonly: true,
                      height: 250,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'showcase',
          label: 'Live Showcase',
          content: [
            {
              molecule: 'stack',
              direction: 'vertical',
              gap: 'lg',
              padding: 'md',
              items: [
                {
                  atom: 'text',
                  variant: 'muted',
                  text: 'See the code that generates this page - edit it and watch the changes!',
                },
                {
                  molecule: 'grid',
                  columns: 2,
                  gap: 'md',
                  items: [
                    {
                      organism: 'card',
                      header: { atom: 'text', variant: 'heading', text: 'Page Definition' },
                      content: [
                        {
                          atom: 'code-block',
                          code: `// This page is defined as a TypeScript object
export const codePage: Page = {
  layout: 'full',
  title: 'Code Components',
  sections: [
    {
      molecule: 'tabs',
      id: 'code-tabs',
      tabs: [
        { id: 'display', label: 'Code Display', content: [...] },
        { id: 'editor', label: 'Code Editor', content: [...] },
      ],
    },
  ],
};`,
                          language: 'typescript',
                          showLineNumbers: true,
                        },
                      ],
                    },
                    {
                      organism: 'card',
                      header: { atom: 'text', variant: 'heading', text: 'Usage' },
                      content: [
                        {
                          atom: 'code-block',
                          code: `// Register the integrations
import { shiki, codemirror } from 'svelte-daui/integrations';
register(shiki, codemirror);

// Use in your page
{
  atom: 'code-block',
  code: myCode,
  language: 'typescript',
}

{
  atom: 'code-editor',
  id: 'editor',
  language: 'json',
  value: () => state.json,
  onChange: (v) => state.json = v,
}`,
                          language: 'typescript',
                          showLineNumbers: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
