# Claude Code Context

See [AGENTS.md](../AGENTS.md) for full context.

## Quick Reference

**Pattern:** Pages are typed objects, not code. Renderer interprets them.

**State binding:** Use `onChange: (v) => store.field = v`, NOT `bind: "store.field"`

**Structure:**
- `packages/svelte/src/atoms/` - Primitives (Input, Button, Toast)
- `packages/svelte/src/molecules/` - Groups (Form, Grid, Pagination)
- `packages/svelte/src/organisms/` - Complex (Table, Modal, Sidebar)
- `packages/svelte/src/engine/` - $action, $async, effects
- `packages/svelte/src/renderer/` - Framework-specific rendering
- `apps/demo/src/pages/` - Pure data objects

**$action system:**
```typescript
{
  molecule: "form",
  $action: {
    endpoint: "?/save",
    onSuccess: [
      { $event: "toast", text: "Saved!" },
      { $event: "close-modal" }
    ]
  }
}
```

**Effects:** `toast`, `close-modal`, `invalidate`, `redirect`, `emit`

**Don't:**
- Import .svelte in pages
- Use magic strings for binding
- Add unrequested features
