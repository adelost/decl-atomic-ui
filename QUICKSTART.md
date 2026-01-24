# Quick Start Checklist

A step-by-step guide to understanding and using the declarative-ui pattern.

---

## 1. Understand the Core Concept (2 min)

- [ ] **Read:** [README.md](./README.md)
- [ ] **Understand:** "Pages are data, not code"
- [ ] **Key insight:** A page is a typed TypeScript object. The renderer interprets it.

```typescript
// This is a page - just data
const page: Page = {
  title: "Register Sample",
  sections: [
    { atom: "input", id: "name", label: "Name" },
    { atom: "button", text: "Save", onClick: sampleService.create },
  ],
};
```

---

## 2. Learn the Component Hierarchy

| Level | What it is | Examples | Has own data? |
|-------|------------|----------|---------------|
| **Atom** | Primitive UI element | Input, Button, Badge, Label | No |
| **Molecule** | Group of atoms | Form, Card, Actions | No |
| **Organism** | Complex, owns data/flow | Table, Modal, Sidebar | Yes |

**Quick test:**
- Has `data: () => Promise<T[]>`? → Organism
- Handles pagination/sorting/routing? → Organism
- Just groups atoms without state? → Molecule
- Single primitive element? → Atom

---

## 3. Understand the Type System

- [ ] **Discriminated unions:** `atom: "input"` tells TypeScript which interface applies
- [ ] **BaseAtom:** All atoms have `visible?: () => boolean`
- [ ] **FormAtom<T>:** Form fields extend this with typed `value`, `onChange`, `validate`

```typescript
// FormAtom<T> gives you typed value binding
interface InputAtom extends FormAtom<string> { ... }
interface CheckboxAtom extends FormAtom<boolean> { ... }
interface DateAtom extends FormAtom<Date | string | null> { ... }
```

---

## 4. State Binding Pattern

- [ ] **Use functions for reactivity:** `value: () => T`, not `value: T`
- [ ] **Explicit onChange:** `onChange: (v) => store.field = v`
- [ ] **No magic strings:** Never use `bind: "store.field"`

```typescript
// ✅ CORRECT - explicit, type-safe
{
  atom: "input",
  id: "name",
  value: () => userStore.name,
  onChange: (v) => userStore.name = v,
  validate: (v) => v.length > 0 || "Name is required"
}

// ❌ WRONG - magic string, loses type safety
{
  atom: "input",
  bind: "userStore.name"
}
```

---

## 5. Create Your First Page

- [ ] Create a file in `src/pages/`
- [ ] Export a typed `Page` object
- [ ] Use atoms, molecules, organisms from the type system

```typescript
// src/pages/samplePage.ts
import type { Page } from "../ui/types";
import { sampleStore } from "../stores/sampleStore";
import { sampleService } from "../services/sampleService";

export const samplePage: Page = {
  title: "Register Sample",
  layout: "centered",
  sections: [
    {
      molecule: "form",
      id: "sample-form",
      onSubmit: sampleService.create,
      fields: [
        { atom: "input", id: "name", label: "Sample Name", required: true },
        { atom: "select", id: "type", label: "Type", options: sampleStore.typeOptions },
      ],
    },
    {
      molecule: "actions",
      items: [
        { atom: "button", text: "Cancel", variant: "secondary", onClick: () => history.back() },
        { atom: "button", text: "Save", variant: "primary", submit: true },
      ],
    },
  ],
};
```

---

## 6. Set Up Tooling (Optional)

- [ ] **VS Code snippets:** Copy `tooling/svelte/snippets.code-snippets` to `.vscode/`
- [ ] **ESLint:** Copy `tooling/svelte/eslintrc.example.cjs` rules to your config

**Useful snippets:**
- `atom-input` → Input with value binding
- `atom-button` → Button
- `mol-form` → Form molecule
- `org-table` → Table organism
- `col-actions` → Table column with row actions

---

## 7. Directory Structure

```
src/
  ui/
    atoms/        → Input.svelte, Button.svelte, ...
    molecules/    → Form.svelte, Card.svelte, ...
    organisms/    → Table.svelte, Modal.svelte, ...
    renderer/     → PageRenderer.svelte, SectionRenderer.svelte
    types/        → atoms.ts, molecules.ts, organisms.ts
  pages/          → samplePage.ts, userPage.ts, ...
  services/       → sampleService.ts, userService.ts, ...
  stores/         → sampleStore.ts, userStore.ts, ...
```

**Rules:**
- `pages/` contains only typed objects - no `.svelte` imports
- `ui/renderer/` is the only place with rendering logic
- `services/` handles API calls and business logic

---

## 8. Extend with More Components

- [ ] **See:** [docs/component-catalog.md](./docs/component-catalog.md)
- [ ] **Available:** Modal, Drawer, Toast, Tabs, Menu, Stepper, Header, Footer, etc.

---

## 9. Golden Rules Summary

| DO | DON'T |
|----|-------|
| Pages as typed objects | Import .svelte in pages |
| `onChange: (v) => store.x = v` | `bind: "store.x"` |
| Functions for reactivity | Static values for dynamic data |
| Real function references | Magic strings for callbacks |
| Reusable atoms only | One-off components |

---

## 10. Resources

- [Full Svelte Implementation Guide](./docs/svelte-implementation.md)
- [Extended Component Catalog](./docs/component-catalog.md)
- [AI Agent Context](./AGENTS.md)
