# AI Agent Context

This document helps AI assistants understand and follow the declarative-ui pattern.

## Core Principle

**Pages are data, not code.**

A page is a typed TypeScript object. The renderer interprets it. No rendering logic in page files.

## Golden Rules

### DO
- Define pages as typed objects with `atom`, `molecule`, `organism` discriminators
- Use `onChange: (value) => store.field = value` for state binding
- Keep all rendering logic in `ui/renderer/`
- Use TypeScript interfaces for type safety
- Reference real functions: `onClick: userService.create`

### DON'T
- Import `.svelte` files in page definitions
- Use magic strings like `bind: "user.name"` (loses type safety)
- Put business logic in page objects
- Create one-off components (if not reusable, it's not an atom)

## Directory Structure

```
src/
  ui/
    atoms/        → Input, Button, Select (primitives)
    molecules/    → Form, Actions, Card (groups of atoms)
    organisms/    → Table, Sidebar (complex, stateful)
    renderer/     → PageRenderer, SectionRenderer
    types/        → All interfaces
  pages/          → Page objects (pure data)
  services/       → Business logic, API calls
```

## Pattern: Attribute Triggers Behavior

```
If an attribute exists → the corresponding behavior activates
```

| Attribute | Behavior |
|-----------|----------|
| `atom: "input"` | Renders InputAtom component |
| `visible: () => boolean` | Conditional rendering (BaseAtom) |
| `value: () => T` | Reactive value getter (FormAtom<T>) |
| `onChange: (v: T) => void` | Value change handler (FormAtom<T>) |
| `validate: (v: T) => true \| string` | Validation, type matches atom (FormAtom<T>) |
| `columns: [...]` | Table renders columns |

## Type Pattern

```typescript
// Discriminated union - TypeScript narrows type based on `atom`
type Atom = InputAtom | ButtonAtom | SelectAtom | CheckboxAtom;

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

interface CheckboxAtom extends FormAtom<boolean> {
  atom: "checkbox";
  id: string;
  label: string;
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

## When Modifying This Repo

1. Keep README.md framework-agnostic
2. Framework-specific code goes in `docs/{framework}-implementation.md`
3. Tooling goes in `tooling/{framework}/`
4. Maintain TypeScript strict mode
5. Don't add features beyond what's requested

## Key Files

- `CHEATSHEET.md` - Quick syntax reference (all valid discriminators, patterns, examples)
- `README.md` - Framework-agnostic concept overview
- `docs/svelte-implementation.md` - Full Svelte 5 implementation guide
- `docs/component-catalog.md` - Extended components (Grid, Modal, Drawer, etc.)
- `tooling/svelte/` - ESLint config, VS Code snippets
