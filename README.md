# Declarative UI

A framework-agnostic pattern for building UIs where **pages are data, not code**.
Components that just work. Focus on your app, not UI bugs.

**[Live Demo](https://adelost.github.io/declarative-atomic-ui/)** · [Documentation](docs/svelte-implementation.md)

## Core Concept

```typescript
// A page is just a typed object
const page: Page = {
  title: "Register Sample",
  layout: "centered",
  sections: [
    { atom: "input", id: "name", label: "Sample Name", required: true },
    { atom: "button", text: "Save", variant: "primary", onClick: sampleService.create },
  ],
};
```

**The renderer interprets the data. The page definition contains no rendering logic.**

## Installation

```bash
# npm
npm install svelte-daui @daui/core

# pnpm
pnpm add svelte-daui @daui/core
```

### Tailwind CSS Setup (Required)

svelte-daui uses Tailwind CSS with CSS variables for theming. You need to configure Tailwind to scan the package:

**1. Install Tailwind CSS** (if not already installed):
```bash
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**2. Update `tailwind.config.js`:**
```javascript
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/svelte-daui/src/**/*.{svelte,ts}',  // ← Add this line
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**3. Add CSS variables to your stylesheet:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 5.9% 10%;
  --radius: 0.5rem;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 240 5.9% 10%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 240 4.9% 83.9%;
}
```

### Basic Usage

```svelte
<script lang="ts">
  import { PageRenderer } from 'svelte-daui';
  import type { Page } from 'svelte-daui';

  const myPage: Page = {
    title: 'My Page',
    sections: [
      { atom: 'text', text: 'Hello World!', variant: 'heading' },
      { atom: 'button', text: 'Click me', onClick: () => alert('Clicked!') },
    ],
  };
</script>

<PageRenderer page={myPage} />
```

## Packages

| Package | Description |
|---------|-------------|
| `@daui/core` | Framework-agnostic types, registry, and utilities |
| `svelte-daui` | Svelte 5 components and renderers |

Components are built on [bits-ui](https://bits-ui.com) (Radix primitives) for keyboard navigation and screen reader support.

## Declarative Actions ($action)

Eliminate callback boilerplate with declarative side effects:

```typescript
{
  molecule: "form",
  id: "create-user",
  $action: {
    endpoint: "?/createUser",
    onSuccess: [
      { $event: "toast", text: "User created!" },
      { $event: "close-modal" },
      { $event: "invalidate" }
    ]
  },
  fields: [
    { atom: "input", id: "name", label: "Name" },
    { atom: "button", text: "Save", submit: true }
  ]
}
```

Available effects: `toast`, `close-modal`, `invalidate`, `redirect`, `emit` (escape hatch)

## Presets

Choose a preset based on your needs:

```typescript
import { PageRenderer, standard } from 'svelte-daui';

// Available presets:
// core     - Minimal (~25 components): buttons, inputs, modals
// standard - Recommended: core + tables + charts + tree-view
// full     - Everything: standard + chat + media
// chat     - Chat components: bubbles, input, panel
// media    - Video editing: player, timeline, tracks
```

| Preset | Atoms | Molecules | Organisms | Use case |
|--------|-------|-----------|-----------|----------|
| `core` | 24 | 13 | 6 | Minimal bundle |
| `standard` | 25 | 17 | 8 | Most apps |
| `full` | 35 | 24 | 11 | Demos, prototypes |

## Principles

1. **Pages = data.** A page file is a typed object, no logic.
2. **Atomic Design.**
   - **Atoms** - Single elements. (Button, Icon, Input)
   - **Molecules** - Display patterns. No internal state. (Stack, Form, Card, Tabs)
   - **Organisms** - Own internal state or complex behavior. (Table, Modal)
3. **No specialized code.** If a component isn't reusable, it's not an atom.
4. **New page = new object, zero new code** (if existing building blocks suffice).
5. **Callbacks = real function references.** IDE can navigate directly.
6. **No magic strings for binding.** Use stores/signals, not `bind: 'user.name'`.

## Design Pattern: Attribute Triggers Behavior

```
If an attribute exists on the object → the corresponding behavior is activated
```

This pattern applies to both UI and business logic:

| | UI | Business Logic |
|---|---|---|
| Trigger | `atom: "input"` | `degrade: true` |
| Behavior | Renders component | Runs function |
| Extension | New atom + interface | New attribute + behavior |

**Golden rule:** Data describes WHAT, the engine handles HOW.

## Project Structure (Monorepo)

```
declarative-atomic-ui/
├── packages/
│   ├── core/                 ← @daui/core
│   │   └── src/
│   │       ├── types/        ← All interfaces (framework-agnostic)
│   │       └── index.ts      ← Registry, utilities
│   │
│   └── svelte/               ← svelte-daui
│       └── src/
│           ├── atoms/        ← Input, Button, Toast, ... (35)
│           ├── molecules/    ← Form, Stack, Pagination, ... (24)
│           ├── organisms/    ← Table, Modal, Sidebar, ... (11)
│           ├── engine/       ← $action, $async, effects
│           ├── effects/      ← ToastProvider, EffectOverlay
│           ├── renderer/     ← PageRenderer, SectionRenderer
│           └── presets/      ← core, standard, full, chat, media
│
├── apps/
│   └── demo/                 ← Demo application
│       └── src/
│           ├── pages/        ← Page definitions (pure data)
│           └── stores/       ← Svelte 5 stores
│
├── CHEATSHEET.md             ← Quick syntax reference
└── pnpm-workspace.yaml
```

## Development

```bash
# Install dependencies
pnpm install

# Run demo app
pnpm dev

# Type check all packages
pnpm check

# Build all packages
pnpm build
```

## Implementations

The concept is universal. Each implementation uses its own type system:

| Framework | Package | Status |
|-----------|---------|--------|
| **Svelte 5** | `svelte-daui` | ✅ Available |
| React | `react-daui` | Planned |
| Flutter | Dart classes | Planned |

## Why This Works

- **Autocomplete** - TypeScript interfaces → IDE suggests correct properties
- **Error marking** - Typo in `atom: "inptu"` → red line immediately
- **Refactoring** - Rename `InputAtom.label` → updates in all pages
- **Go-to-definition** - Ctrl+click on `service.create` → jumps to service
- **Copyable** - New page = copy object, change data
- **Testable** - Page objects are pure data → easy to validate

## License

MIT
