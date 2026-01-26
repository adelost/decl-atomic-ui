# DAUI Cheatsheet

Quick reference for declarative-ui syntax. Full docs: [svelte-implementation.md](docs/svelte-implementation.md)

---

## Presets

```typescript
import { PageRenderer, core, standard, full, chat, media } from 'svelte-daui';

// Choose based on your needs:
// core     - Minimal (~80KB): buttons, inputs, modals
// standard - Recommended: core + tables + charts + tree-view
// full     - Everything: standard + chat + media (for demos)
// chat     - Chat components only
// media    - Video/timeline components only
```

---

## All Discriminators

<!-- SYNC: Update when adding new components -->

```
ATOMS (35):
  Core:    avatar, badge, button, checkbox, divider, icon, icon-button,
           image, input, number-input, popover, progress, radio-group,
           select, skeleton, slider, spinner, switch, text, tooltip
  Charts:  chart
  Chat:    chat-bubble, typing-indicator
  Media:   playhead, track-marker, track-segment, detection-box, pose-skeleton
  Canvas:  three-canvas, matter-canvas (manual import)
  Other:   link, search-input, textarea, toast

MOLECULES (24):
  Core:    accordion, alert-panel, dropdown-menu, form, grid, list,
           page-header, showcase, stack, tabs
  Table:   filter-bar, search-select
  Charts:  stat-card, tag-cloud
  Chat:    chat-input, chat-header, chat-messages-list
  Media:   data-point, frame-controls, speed-control, track
  Other:   breadcrumbs, container, pagination

ORGANISMS (11):
  Core:    alert-dialog, card, modal, slide-modal
  Table:   table
  Standard: tree-view
  Chat:    chat-panel
  Media:   video-player, video-timeline
  Other:   header, sidebar
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
// Input with two-way binding
{ atom: "input", id: "name", label: "Name",
  value: () => user.name, onChange: (v) => user.name = v }

// Button with click handler
{ atom: "button", text: "Save", variant: "primary",
  onClick: () => projectService.save() }

// Select dropdown
{ atom: "select", id: "role", label: "Role", options: [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
]}

// Number input with min/max
{ atom: "number-input", id: "quantity", label: "Qty",
  min: 0, max: 100, step: 1,
  value: () => cart.quantity, onChange: (v) => cart.quantity = v }

// Badges
{ atom: "badge", text: "Active", color: "green" }
{ atom: "badge", text: "Pro", color: "gold" }

// Chat bubble
{ atom: "chat-bubble", content: "Hello!",
  author: { name: "Bot", avatar: "https://..." },
  variant: "assistant", timestamp: Date.now() }

// Typing indicator
{ atom: "typing-indicator", author: { name: "Alice" }, size: "md" }
```

### Molecules - Display patterns (`items`, `fields`, `tabs`)

```typescript
// Form with validation
{
  molecule: "form",
  id: "register",
  onSubmit: (values) => userService.create(values),
  fields: [
    { atom: "input", id: "name", label: "Name", required: true },
    { atom: "input", id: "email", label: "Email", type: "email" },
    { atom: "button", text: "Register", variant: "primary", submit: true },
  ],
}

// Horizontal stack
{
  molecule: "stack",
  direction: "horizontal",
  gap: "md",
  items: [
    { atom: "badge", text: "Tag 1", color: "blue" },
    { atom: "badge", text: "Tag 2", color: "green" },
  ],
}

// Tabs
{
  molecule: "tabs",
  id: "settings",
  tabs: [
    { id: "general", label: "General", content: [...] },
    { id: "security", label: "Security", content: [...] },
  ],
}

// Dropdown menu
{
  molecule: "dropdown-menu",
  trigger: [{ atom: "button", text: "Actions" }],
  items: [
    { id: "edit", label: "Edit", icon: "pencil" },
    { type: "separator" },
    { id: "delete", label: "Delete", icon: "trash", destructive: true },
  ],
}

// Filter bar
{
  molecule: "filter-bar",
  search: { id: "search", placeholder: "Search...",
    value: () => filters.search, onChange: (v) => filters.search = v },
  filters: [
    { id: "status", label: "Status", value: () => filters.status,
      onChange: (v) => filters.status = v,
      options: [{ value: "all", label: "All" }, { value: "active", label: "Active" }] },
  ],
}

// Chat input
{
  molecule: "chat-input",
  id: "message",
  placeholder: "Type a message...",
  onSend: (msg) => chatService.send(msg),
  maxLength: 500,
  showCharCount: true,
}

// Chat messages list
{
  molecule: "chat-messages-list",
  id: "messages",
  messages: () => chatStore.messages,
  currentUserId: "user-1",
  showTimestamps: true,
  typingIndicator: () => chatStore.typingUser,
}
```

