# DAUI
*Declarative Atomic UI — pages are data, not code*

## Vision

All pages are described as **TypeScript objects** (data), not as templates or logic. Want a new page? Copy an object and swap out the data. Everything builds on **building blocks** (Atomic Design) that are forced to be generic.

TypeScript interfaces provide full IDE support: autocomplete, error marking, refactoring, go-to-definition. You write declarative data with compile-time safety.

---


## Philosophy & Influences

**DAUI (Declarative Atomic UI)** is a synthesis of several robust software engineering paradigms:

*   **[Atomic Design](https://atomicdesign.bradfrost.com):** Brad Frost's methodology for component hierarchy (Atoms, Molecules, Organisms).
*   **Functional Composition:** Building complex UIs by composing simple, pure data functions.
*   **Data-Driven Design:** The shape of the data determines the shape of the UI.
*   **UI as Data:** Pages are plain objects, not component trees. The renderer interprets them.
*   **ECS (Entity Component System):** Inspired by game engines, we separate Data (Page Objects) from Logic (Renderers).


> **Language-agnostic:** While this reference implementation uses TypeScript, the DAUI concept applies to any language with structural typing or schemas (e.g., Python with Pydantic, Dart/Flutter, Rust). The core value is describing UI as data that a renderer interprets.

> **Not a page builder, but could power one.** DAUI pages are typed data objects you write in your IDE—full autocomplete, type safety, and version control. But because pages are just data, a visual editor could be built on top, letting designers drag-drop atoms/molecules while developers work in code. Same format, different interfaces.

---

## Core Pattern: Attribute Triggers Behavior

This pattern permeates the entire system: both UI and business logic.

### The Principle

```
If an attribute exists on the object → the corresponding behavior is activated
```

### In the UI system

```typescript
{ atom: "input", visible: () => showField, validate: (v) => v.length > 0 }
//               ↑ attribute exists = behavior activated
```

### In business logic (same pattern)

```typescript
{ name: "Aged Brie", improveWithTime: { max: 50 }, expire: true }
//                   ↑ attribute exists = behavior runs
```

### The Engine (identical structure)

```typescript
// UI: for each atom type, render the right component
// Logic: for each attribute, run the corresponding behavior
for (const [key, behavior] of Object.entries(behaviors)) {
  if (key in item) behavior(item, item[key]);
}
```

### Why this works

| | UI | Business Logic |
|---|---|---|
| Trigger | `atom: "input"` | `degrade: true` |
| Behavior | Renders component | Runs function |
| Extension | New atom + interface | New attribute + behavior |
| Composition | Sections with atoms | Items with behaviors |

**Golden rule:** Data describes WHAT, the engine handles HOW.

---

## Principles

1. **Pages = data.** A page file is just a typed object, no logic.
2. **Atomic Design.** Atoms, molecules, organisms. Nothing else exists.
3. **No specialized code.** If a component isn't reusable, it's not an atom.
4. **New page = new object, zero new code** (if existing building blocks suffice).
5. **Callbacks = real function references.** IDE can navigate directly to them.
6. **No magic strings for binding.** Use stores/signals, not `bind: 'user.name'`.

---

## What does this give you?

| Benefit | How |
|---------|-----|
| **Autocomplete** | TypeScript interfaces → IDE suggests correct properties |
| **Error marking** | Type `atom: "inptu"` → red line immediately |
| **Refactoring** | Rename `InputAtom.label` → updates in all pages |
| **Go-to-definition** | Ctrl+click on `sampleService.create` → jumps to service |
| **Copyable** | New page = copy object, change data |
| **No special code** | If atoms suffice, you never touch UI code |
| **Testable** | Page objects are pure data → easy to validate |

---

## Why Svelte

| Common legacy problems | Svelte solution |
|------------------------|-----------------|
| Manual DOM updates for form values | `bind:value` works out of the box |
| Workarounds for reactivity | `$derived` / `$effect` in Svelte 5 |
| Large switch statements for component types | `<svelte:component this={...}>` |
| Verbose templates | Svelte components are naturally small |

---

## Folder Structure

```
src/
  ui/
    atoms/            -> Input, Label, Button, Badge, Select, ...
    molecules/        -> FormField, Actions, Card, ...
    organisms/        -> Table, Form, Sidebar, ...
    renderer/         -> PageRenderer, SectionRenderer
    types/            -> All interfaces
  pages/              -> Page objects (declarative data)
  services/           -> Business logic, API calls
```

---

## CSS Strategy

The pattern is **CSS-agnostic**:each atom handles its own styling.

### Recommended: shadcn-svelte

```
Melt UI (primitives) → Bits UI (headless) → shadcn-svelte (styled)
```

**Why shadcn-svelte:**
- Pre-built, accessible components with great defaults
- Copy-paste code you own (not a npm dependency)
- Uses Tailwind + Bits UI under the hood
- Easy to customize:it's just Tailwind classes
- Theming built-in via CSS variables

> **Note:** shadcn-svelte requires Tailwind CSS. This isn't a separate choice:when you choose shadcn, you choose Tailwind.

```bash
# Setup
npx shadcn-svelte@latest init
npx shadcn-svelte@latest add button input select
```

```svelte
<!-- Your atom wraps shadcn component -->
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import type { ButtonAtom } from "../types";

  let { text, variant = "default", onClick }: ButtonAtom = $props();
</script>

<Button {variant} on:click={onClick}>{text}</Button>
```

**Note:** Wrapping is optional. Use shadcn components directly if you don't need to:
- Limit which props are exposed
- Add project-specific logic
- Simplify the API for your team

Otherwise, a wrapper is just an extra layer without value.

### Why shadcn over raw Bits UI?

**shadcn-svelte (what you write):**
```svelte
<Select.Root>
  <Select.Trigger class="w-[180px]">
    <Select.Value placeholder="Select theme" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="light">Light</Select.Item>
    <Select.Item value="dark">Dark</Select.Item>
  </Select.Content>
</Select.Root>
```

**Raw Bits UI (what you'd have to write):**
```svelte
<Select.Root>
  <Select.Trigger class="inline-flex h-10 items-center justify-between
    rounded-md border border-input bg-background px-3 py-2 text-sm
    ring-offset-background placeholder:text-muted-foreground
    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-50 w-[180px]">
    <Select.Value placeholder="Select theme" />
  </Select.Trigger>
  <Select.Content class="relative z-50 min-w-[8rem] overflow-hidden
    rounded-md border bg-popover text-popover-foreground shadow-md
    animate-in fade-in-80">
    <Select.Item class="relative flex w-full cursor-default select-none
      items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none
      focus:bg-accent focus:text-accent-foreground
      data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
      value="light">Light</Select.Item>
    <!-- ...repeat for every item... -->
  </Select.Content>
</Select.Root>
```

**shadcn does this work for you.** All that CSS lives in the component file you own, not scattered across your codebase.

### Alternatives

| Approach | When to use |
|----------|-------------|
| **Raw Bits UI + Tailwind** | You have a strict design system from a designer |
| **Skeleton UI** | Want a full component library, less customization needed |
| **Plain CSS/SCSS** | Full control, more work |

### When to go deeper (raw Bits UI)

Only if shadcn components don't fit your design at all. Then use Bits UI primitives directly. But this is rare:shadcn is customizable enough for most projects.

---

## Theming

The pattern naturally supports theming because **pages are data, atoms are presentation**.

```
Pages (DATA) ──→ Atoms (STYLING) ──→ UI
      ↑                ↑
  Never changes    Swap here = new theme
```

### CSS Variables (simplest)

```css
/* styles/theme.css */
:root {
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-bg: #ffffff;
  --color-text: #1f2937;
  --radius: 0.5rem;
  --shadow: 0 1px 3px rgba(0,0,0,0.1);
}

[data-theme="dark"] {
  --color-primary: #60a5fa;
  --color-primary-hover: #93c5fd;
  --color-bg: #1f2937;
  --color-text: #f9fafb;
}
```

### Use in atoms

```svelte
<!-- Button.svelte -->
<button
  class="px-4 py-2 rounded-[var(--radius)]
         bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]
         text-white shadow-[var(--shadow)]"
>
  {text}
</button>
```

### Switch theme at runtime

```typescript
// Switch to dark theme
document.documentElement.dataset.theme = "dark";

// Or with a store
export const theme = $state<"light" | "dark">("light");
$effect(() => {
  document.documentElement.dataset.theme = theme;
});
```

### Why this works

| What | Changes? |
|------|----------|
| Page objects | No - pure data |
| Atom interfaces | No - same props |
| Atom styling | Yes - uses CSS variables |
| CSS variables | Yes - swap colors/spacing |

**Result:** New theme = new CSS file. Zero changes to pages or atom interfaces.

### Conditional class objects (for radical differences)

When themes need different structure/animations, not just colors:

```svelte
<!-- Button.svelte -->
<script>
  import { theme } from '$lib/stores/theme';

  const themes = {
    default: "rounded-lg bg-blue-500 px-4 py-2",
    brutalist: "border-4 border-black uppercase px-6 py-3",
    playful: "rounded-full bg-pink-400 px-8 py-3 animate-bounce"
  };
</script>

<button class={themes[$theme]}>
  <slot />
</button>
```

This gives radically different looks without code duplication.

### Theming strategy summary

| Strategy | When to use |
|----------|-------------|
| **CSS Variables** | Colors, spacing, roundness (90% of cases) |
| **Conditional class objects** | Different structure/animations per theme |
| **Multiple atom sets** | Almost never worth it (maintenance nightmare) |

---

## Atom vs Molecule vs Organism

How do you know which level a component belongs to? Use this quick test:

| Level | Definition | Quick Test |
|-------|------------|------------|
| **Atom** | Primitive UI element | Renders one thing (input, button, label) |
| **Molecule** | Composed UI without own data | Groups atoms, no data fetching or async |
| **Organism** | Owns data/state/flow | Has pagination, sorting, async data, or orchestrates multiple parts |

**Decision flow:**

```
Does it have `data: () => Promise<T[]>` or own data lifecycle?
  → Yes: Organism (Table, Sidebar)
  → No: Continue...

Does it handle routing, wizard steps, or complex state?
  → Yes: Organism (Stepper, Modal with form)
  → No: Continue...

Is it a reusable group of atoms without own state?
  → Yes: Molecule (Form, Card, Actions)
  → No: Atom (Input, Button, Badge)
```

**Gray zones:** When uncertain, ask "does it own async data or complex lifecycle?" If yes → organism. A Stepper with step validation is borderline—we define it as a molecule since the page provides step content and the stepper just manages which step is visible. A Table that fetches and paginates data is clearly an organism.

---

## Interfaces (the types that control everything)

### Atoms

```typescript
// ui/types/atoms.ts

export type Atom =
  | InputAtom
  | SelectAtom
  | RadioAtom
  | ButtonAtom
  | UploadAtom
  | CheckboxAtom
  | DateAtom
  | TextAreaAtom
  | BadgeAtom
  | LabelAtom;
  // + SwitchAtom, IconButtonAtom, SearchInputAtom, NumberInputAtom,
  //   LinkAtom, DividerAtom, TextAtom, ImageAtom, AvatarAtom, ProgressAtom
  //   - see component-catalog.md for full list

/** Common properties for all atoms */
interface BaseAtom {
  visible?: () => boolean;  // conditional rendering - returns false = hidden
}

/** Form field atoms with typed value binding */
interface FormAtom<T> extends BaseAtom {
  value?: () => T;                        // reactive value getter
  onChange?: (value: T) => void;          // called on value change
  validate?: (value: T) => true | string; // true = OK, string = error message
}

export interface InputAtom extends FormAtom<string> {
  atom: "input";
  id: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  type?: "text" | "email" | "password";
}

export interface SelectAtom extends FormAtom<string> {
  atom: "select";
  id: string;
  label?: string;
  options: SelectOption[] | (() => SelectOption[]);
  placeholder?: string;
  required?: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface RadioAtom extends FormAtom<string> {
  atom: "radio";
  id: string;
  label?: string;
  options: string[];
  required?: boolean;
}

export interface ButtonAtom extends BaseAtom {
  atom: "button";
  text: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  submit?: boolean;
  disabled?: boolean | (() => boolean);
  onClick?: () => void | Promise<void>;  // Promise = auto loading state
  confirm?: string; // "Are you sure?" -> shows dialog first
}

// Promise onClick behavior:
// 1. While pending: button shows spinner + disabled (prevents double-click)
// 2. On error: restore to normal, rethrow (caller handles toast)
// 3. On success: restore to normal
// Example:
// onClick: async () => {
//   await api.save(data);  // Button shows spinner automatically
//   toast.success("Saved!");
// }

export interface UploadAtom extends FormAtom<File | File[] | null> {
  atom: "upload";
  id: string;
  label?: string;
  accept?: string[];
  multiple?: boolean;
  required?: boolean;
}

export interface CheckboxAtom extends FormAtom<boolean> {
  atom: "checkbox";
  id: string;
  label: string;
}

export interface DateAtom extends FormAtom<Date | string | null> {
  atom: "date";
  id: string;
  label?: string;
  required?: boolean;
}

export interface TextAreaAtom extends FormAtom<string> {
  atom: "textarea";
  id: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export interface BadgeAtom extends BaseAtom {
  atom: "badge";
  text: string | (() => string);
  color: "green" | "yellow" | "red" | "blue" | "gray" | "gold" | (() => "green" | "yellow" | "red" | "blue" | "gray" | "gold");
}

export interface LabelAtom extends BaseAtom {
  atom: "label";
  text: string | (() => string);
  tooltip?: string;
}
```

### Molecules

```typescript
// ui/types/molecules.ts

export type Molecule =
  | FormMolecule<any>
  | ActionsMolecule
  | LabelValueMolecule;
  // + GridMolecule, StackMolecule, TabsMolecule, etc. - see component-catalog.md

export interface FormMolecule<T = Record<string, unknown>> {
  molecule: "form";
  id: string;
  onSubmit?: (values: T) => void;  // values object uses field.id as keys
  action?: string;                  // SvelteKit form action, e.g. "?/updateMember"
  fields: Atom[];
}
// Note: Form collects values by field `id`. Example:
// fields: [{ atom: "input", id: "name" }, { atom: "input", id: "email" }]
// onSubmit receives: { name: "...", email: "..." }

export interface ActionsMolecule {
  molecule: "actions";
  items: ButtonAtom[];
}

export interface LabelValueMolecule {
  molecule: "label-value";
  items: { label: string; value: string | number }[];
}
```

### Organisms

```typescript
// ui/types/organisms.ts

export type Organism =
  | TableOrganism<any>
  | SidebarOrganism;
  // + ModalOrganism, DrawerOrganism, ListOrganism, CardOrganism,
  //   HeaderOrganism, FooterOrganism - see component-catalog.md

export interface TableOrganism<T = Record<string, unknown>> {
  // See component-catalog.md for full definition (search, sort, actions, etc.)
  organism: "table";
  id: string;
  data: () => T[] | Promise<T[]>;
  columns: TableColumn<T>[];

  // Row interaction
  onRowClick?: (row: T) => void;

  // Search
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;

  // Sorting & pagination
  sortable?: boolean;
  paginated?: boolean;

  // Empty state
  emptyText?: string;

  // Row actions (edit, delete buttons)
  actions?: TableAction<T>[];
}

export interface TableColumn<T = Record<string, unknown>> {
  field: keyof T & string;
  header: string;
  sortable?: boolean;
  width?: string;
  // Custom rendering per column
  render?: (value: unknown, row: T) => Section;
}

export interface TableAction<T> {
  icon: string;
  label: string;  // for a11y
  variant?: "default" | "danger";
  onClick: (row: T) => void | Promise<void>;  // Promise = auto loading
  visible?: (row: T) => boolean;
}

export interface SidebarOrganism {
  organism: "sidebar";
  items: { label: string; route: string; icon?: string }[];
}
```

### Page

```typescript
// ui/types/page.ts

export interface Page {
  layout: "centered" | "full" | "sidebar";
  title: string;
  sections: Section[];
}

export type Section = Atom | Molecule | Organism;
```

---

## Example: Page Objects (this is all the "code" needed per page)

### Register Sample

```typescript
// pages/register-sample.ts
import type { Page } from "../ui/types";
import { sampleService } from "../services/sample.service";
import { referenceDataService } from "../services/reference-data.service";
import { router } from "../router";

export const registerSample: Page = {
  layout: "centered",
  title: "Register Sample",
  sections: [
    {
      molecule: "form",
      id: "sample-form",
      onSubmit: sampleService.create,
      fields: [
        { atom: "input", id: "name", label: "Sample Name", required: true },
        {
          atom: "select",
          id: "organism",
          label: "Organism",
          options: referenceDataService.getOrganisms,
          placeholder: "Select organism...",
        },
        {
          atom: "radio",
          id: "primaryCulture",
          label: "From primary culture?",
          options: ["Yes", "No", "Unknown"],
        },
        {
          atom: "upload",
          id: "sampleFile",
          label: "Upload sequence file",
          accept: [".fastq", ".fasta", ".bam"],
        },
      ],
    },
    {
      molecule: "actions",
      items: [
        { atom: "button", text: "Save", variant: "primary", submit: true },
        { atom: "button", text: "Cancel", onClick: router.back },
      ],
    },
  ],
};
```

### List Samples

```typescript
// pages/list-samples.ts
import type { Page } from "../ui/types";
import { sampleService } from "../services/sample.service";
import { router } from "../router";

export const listSamples: Page = {
  layout: "full",
  title: "Samples",
  sections: [
    {
      organism: "table",
      id: "sample-table",
      data: sampleService.list,
      searchable: true,
      sortable: true,
      onRowClick: (row) => router.push(`/sample/${row.id}`),
      columns: [
        { field: "name", header: "Sample Name", sortable: true },
        { field: "organism", header: "Organism" },
        {
          field: "status",
          header: "Status",
          render: (val, row) => ({
            atom: "badge",
            text: val,
            color: { Complete: "green", InProgress: "yellow", Error: "red" }[val] ?? "gray"
          }),
        },
      ],
      actions: [
        {
          icon: "trash",
          label: "Delete sample",
          variant: "danger",
          onClick: (row) => sampleService.delete(row.id),
        },
      ],
    },
  ],
};
```

### Inspect Sample (detail view)

```typescript
// pages/inspect-sample.ts
import type { Page } from "../ui/types";
import { sampleService } from "../services/sample.service";

export const inspectSample = (sample: Sample): Page => ({
  layout: "centered",
  title: `Sample: ${sample.name}`,
  sections: [
    {
      organism: "card",
      header: { atom: "text", text: "Sample Details", variant: "heading" },
      content: [
        {
          molecule: "label-value",
          items: [
            { label: "Sample Name", value: sample.name },
            { label: "Organism", value: sample.organism },
            { label: "Status", value: sample.status },
            { label: "Created", value: sample.created },
          ],
        },
      ],
    },
    {
      molecule: "actions",
      items: [
        { atom: "button", text: "Edit", variant: "primary", onClick: () => router.push(`/sample/${sample.id}/edit`) },
        { atom: "button", text: "Delete", variant: "danger", onClick: () => sampleService.delete(sample.id), confirm: "Are you sure?" },
      ],
    },
  ],
});
```

---

## Renderer (The Svelte Engine)

### PageRenderer

```svelte
<!-- ui/renderer/PageRenderer.svelte -->
<script lang="ts">
  import type { Page } from "../types/page";
  import SectionRenderer from "./SectionRenderer.svelte";

  let { page }: { page: Page } = $props();
</script>

<main class="layout-{page.layout}">
  <h1>{page.title}</h1>
  {#each page.sections as section}
    <SectionRenderer {section} />
  {/each}
</main>
```

### SectionRenderer

```svelte
<!-- ui/renderer/SectionRenderer.svelte -->
<script lang="ts">
  import type { Section } from "../types/page";
  import AtomRenderer from "./AtomRenderer.svelte";
  import MoleculeRenderer from "./MoleculeRenderer.svelte";
  import OrganismRenderer from "./OrganismRenderer.svelte";

  let { section }: { section: Section } = $props();

  const level = $derived(
    "atom" in section ? "atom" :
    "molecule" in section ? "molecule" :
    "organism"
  );
</script>

{#if level === "atom"}
  <AtomRenderer config={section} />
{:else if level === "molecule"}
  <MoleculeRenderer config={section} />
{:else}
  <OrganismRenderer config={section} />
{/if}
```

### AtomRenderer

```svelte
<!-- ui/renderer/AtomRenderer.svelte -->
<script lang="ts">
  import type { Atom } from "../types/atoms";
  import Input from "../atoms/Input.svelte";
  import Select from "../atoms/Select.svelte";
  import Button from "../atoms/Button.svelte";
  // ... other atoms

  let { config }: { config: Atom } = $props();

  const components = {
    input: Input,
    select: Select,
    button: Button,
    radio: Radio,
    upload: Upload,
    checkbox: Checkbox,
    date: DateInput,
    textarea: TextArea,
    badge: Badge,
    label: Label,
  };
</script>

<svelte:component this={components[config.atom]} {...config} />
```

---

## Example: An Atom (Input)

```svelte
<!-- ui/atoms/Input.svelte -->
<script lang="ts">
  import type { InputAtom } from "../types/atoms";

  let { id, label, required, placeholder, type = "text", value: getValue, onChange }: InputAtom = $props();

  // Initialize from getter, or empty string if no getter provided
  let inputValue = $state(getValue?.() ?? "");

  // Sync with external value changes (if getter updates)
  $effect(() => {
    if (getValue) inputValue = getValue();
  });
</script>

<div class="form-field">
  {#if label}
    <label for={id}>
      {label}
      {#if required}<span class="required">*</span>{/if}
    </label>
  {/if}
  <input
    {id}
    name={id}
    {type}
    {placeholder}
    {required}
    bind:value={inputValue}
    oninput={() => onChange?.(inputValue)}
  />
</div>
```

---

## Routing (connecting URL -> page object)

```typescript
// router/routes.ts
import { registerSample } from "../pages/register-sample";
import { listSamples } from "../pages/list-samples";
import { inspectSample } from "../pages/inspect-sample";
import { sampleService } from "../services/sample.service";

export const routes = [
  { path: "/samples", page: listSamples },
  { path: "/samples/new", page: registerSample },
  { path: "/samples/:id", page: async (params) => inspectSample(await sampleService.get(params.id)) },
];
```

```svelte
<!-- App.svelte -->
<script lang="ts">
  import PageRenderer from "./ui/renderer/PageRenderer.svelte";
  import { currentPage } from "./router";
</script>

<PageRenderer page={currentPage} />
```

---

## Reactive State (how sections communicate)

Sections can share state via Svelte stores/signals. A store is defined in a service or dedicated store file and referenced by multiple sections.

### Example: Select filters table

```typescript
// stores/filter.store.ts
import { writable } from "svelte/store";

export const selectedOrganism = writable<string>("");
```

```typescript
// pages/filtered-list.ts
import type { Page } from "../ui/types";
import { selectedOrganism } from "../stores/filter.store";
import { sampleService } from "../services/sample.service";
import { referenceDataService } from "../services/reference-data.service";
import { get } from "svelte/store";

export const filteredList: Page = {
  layout: "full",
  title: "Samples",
  sections: [
    {
      atom: "select",
      id: "organism-filter",
      label: "Filter by organism",
      options: referenceDataService.getOrganisms,
      placeholder: "All...",
      onChange: (value) => selectedOrganism.set(value),
    },
    {
      organism: "table",
      id: "sample-table",
      data: () => sampleService.listByOrganism(get(selectedOrganism)),
      columns: [
        { field: "name", header: "Sample Name" },
        { field: "organism", header: "Organism" },
      ],
    },
  ],
};
```

### Example: Form that updates list after submit

```typescript
// stores/sample-list.store.ts
import { writable } from "svelte/store";
import { sampleService } from "../services/sample.service";
import type { Sample } from "../types/sample";

export const sampleList = writable<Sample[]>([]);

export async function refreshSampleList() {
  sampleList.set(await sampleService.list());
}
```

```typescript
// pages/samples-with-form.ts
import type { Page } from "../ui/types";
import { sampleService } from "../services/sample.service";
import { refreshSampleList, sampleList } from "../stores/sample-list.store";
import { get } from "svelte/store";

export const samplesWithForm: Page = {
  layout: "full",
  title: "Manage Samples",
  sections: [
    {
      molecule: "form",
      id: "quick-register",
      onSubmit: async (values) => {
        await sampleService.create(values);
        await refreshSampleList();
      },
      fields: [
        { atom: "input", id: "name", label: "Sample Name", required: true },
      ],
    },
    {
      organism: "table",
      id: "sample-table",
      data: () => get(sampleList),
      columns: [
        { field: "name", header: "Sample Name" },
        { field: "status", header: "Status" },
      ],
    },
  ],
};
```

---

## Loading & Error States

The renderer handles asynchronous data automatically. When `data` returns a `Promise`, a loading state is shown until the data resolves, and an error message if it rejects.

### Flow

```
data() is called
    │
    ├─ Promise pending  → Spinner shown
    ├─ Promise resolved → Data rendered
    └─ Promise rejected → Error message shown
```

### SectionRenderer with async support

```svelte
<!-- ui/renderer/AsyncWrapper.svelte -->
<script lang="ts">
  let { loader }: { loader: () => any[] | Promise<any[]> } = $props();
  let state = $state<"loading" | "done" | "error">("loading");
  let data = $state<any[]>([]);
  let error = $state<string>("");

  $effect(() => {
    state = "loading";
    const result = loader();
    if (result instanceof Promise) {
      result
        .then((d) => { data = d; state = "done"; })
        .catch((e) => { error = e.message; state = "error"; });
    } else {
      data = result;
      state = "done";
    }
  });
</script>

{#if state === "loading"}
  <div class="spinner" aria-label="Loading...">⏳</div>
{:else if state === "error"}
  <div class="error-message" role="alert">{error}</div>
{:else}
  <slot {data} />
{/if}
```

---

## Internationalization (i18n)

The data-driven approach makes i18n straightforward. Since we support `() => string` for all text properties, any translation library works.

```typescript
import { t } from './i18n'; // your translation function

// Static translation (evaluated once)
{
  atom: "input",
  label: t('form.name'),
}

// Reactive translation (updates on language change)
{
  atom: "button",
  text: () => t('actions.save'),
}
```

### Why this works

| Approach | When to use |
|----------|-------------|
| `label: t('key')` | Static pages, SSR, simpler setup |
| `label: () => t('key')` | SPA with runtime language switching |

**No special i18n system needed.** Use whatever library you prefer (svelte-i18n, paraglide, custom). The pattern stays the same because all text properties accept either `string` or `() => string`.

---

## Debugging

Debugging belongs in the **renderer**, not in the page objects. Keep the data clean.

### Debug flag

```typescript
// renderer/config.ts
export const DEBUG = import.meta.env.DEV;
```

### SectionRenderer with debug mode

```svelte
<!-- ui/renderer/SectionRenderer.svelte -->
<script lang="ts">
  import { DEBUG } from "./config";
  // ... other code
</script>

{#if DEBUG}
  <div class="debug-section" data-type={level}>
    <pre class="debug-data">{JSON.stringify(section, null, 2)}</pre>
  </div>
{/if}

<!-- Actual rendering -->
{#if level === "atom"}
  ...
```

### What debug mode shows

- Which section type is being rendered (`atom`, `molecule`, `organism`)
- What data was passed in
- Visual boundaries around each section

### Console dump for DevTools

```typescript
// App.svelte (dev only)
if (DEBUG) {
  window.__PAGE__ = currentPage;
  console.log('[page]', currentPage.title, currentPage.sections.length, 'sections');
}
```

Inspect `__PAGE__` in browser console to see the entire structure.

### Principle

| Do | Don't |
|----|-------|
| Put debug logic in the renderer | Put logging in page objects |
| One global `DEBUG` flag | Separate debug props per atom |
| Console + visual boundaries | Complex tracing infrastructure |

---

## Performance Tips

The declarative pattern is efficient by default, but here are some gotchas to watch for:

### Table row actions

```typescript
// ✅ Use table-level actions[] - defined once, applied to all rows
{
  organism: "table",
  data: () => items,
  columns: [...],
  actions: [
    { icon: "edit", label: "Edit", onClick: (row) => edit(row) },
    { icon: "trash", label: "Delete", variant: "danger", onClick: (row) => remove(row) }
  ]
}
// The renderer handles showing these per row efficiently
```

### Promise data refetching

```typescript
// ⚠️ Fetches on every render
data: () => fetch('/api/items').then(r => r.json())

// ✅ Cache in store, control when to refetch
data: () => itemStore.items  // store handles caching
```

### Validation debounce

```typescript
// ⚠️ Runs on every keystroke (oninput)
validate: (v) => expensiveCheck(v)

// ✅ Debounce expensive validation
validate: debounce((v) => expensiveCheck(v), 300)
```

### Circular store dependencies

```typescript
// ⚠️ Can cause infinite loops
$effect(() => { storeA.x = storeB.y });
$effect(() => { storeB.y = storeA.x });

// ✅ Break the cycle with explicit triggers
```

### When it's NOT a problem

- **Reactive getters** (`value: () => store.x`) - Svelte handles this efficiently
- **Deeply nested pages** - rarely an issue unless extreme
- **Many atoms on a page** - DOM updates are batched

**Rule of thumb:** Start simple. Optimize only if you measure a real problem.

---

## When do you need to write new code?

| Situation | What to do |
|-----------|------------|
| New page with existing building blocks | New TypeScript object (data) |
| New type of field (e.g., ColorPicker) | New atom component + interface |
| New combination (e.g., Stepper/Wizard) | New molecule + interface |
| New API integration | New service |
| New layout | New layout variant in PageRenderer |

---

## Realistic Page Example: Filter + Table + Actions

A complete example showing stores, conditional rendering, validation, and async data working together.

### Types

```typescript
// types/agent.ts
export interface Agent {
  id: string;
  name: string;
  organism: string;
  resistance: string;
  status: "Active" | "Archived" | "Under Analysis";
  registered: string;
}
```

### Store

```typescript
// stores/agent.store.ts
import { writable, derived } from "svelte/store";
import { agentService } from "../services/agent.service";
import type { Agent } from "../types/agent";

export const organismFilter = writable<string>("");
export const statusFilter = writable<string>("");
export const agentList = writable<Agent[]>([]);

export const filteredAgents = derived(
  [agentList, organismFilter, statusFilter],
  ([$list, $organism, $status]) =>
    $list
      .filter((a) => !$organism || a.organism === $organism)
      .filter((a) => !$status || a.status === $status)
);

export async function loadAgents() {
  agentList.set(await agentService.list());
}
```

### Page Object

```typescript
// pages/agent-overview.ts
import type { Page, FormMolecule, TableOrganism } from "../ui/types";
import type { Agent } from "../types/agent";
import {
  organismFilter,
  statusFilter,
  filteredAgents,
  loadAgents,
} from "../stores/agent.store";
import { referenceDataService } from "../services/reference-data.service";
import { agentService } from "../services/agent.service";
import { router } from "../router";
import { get } from "svelte/store";

// Typed form
interface NewAgentForm {
  name: string;
  organism: string;
  resistance: string;
}

const newAgentForm: FormMolecule<NewAgentForm> = {
  molecule: "form",
  id: "new-agent",
  onSubmit: async (values) => {
    await agentService.create(values);
    await loadAgents();
  },
  fields: [
    {
      atom: "input",
      id: "name",
      label: "Name",
      required: true,
      validate: (v) => v.length >= 2 || "Name must be at least 2 characters",
    },
    {
      atom: "select",
      id: "organism",
      label: "Organism",
      options: referenceDataService.getOrganisms,
      required: true,
    },
    {
      atom: "input",
      id: "resistance",
      label: "Resistance Profile",
      visible: () => get(organismFilter) !== "",  // only shown if filter is set
    },
  ],
};

const agentTable: TableOrganism<Agent> = {
  organism: "table",
  id: "agent-table",
  data: () => get(filteredAgents),
  searchable: true,
  sortable: true,
  paginated: true,
  onRowClick: (row) => router.push(`/agent/${row.id}`),
  columns: [
    { field: "name", header: "Name", sortable: true },
    { field: "organism", header: "Organism" },
    { field: "resistance", header: "Resistance" },
    {
      field: "status",
      header: "Status",
      render: (val) => ({
        atom: "badge",
        text: val,
        color: { Active: "green", Archived: "gray", "Under Analysis": "yellow" }[val] ?? "gray"
      }),
    },
    {
      field: "registered",
      header: "Registered",
      render: (val) => ({
        atom: "text",
        text: new Date(val).toLocaleDateString(),
        variant: "muted"
      }),
    },
  ],
  actions: [
    {
      icon: "archive",
      label: "Archive agent",
      variant: "default",
      onClick: (row) => agentService.archive(row.id),
      visible: (row) => row.status === "Active",
    },
    {
      icon: "trash",
      label: "Delete agent",
      variant: "danger",
      onClick: (row) => agentService.delete(row.id),
    },
  ],
};

export const agentOverview: Page = {
  layout: "full",
  title: "Agent Overview",
  sections: [
    // Filter row
    {
      atom: "select",
      id: "organism-filter",
      label: "Organism",
      options: referenceDataService.getOrganisms,
      placeholder: "All organisms...",
      onChange: (v) => organismFilter.set(v),
    },
    {
      atom: "select",
      id: "status-filter",
      label: "Status",
      options: [
        { value: "Active", label: "Active" },
        { value: "Archived", label: "Archived" },
        { value: "Under Analysis", label: "Under Analysis" },
      ],
      placeholder: "All statuses...",
      onChange: (v) => statusFilter.set(v),
    },
    // Table
    agentTable,
    // Registration form
    newAgentForm,
    {
      molecule: "actions",
      items: [
        { atom: "button", text: "Register", variant: "primary", submit: true },
      ],
    },
  ],
};
```

---

## Philosophy: Convention over Enforcement

The system is **not a straitjacket**. It's a convention that makes it easy to do the right thing.

- **Nothing prevents** you from writing a regular Svelte component outside the atom system if needed
- **But** if you follow the pattern you get: autocomplete, validation, copyability, consistent UI
- **Lint rule** can warn (not block) if files outside `ui/` import DOM elements directly:

```javascript
// .eslintrc.js (example)
rules: {
  "no-restricted-imports": ["warn", {
    patterns: [{
      group: ["svelte/internal"],
      message: "Use ui/atoms instead of direct DOM elements in page objects"
    }]
  }]
}
```

The idea: make it *easier* to follow the pattern than to deviate from it, but don't lock in the team.

---

## Composition Principle (IMPORTANT)

**Monolithic molecules are anti-pattern.** Instead of specialized components, compose generics.

### ❌ WRONG: FormModal as monolith
```typescript
// Anti-pattern - duplicates logic if we want FormDrawer
{
  molecule: "form-modal",
  title: "Edit Member",
  fields: [...]
}
```

### ✅ RIGHT: Modal + Form (composition)
```typescript
// Same form can be used in Modal, Drawer, or directly on page
{
  organism: "modal",
  title: "Edit Member",
  open: () => editModalOpen,
  onClose: () => editModalOpen = false,
  content: [
    {
      molecule: "form",
      id: "edit-member",
      onSubmit: handleSave,
      fields: [
        { atom: "input", id: "name", label: "Name", value: () => member.name },
        { atom: "input", id: "email", label: "Email", value: () => member.email }
      ]
    }
  ],
  footer: [
    { atom: "button", text: "Cancel", variant: "secondary", onClick: () => editModalOpen = false },
    { atom: "button", text: "Save", variant: "primary", submit: true }
  ]
}
```

### ✅ RIGHT: ConfirmModal = Modal with specific content
```typescript
// Not a separate molecule - just Modal with confirmation content
{
  organism: "modal",
  title: "Confirm Delete",
  size: "sm",
  open: () => confirmOpen,
  onClose: () => confirmOpen = false,
  content: [
    { atom: "text", text: "Are you sure you want to delete this item?" }
  ],
  footer: [
    { atom: "button", text: "Cancel", variant: "secondary", onClick: () => confirmOpen = false },
    { atom: "button", text: "Delete", variant: "danger", onClick: handleDelete }
  ]
}
```

---

## State Management Patterns

### Cart Store with Svelte 5
```typescript
// stores/cart.svelte.ts
class CartStore {
  items = $state<CartItem[]>([]);
  memberId = $state<string | null>(null);

  total = $derived(this.items.reduce((sum, i) => sum + i.price * i.qty, 0));
  count = $derived(this.items.reduce((sum, i) => sum + i.qty, 0));
  isEmpty = $derived(this.items.length === 0);

  add(product: Product) { /* ... */ }
  remove(id: string) { /* ... */ }
  clear() { this.items = []; this.memberId = null; }
}
export const cart = new CartStore();
```

### Undo with Countdown
```typescript
// stores/undo.ts
const _expiry = writable(0);
const _now = writable(Date.now());

export const undoTimeLeft = derived([_expiry, _now], ([$exp, $now]) =>
  Math.max(0, Math.ceil(($exp - $now) / 1000))
);

export const showUndo = derived(undoTimeLeft, $t => $t > 0);

export const undoActions = {
  set(expiryMs: number) { _expiry.set(expiryMs); startTimer(); },
  clear() { _expiry.set(0); }
};
```

### Session Cleanup
```typescript
// stores/session.ts
export const session = {
  cleanup() {
    cart.clear();
    undoActions.clear();
    toastQueue.clear();
  }
};

// Usage: beforeNavigate hook
beforeNavigate(() => session.cleanup());
```

---

## Effects Channel

Visual effects (confetti, sound, haptics) do NOT belong in atoms/molecules.

```typescript
// WRONG: Effect in atom
{ atom: "button", onClick: () => { confetti(); save(); } }  // Mixes concerns

// RIGHT: Effect via service
// services/effects.ts
export const effects = {
  confetti: () => { /* ... */ },
  sound: (type: 'success' | 'error') => { /* ... */ },
  haptic: () => { /* ... */ }
};

// Usage in page/service
onClick: async () => {
  await api.save(data);
  effects.confetti();
  effects.sound('success');
}
```

**Principle:** Atoms are dumb. Effects are triggered by services/stores, not by UI components.

---

## Escape Hatches

### Custom Cell Rendering
For cells that need complex logic:
```typescript
columns: [
  {
    field: "status",
    render: (val, row) => ({
      atom: "badge",
      text: val,
      color: row.active ? "green" : "gray"
    })
  }
]
```

### SvelteKit Form Actions
FormMolecule supports SvelteKit actions:
```typescript
{
  molecule: "form",
  id: "update-member",
  action: "?/updateMember",  // SvelteKit form action
  fields: [...]
}
```

### Things Outside Scope
Some things cannot be declarative:
- Physics/Canvas (Matter.js, WebGL)
- Easter eggs (Konami code)
- Complex animation orchestration
- Charts (wrap Chart.js as ChartAtom)

These are handled as regular Svelte components alongside the declarative system.

---

## Related Work

DAUI builds on established ideas:

- **[Atomic Design](https://atomicdesign.bradfrost.com)** — Brad Frost's component hierarchy. DAUI uses this as its structural foundation.
- **JSON Schema Forms** — Data-driven forms (react-jsonschema-form, Formly). DAUI extends this concept to full pages with TypeScript interfaces instead of JSON Schema.
- **Server-Driven UI (SDUI)** — Pattern used internally by Airbnb, Shopify, and others. Typically proprietary; DAUI offers an open, typed alternative.

**What DAUI adds:** Atomic Design + TypeScript interfaces + full pages + IDE-first DX, as an open and documented pattern.

---

## Further Reading

The "attribute triggers behavior" pattern was first explored in [CodeKata-GildedRose-Redesign](https://github.com/Adelost/CodeKata-GildedRose-Redesign) (2014), a refactoring kata that replaced deeply nested if/else logic with data-driven composition. The same principle now drives this UI system.

---

## Server-Driven UI (SDUI)

DAUI supports both code-first and server-driven modes using the `Intent` type.

### The Intent Type

```typescript
// Already defined in types
interface Intent {
  action: string;
  payload?: Record<string, unknown>;
}

type Callback = (() => void | Promise<void>) | Intent;
```

### Usage

```typescript
// Code-first (local development, full type safety):
onClick: () => cart.add(product.id)

// Server-driven (JSON from API):
onClick: { action: "cart.add", payload: { productId: "123" } }
```

Both work with `ButtonAtom`, `IconButtonAtom`, etc.

### Intent Registry

For server-driven mode, create a registry that maps action strings to handlers:

```typescript
// services/intent-registry.ts
const intentHandlers: Record<string, (payload: any) => void> = {
  "cart.add": (p) => cart.add(p.productId),
  "cart.remove": (p) => cart.remove(p.productId),
  "navigate": (p) => goto(p.path),
};

export function handleIntent(intent: Intent) {
  const handler = intentHandlers[intent.action];
  if (handler) handler(intent.payload);
  else console.warn(`Unknown intent: ${intent.action}`);
}
```

### When to Use

| Mode | When |
|------|------|
| **Code-first** | Local development, full IDE support, type safety |
| **Server-driven** | CMS-managed pages, A/B testing, dynamic UI from backend |

> **Note:** `TableAction` callbacks receive a `row` parameter, making them code-first only. For server-driven tables, generate row-specific intents on the server.
