# Claude Code Context

See [AGENTS.md](../AGENTS.md) for full context.

## Quick Reference

**Pattern:** Pages are typed objects, not code. Renderer interprets them.

**State binding:** Use `onChange: (v) => store.field = v`, NOT `bind: "store.field"`

**Structure:**
- `ui/atoms/` - Primitives (Input, Button)
- `ui/molecules/` - Groups (Form, Card)
- `ui/organisms/` - Complex (Table)
- `ui/renderer/` - Framework-specific rendering
- `pages/` - Pure data objects

**Don't:**
- Import .svelte in pages
- Use magic strings for binding
- Add unrequested features
