# AI Agent Context

This document helps AI assistants understand and follow the declarative-ui pattern.

## Core Principle

**Pages are data, not code.**

A page is a typed TypeScript object. The renderer interprets it. No rendering logic in page files.

## Golden Rules

### DO
- Define pages as typed objects with `atom`, `molecule`, `organism` discriminators
- Use `onChange: (value) => store.field = value` for state binding
- Keep all rendering logic in `packages/svelte/src/renderer/`
- Use TypeScript interfaces for type safety
- Reference real functions: `onClick: userService.create`

### DON'T
- Import `.svelte` files in page definitions
- Use magic strings like `bind: "user.name"` (loses type safety)
- Put business logic in page objects
- Create one-off components (if not reusable, it's not an atom)

## Project Structure

```
declarative-atomic-ui/
├── packages/
│   ├── core/                    ← @daui/core (framework-agnostic)
│   │   └── src/
│   │       ├── types/           ← All TypeScript interfaces
│   │       │   ├── index.ts     ← Component types
│   │       │   └── action.ts    ← $action, $async types
│   │       └── index.ts         ← Registry, utilities
│   │
│   └── svelte/                  ← svelte-daui (Svelte 5 implementation)
│       └── src/
│           ├── atoms/           ← Input, Button, Toast, ... (35)
│           ├── molecules/       ← Form, Stack, Pagination, ... (24)
│           ├── organisms/       ← Table, Modal, Sidebar, ... (11)
│           ├── engine/          ← $action, $async handlers, effect registry
│           ├── effects/         ← ToastProvider, EffectOverlay
│           ├── renderer/        ← PageRenderer, SectionRenderer
│           └── presets/         ← core, standard, full, chat, media
│
├── apps/
│   └── demo/                    ← Demo application
│       └── src/
│           ├── pages/           ← Page definitions (pure data)
│           │   ├── components/  ← Showcase split by category
│           │   └── examples/    ← Example pages (incl. Tools & Effects)
│           └── stores/          ← Svelte stores (state management)
│
├── CHEATSHEET.md                ← Quick syntax reference
├── AGENTS.md                    ← This file
└── README.md                    ← Project overview
```

## Presets

Choose the right preset for bundle size optimization:

| Preset | Components | Use case |
|--------|------------|----------|
| `core` | ~20 atoms, ~10 molecules, ~4 organisms | Minimal apps |
| `standard` | core + table + charts + tree-view | Most apps (recommended) |
| `full` | standard + chat + media | Demos, prototypes |
| `chat` | chat-bubble, chat-input, chat-panel, ... | Chat features |
| `media` | video-player, video-timeline, tracks | Video editing |

## Pattern: Attribute Triggers Behavior

```
If an attribute exists → the corresponding behavior activates
```

| Attribute | Behavior |
|-----------|----------|
| `atom: "input"` | Renders InputAtom component |
| `visible: () => boolean` | Conditional rendering |
| `value: () => T` | Reactive value getter |
| `onChange: (v: T) => void` | Value change handler |
| `validate: (v: T) => true \| string` | Validation |
| `$action: {...}` | Declarative form/button actions with side effects |
| `columns: [...]` | Table renders columns |
| `slides: [...]` | SlideModal renders slides |

## Declarative Actions ($action)

Forms and buttons support declarative side effects via `$action`:

```typescript
{
  molecule: "form",
  $action: {
    endpoint: "?/save",
    onSuccess: [
      { $event: "toast", text: "Saved!" },
      { $event: "close-modal" },
      { $event: "invalidate" }
    ],
    onError: [
      { $event: "toast", text: "Error", variant: "error" }
    ]
  },
  fields: [...]
}
```

Available side effects:
- `toast` - Show notification
- `close-modal` - Close current modal
- `invalidate` - Refresh page data
- `redirect` - Navigate to URL
- `emit` - Custom event (escape hatch for complex cases)

## Effects System

For toasts and visual effects, add providers to layout:

```svelte
<script>
  import { ToastProvider, EffectOverlay } from 'svelte-daui';
</script>

<ToastProvider position="bottom-right" />
<EffectOverlay />
<slot />
```

Custom effect handlers can be registered:
```typescript
import { registerEffect } from 'svelte-daui';
registerEffect('my-effect', (e) => { /* handle */ });
```

## Type Pattern

```typescript
// Discriminated union - TypeScript narrows type based on discriminator
type Atom = InputAtom | ButtonAtom | ChatBubbleAtom | ...;

// Base interfaces
interface BaseAtom {
  visible?: () => boolean;
}

interface FormAtom<T> extends BaseAtom {
  value?: () => T;
  onChange?: (value: T) => void;
  validate?: (value: T) => true | string;
}

// Form atoms extend FormAtom<T> with their value type
interface InputAtom extends FormAtom<string> {
  atom: "input";        // ← discriminator
  id: string;
  label?: string;
}

// Non-form atoms extend BaseAtom directly
interface ButtonAtom extends BaseAtom {
  atom: "button";
  text: string;
  onClick?: () => void;
}
```

## State Binding (Correct Way)

```typescript
// CORRECT - explicit, type-safe
{
  atom: "input",
  id: "name",
  label: "Name",
  value: () => userStore.name,
  onChange: (v) => userStore.name = v
}

// WRONG - magic string, loses type safety
{
  atom: "input",
  bind: "userStore.name"  // ← Don't do this
}
```

## Showcase Page Organization

The component showcase (`apps/demo/src/pages/components.ts`) is split for maintainability:

```
pages/
├── components.ts              ← Main file, assembles tabs
└── components/
    ├── index.ts               ← Re-exports
    ├── atoms.ts               ← ~400 lines
    ├── molecules.ts           ← ~350 lines
    ├── organisms.ts           ← ~250 lines
    └── extensions.ts          ← ~220 lines

stores/
└── showcase.svelte.ts         ← Shared demo state
```

This pattern (Store + Section arrays) can be reused for large page definitions.

## When Modifying This Repo

1. Add new component types to `packages/core/src/types/index.ts`
2. Implement Svelte component in appropriate folder (atoms/molecules/organisms)
3. Register in relevant preset(s)
4. Export from `packages/svelte/src/index.ts`
5. Add showcase example in `apps/demo/src/pages/components/`
6. Update CHEATSHEET.md discriminator list

## Key Files

- `CHEATSHEET.md` - Quick syntax reference (all discriminators, patterns)
- `README.md` - Project overview and installation
- `packages/core/src/types/index.ts` - All TypeScript interfaces
- `packages/svelte/src/presets/` - Component bundles
- `docs/svelte-implementation.md` - Full Svelte 5 implementation guide
