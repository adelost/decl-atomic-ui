# DAUI Cheatsheet

Quick reference for declarative-ui syntax. Full docs: [svelte-implementation.md](docs/svelte-implementation.md)

<!-- SYNC: Update discriminators when adding new components to ui/types/ -->

---

## Valid Discriminators

```
ATOMS:     input, select, radio, button, upload, checkbox, date, textarea,
           badge, label, switch, icon-button, search-input, number-input,
           link, divider, text, image, avatar, progress, toast, chart,
           icon, spinner, slider, skeleton

MOLECULES: form, actions, label-value, grid, stack, tabs, menu,
           breadcrumbs, pagination, search-select, stat-card,
           timeline, alert-panel, container, stepper, tooltip,
           popover, accordion, alert-dialog, combobox, context-menu,
           scroll-area

ORGANISMS: table, sidebar, modal, drawer, list, card, header, footer,
           command, tree-view
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

### Atoms - Single elements

```typescript
{ atom: "input", id: "name", label: "Name", value: () => user.name, onChange: (v) => user.name = v }

{ atom: "button", text: "Save", variant: "primary", onClick: () => projectService.save() }

{ atom: "select", id: "role", label: "Role", options: [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
]}

{ atom: "checkbox", id: "notify", label: "Send email notifications", value: () => prefs.notify, onChange: (v) => prefs.notify = v }

{ atom: "badge", text: "Pro", color: "gold" }
```

### Molecules - Display patterns, no internal state (`items`, `fields`, `tabs`)

```typescript
// User registration form
{
  molecule: "form",
  id: "create-user",
  fields: [
    { atom: "input", id: "name", label: "Name", required: true },
    { atom: "input", id: "email", label: "Email", type: "email", required: true },
    { atom: "select", id: "role", label: "Role", options: roles },
  ],
  onSubmit: (values) => userService.create(values)
}

// Action buttons
{
  molecule: "actions",
  items: [
    { atom: "button", text: "Cancel", variant: "secondary", onClick: () => router.back() },
    { atom: "button", text: "Create user", variant: "primary", submit: true },
  ]
}
```

### Organisms - Own internal state or complex behavior (`content`)

```typescript
// Team members table
{
  organism: "table",
  id: "team-members",
  data: () => teamService.getMembers(),
  columns: [
    { field: "name", header: "Name", sortable: true },
    { field: "role", header: "Role" },
    { field: "contributions", header: "Contributions", sortable: true },
    { field: "status", header: "Status", render: (val) => ({
      atom: "badge",
      text: val,
      color: { Active: "green", Away: "yellow", Legendary: "gold" }[val]
    })},
  ],
  onRowClick: (member) => router.push(`/team/${member.id}`)
}

// Confirmation modal
{
  organism: "modal",
  id: "confirm-delete",
  title: "Delete project?",
  open: () => showConfirm,
  onClose: () => showConfirm = false,
  content: [
    { atom: "text", text: "This action cannot be undone. The project and all its data will be permanently removed." }
  ],
  footer: [
    { atom: "button", text: "Cancel", variant: "secondary", onClick: () => showConfirm = false },
    { atom: "button", text: "Delete", variant: "danger", onClick: handleDelete },
  ]
}
```

### Leaderboard with List

```typescript
// Example data: Ada Lovelace, Grace Hopper, Linus Torvalds, Margaret Hamilton
{
  molecule: "list",
  id: "top-contributors",
  items: () => [
    { key: "1", leading: { atom: "badge", text: "#1", color: "gold" },
      content: { molecule: "stack", direction: "vertical", gap: "none", items: [
        { atom: "text", text: "Ada Lovelace", variant: "default" },
        { atom: "text", text: "Algorithms", variant: "muted" }
      ]},
      trailing: { atom: "text", text: "1842 pts" }},
    { key: "2", leading: { atom: "badge", text: "#2", color: "gray" },
      content: { molecule: "stack", direction: "vertical", gap: "none", items: [
        { atom: "text", text: "Grace Hopper", variant: "default" },
        { atom: "text", text: "Compilers", variant: "muted" }
      ]},
      trailing: { atom: "text", text: "1952 pts" }},
  ],
  emptyText: "No contributors yet"
}
```

### Page

```typescript
const teamPage: Page = {
  layout: "full",
  title: "Team",
  sections: [
    { atom: "text", text: "Manage your team members and their roles.", variant: "muted" },
    { organism: "table", id: "team-members", ... },
    { molecule: "actions", items: [
      { atom: "button", text: "Invite member", variant: "primary", onClick: openInviteModal }
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
