# DAUI Cheatsheet

Quick reference for declarative-ui syntax. Full docs: [svelte-implementation.md](docs/svelte-implementation.md)

<!-- SYNC: Update discriminators when adding new components to ui/types/ -->

---

## Valid Discriminators

```
ATOMS:     input, select, radio, button, upload, checkbox, date, textarea,
           badge, label, switch, icon-button, search-input, number-input,
           link, divider, text, image, avatar, progress, toast

MOLECULES: form, actions, label-value, grid, stack, tabs, menu,
           breadcrumbs, pagination, search-select, stat-card,
           timeline, alert-panel, container, stepper

ORGANISMS: table, sidebar, modal, drawer, list, card, header, footer
```

---

## Key Patterns

```typescript
// State binding (NOT magic strings like bind: "store.field")
value: () => store.field,
onChange: (v) => store.field = v

// Conditional rendering
visible: () => someCondition

// Validation (return true or error message)
validate: (v) => v.length > 0 || "Required"

// Async onClick (auto loading state)
onClick: async () => { await api.save(); }
```

---

## Examples

### Atoms

```typescript
{ atom: "input", id: "name", label: "Name", value: () => hobbit.name, onChange: (v) => hobbit.name = v }

{ atom: "button", text: "Join Fellowship", variant: "primary", onClick: () => fellowshipService.join() }

{ atom: "select", id: "race", label: "Race", options: [
  { value: "hobbit", label: "Hobbit" },
  { value: "dwarf", label: "Dwarf" },
  { value: "elf", label: "Elf" },
  { value: "wizard", label: "Wizard" },
]}

{ atom: "checkbox", id: "hasRing", label: "Carries the One Ring", value: () => member.hasRing, onChange: (v) => member.hasRing = v }

{ atom: "badge", text: "Ring-bearer", color: "gold" }
```

### Molecules

```typescript
// Fellowship registration form
{
  molecule: "form",
  id: "join-fellowship",
  fields: [
    { atom: "input", id: "name", label: "Name", required: true },
    { atom: "select", id: "race", label: "Race", options: races },
    { atom: "input", id: "homeland", label: "Homeland", placeholder: "The Shire, Rivendell, Moria..." },
  ],
  onSubmit: (values) => fellowshipService.recruit(values)
}

// Action buttons
{
  molecule: "actions",
  items: [
    { atom: "button", text: "Flee to Rivendell", variant: "secondary", onClick: () => router.push("/rivendell") },
    { atom: "button", text: "Destroy the Ring", variant: "danger", onClick: mountDoom.cast },
  ]
}
```

### Organisms

```typescript
// Fellowship leaderboard
{
  organism: "table",
  id: "fellowship-members",
  data: () => fellowshipService.getMembers(),
  columns: [
    { field: "name", header: "Name", sortable: true },
    { field: "race", header: "Race" },
    { field: "kills", header: "Orc Kills", sortable: true },
    { field: "status", header: "Status", render: (val) => ({
      atom: "badge",
      text: val,
      color: { Alive: "green", Fallen: "gray", Corrupted: "red" }[val]
    })},
  ],
  onRowClick: (member) => router.push(`/fellowship/${member.id}`)
}

// Confirmation modal
{
  organism: "modal",
  id: "destroy-ring",
  title: "Cast into Mount Doom?",
  open: () => showConfirm,
  onClose: () => showConfirm = false,
  content: [
    { atom: "text", text: "The Ring will be destroyed forever. This cannot be undone." }
  ],
  footer: [
    { atom: "button", text: "Keep it secret", variant: "secondary", onClick: () => showConfirm = false },
    { atom: "button", text: "Cast it into the fire!", variant: "danger", onClick: destroyRing },
  ]
}
```

### Leaderboard with List

```typescript
{
  organism: "list",
  id: "fellowship-rankings",
  items: () => [
    { key: "1", leading: { atom: "badge", text: "#1", color: "gold" },
      content: { molecule: "stack", direction: "vertical", gap: "none", items: [
        { atom: "text", text: "Legolas", variant: "default" },
        { atom: "text", text: "Mirkwood", variant: "muted" }
      ]},
      trailing: { atom: "text", text: "42 kills" }},
    { key: "2", leading: { atom: "badge", text: "#2", color: "gray" },
      content: { molecule: "stack", direction: "vertical", gap: "none", items: [
        { atom: "text", text: "Gimli", variant: "default" },
        { atom: "text", text: "Erebor", variant: "muted" }
      ]},
      trailing: { atom: "text", text: "41 kills" }},
  ],
  emptyText: "No fellowship members yet"
}
```

### Page

```typescript
const questPage: Page = {
  layout: "centered",
  title: "The Fellowship of the Ring",
  sections: [
    { atom: "text", text: "One does not simply walk into Mordor.", variant: "muted" },
    { organism: "table", id: "fellowship", ... },
    { molecule: "actions", items: [
      { atom: "button", text: "Begin Quest", variant: "primary", onClick: quest.begin }
    ]},
  ]
}

---

## Common Props

| Base (all) | FormAtom<T> (inputs) | Page |
|------------|---------------------|------|
| `visible?: () => boolean` | `value?: () => T` | `layout: "centered" \| "full" \| "sidebar"` |
| | `onChange?: (v: T) => void` | `title: string` |
| | `validate?: (v: T) => true \| string` | `sections: Section[]` |

---

## Don'ts

```typescript
// ❌ Magic string binding
{ atom: "input", bind: "store.name" }

// ❌ Import .svelte in pages
import Component from "./Component.svelte"

// ❌ Rendering logic in page objects
{ atom: "input", render: () => <input /> }

// ❌ Non-reusable atoms
// If it's not reusable, it's not an atom
```

---

## More Info

- **Full implementation guide:** [docs/svelte-implementation.md](docs/svelte-implementation.md)
- **Extended components:** [docs/component-catalog.md](docs/component-catalog.md)
- **AI agent context:** [AGENTS.md](AGENTS.md)
