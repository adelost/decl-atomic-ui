# Declarative UI

A framework-agnostic pattern for building UIs where **pages are data, not code**.

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

## Principles

1. **Pages = Data**:A page file is a typed object, no logic
2. **Atomic Design**:Atoms, molecules, organisms. Nothing else.
3. **No specialized code**:If a component isn't reusable, it's not an atom
4. **New page = new object, zero new code** (if existing building blocks suffice)
5. **Callbacks = real function references**:IDE can navigate directly
6. **No magic strings for binding**:Use stores/signals, not `bind: 'user.name'`

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

## Implementations

The concept is universal. Each implementation uses its own type system:

| Framework | Types | Status |
|-----------|-------|--------|
| **Svelte 5** | TypeScript interfaces | [Available](docs/svelte-implementation.md) |
| React | TypeScript interfaces | Planned |
| Flutter | Dart classes | Planned |

## Why This Works

- **Autocomplete**:TypeScript interfaces → IDE suggests correct properties
- **Error marking**:Typo in `atom: "inptu"` → red line immediately
- **Refactoring**:Rename `InputAtom.label` → updates in all pages
- **Go-to-definition**:Ctrl+click on `service.create` → jumps to service
- **Copyable**:New page = copy object, change data
- **Testable**:Page objects are pure data → easy to validate

## Structure

```
src/
  ui/
    atoms/        → Input, Button, Select, ...
    molecules/    → Form, Actions, Card, ...
    organisms/    → Table, Sidebar, ...
    renderer/     → PageRenderer, SectionRenderer (framework-specific)
    types/        → All interfaces (portable)
  pages/          → Page objects (portable)
  services/       → Business logic, API calls
```

**Only `ui/renderer/` is framework-specific.** Everything else transfers.

## License

MIT