### Organisms - Complex components with state (`content`)

```typescript
// Data table
{
  organism: "table",
  id: "users",
  data: () => userService.getAll(),
  searchable: true,
  searchKeys: ["name", "email"],
  columns: [
    { field: "name", header: "Name", sortable: true },
    { field: "email", header: "Email" },
    { field: "status", header: "Status",
      render: (v) => ({ atom: "badge", text: v, color: v === "Active" ? "green" : "gray" }) },
  ],
  onRowClick: (user) => router.push(`/users/${user.id}`),
}

// Modal
{
  organism: "modal",
  id: "edit-user",
  title: "Edit User",
  open: () => showModal,
  onClose: () => showModal = false,
  content: [
    { atom: "input", id: "name", label: "Name", value: () => user.name },
  ],
  footer: [
    { atom: "button", text: "Cancel", variant: "secondary", onClick: () => showModal = false },
    { atom: "button", text: "Save", variant: "primary", onClick: handleSave },
  ],
}

// Alert dialog (confirmation)
{
  organism: "alert-dialog",
  open: () => showConfirm,
  onOpenChange: (open) => showConfirm = open,
  title: "Delete item?",
  description: "This action cannot be undone.",
  cancelLabel: "Cancel",
  confirmLabel: "Delete",
  variant: "danger",
  onConfirm: handleDelete,
}

// Slide modal (achievements, onboarding)
{
  organism: "slide-modal",
  id: "achievements",
  open: () => showAchievements,
  onClose: () => showAchievements = false,
  variant: "celebration",  // or "onboarding"
  slides: [
    { id: "1", header: "ACHIEVEMENT!", icon: "🏆", title: "First Win",
      subtitle: "You completed your first task", badge: "+50p", theme: "gold" },
    { id: "2", header: "LEVEL UP!", icon: "2", title: "Level 2",
      subtitle: "Level 1 › Level 2", theme: "cyan" },
  ],
  nextText: "Awesome!",
  closeText: "Done!",
}

// Chat panel (complete chat UI)
{
  organism: "chat-panel",
  id: "support",
  title: "Support Chat",
  avatar: { name: "Bot", avatar: "https://..." },
  status: () => chatStore.status,
  messages: () => chatStore.messages,
  currentUserId: "user-1",
  onSend: (msg) => chatStore.send(msg),
  placeholder: "Ask a question...",
  height: 400,
  variant: "floating",
}

// Tree view (skill trees, org charts)
{
  organism: "tree-view",
  id: "skills",
  nodes: [
    { id: "root", title: "Basics", icon: "book", status: () => "completed" },
    { id: "adv", title: "Advanced", icon: "star", parent: "root", status: () => "available" },
    { id: "expert", title: "Expert", icon: "trophy", parent: "adv", status: () => "locked" },
  ],
  onNodeClick: (node) => unlockNode(node.id),
}

// Video player
{
  organism: "video-player",
  id: "player",
  src: "https://example.com/video.mp4",
  currentTime: () => videoStore.time,
  onTimeUpdate: (t) => videoStore.time = t,
  playing: () => videoStore.playing,
  onPlayPause: (p) => videoStore.playing = p,
  controls: true,
}

// Video timeline
{
  organism: "video-timeline",
  id: "timeline",
  duration: () => 120,
  currentTime: () => videoStore.time,
  onSeek: (t) => videoStore.time = t,
  tracks: [
    { id: "video", label: "Video", type: "segments", color: "blue",
      data: () => [{ id: "v1", start: 0, end: 30, label: "Intro" }] },
    { id: "markers", label: "Markers", type: "markers", color: "yellow",
      data: () => [{ id: "m1", start: 15, label: "Cut" }] },
  ],
}
```

### Page Structure

```typescript
const myPage: Page = {
  layout: "full",        // "centered" | "full" | "sidebar"
  title: "Dashboard",
  sections: [
    { molecule: "page-header", title: "Dashboard", subtitle: "Overview" },
    { organism: "table", id: "data", ... },
    { molecule: "stack", direction: "horizontal", items: [...] },
  ],
}
```

---

## Common Props

| Base (all) | FormAtom<T> (inputs) | Page |
|------------|---------------------|------|
| `visible?: () => boolean` | `value?: () => T` | `layout: "centered" \| "full"` |
| `id?: string` | `onChange?: (v: T) => void` | `title: string` |
| | `validate?: (v: T) => true \| string` | `sections: Section[]` |
| | `disabled?: boolean` | `shortcuts?: Shortcut[]` |

---

## Slide Themes

For `slide-modal` slides:

| Theme | Color | Use case |
|-------|-------|----------|
| `default` | Blue | General |
| `gold` | Amber | Achievements, rewards |
| `cyan` | Teal | Level ups, progress |
| `green` | Green | Success, completion |
| `purple` | Violet | Special, rare |

---

## Declarative Actions ($action)

```typescript
// Form with declarative side effects - no callbacks needed!
{
  molecule: "form",
  id: "create-user",
  $action: {
    endpoint: "?/createUser",
    onPending: [{ $event: "toast", text: "Saving...", variant: "info" }],
    onSuccess: [
      { $event: "toast", text: "User created!" },
      { $event: "close-modal" },
      { $event: "invalidate" }
    ],
    onError: [{ $event: "toast", text: "Failed to save", variant: "error" }]
  },
  fields: [
    { atom: "input", id: "name", label: "Name" },
    { atom: "button", text: "Save", variant: "primary", submit: true }
  ]
}

// Button with $action
{
  atom: "button",
  text: "Delete",
  variant: "danger",
  $action: {
    endpoint: "?/delete",
    onSuccess: [{ $event: "toast", text: "Deleted" }, { $event: "invalidate" }]
  }
}
```

### Available Side Effects

| Effect | Description | Example |
|--------|-------------|---------|
| `toast` | Show notification | `{ $event: "toast", text: "Done!", variant: "success" }` |
| `close-modal` | Close current modal | `{ $event: "close-modal" }` |
| `invalidate` | Refresh page data | `{ $event: "invalidate" }` |
| `redirect` | Navigate to URL | `{ $event: "redirect", url: "/dashboard" }` |
| `emit` | Custom event (escape hatch) | `{ $event: "emit", name: "confetti", data: {...} }` |

---

## Effects & ToastProvider

```svelte
<!-- Add to your layout for toast notifications -->
<script>
  import { ToastProvider, EffectOverlay } from 'svelte-daui';
</script>

<ToastProvider position="bottom-right" duration={4000} />
<EffectOverlay />  <!-- For confetti, emoji effects -->
<slot />
```

```typescript
// Trigger effects programmatically
window.dispatchEvent(new CustomEvent('daui:toast', {
  detail: { text: 'Hello!', variant: 'success' }
}));

window.dispatchEvent(new CustomEvent('daui:effect', {
  detail: { type: 'confetti', count: 50 }
}));

// Listen to custom events from $emit
window.addEventListener('daui:my-event', (e) => {
  console.log(e.detail);
});
```

---

## Don'ts

```typescript
// ❌ Magic string binding
{ atom: "input", bind: "store.name" }

// ❌ Import .svelte in pages
import Component from "./Component.svelte"

// ❌ Rendering logic in page objects
{ atom: "input", render: () => <input /> }

// ❌ Non-reusable components
// If it's only used once, it's not an atom
```

---

## More Info

- **Full implementation guide:** [docs/svelte-implementation.md](docs/svelte-implementation.md)
- **Component catalog:** [docs/component-catalog.md](docs/component-catalog.md)
- **AI agent context:** [AGENTS.md](AGENTS.md)
