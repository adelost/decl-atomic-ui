# Declarative UI System with Svelte + TypeScript

## Vision

All pages are described as **TypeScript objects** (data), not as templates or logic. Want a new page? Copy an object and swap out the data. Everything builds on **building blocks** (Atomic Design) that are forced to be generic.

TypeScript interfaces provide full IDE support: autocomplete, error marking, refactoring, go-to-definition. You write declarative data with compile-time safety.

---

## Core Pattern: Attribute Triggers Behavior

This pattern permeates the entire system — both UI and business logic.

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

1. **Pages = data** — a page file is just a typed object, no logic
2. **Atomic Design** — atoms, molecules, organisms. Nothing else exists.
3. **No specialized code** — if a component isn't reusable, it's not an atom
4. **New page = new object, zero new code** (if existing building blocks suffice)
5. **Callbacks = real function references** — IDE can navigate directly to them
6. **No magic strings for binding** — use stores/signals, not `bind: 'user.name'`

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

The pattern is **CSS-agnostic** — each atom handles its own styling. Recommended approaches:

| Approach | When to use |
|----------|-------------|
| **Tailwind + Bits UI** | Best flexibility. Bits UI = headless accessible primitives, Tailwind = styling |
| **shadcn-svelte** | Fast start with pre-built components (uses Tailwind + Bits UI under the hood) |
| **Skeleton UI** | Full component library, less customizable |
| **Plain CSS/SCSS** | Full control, more work |

**Recommendation:** Tailwind + Bits UI. You get accessible components without being locked to a design system.

```svelte
<!-- Example: Button atom with Tailwind -->
<script lang="ts">
  import type { ButtonAtom } from "../types";
  let { text, variant = "primary", onClick }: ButtonAtom = $props();

  const styles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };
</script>

<button class="px-4 py-2 rounded {styles[variant]}" onclick={onClick}>
  {text}
</button>
```

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

**Gray zones:** When uncertain, ask "does it own state and flow?" If yes → organism. A Stepper with step validation and navigation owns flow, so it's an organism. A simple Card that just groups content is a molecule.

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
  type?: "text" | "email" | "password" | "number";
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
  variant?: "primary" | "secondary" | "danger" | "link";
  submit?: boolean;
  disabled?: boolean | (() => boolean);
  onClick?: () => void;
  confirm?: string; // "Are you sure?" -> shows dialog first
}

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
  color: "green" | "yellow" | "red" | "blue" | "gray" | (() => "green" | "yellow" | "red" | "blue" | "gray");
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
  | CardMolecule
  | LabelValueMolecule;

export interface FormMolecule<T = Record<string, unknown>> {
  molecule: "form";
  id: string;
  onSubmit: (values: T) => void;  // values object uses field.id as keys
  fields: Atom[];
}
// Note: Form collects values by field `id`. Example:
// fields: [{ atom: "input", id: "name" }, { atom: "input", id: "email" }]
// onSubmit receives: { name: "...", email: "..." }

export interface ActionsMolecule {
  molecule: "actions";
  items: ButtonAtom[];
}

export interface CardMolecule {
  molecule: "card";
  title?: string;
  items: (Atom | Molecule)[];
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

export interface TableOrganism<T = Record<string, unknown>> {
  organism: "table";
  id: string;
  data: () => T[] | Promise<T[]>;
  searchable?: boolean;
  sortable?: boolean;
  paginated?: boolean;
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => void;
}

export interface TableColumn<T = Record<string, unknown>> {
  field: keyof T & string;
  header: string;
  render?: "text" | "badge" | "actions" | "date";
  colorMap?: Record<string, "green" | "yellow" | "red" | "blue">;
  items?: ButtonAtom[] | ((row: T) => ButtonAtom[]);  // function receives row for context
}
// Note: For row-specific actions, use function form:
// items: (row) => [{ atom: "button", text: "Delete", onClick: () => deleteRow(row.id) }]

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
        { field: "name", header: "Sample Name" },
        { field: "organism", header: "Organism" },
        {
          field: "status",
          header: "Status",
          render: "badge",
          colorMap: { Complete: "green", InProgress: "yellow", Error: "red" },
        },
        {
          field: "actions",
          header: "",
          render: "actions",
          items: [
            {
              atom: "button",
              text: "Delete",
              variant: "danger",
              onClick: sampleService.delete,
              confirm: "Are you sure?",
            },
          ],
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
      molecule: "card",
      title: "Sample Details",
      items: [
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
// ⚠️ Creates new array for each row on every render
columns: [
  { field: "id", header: "Actions", items: (row) => [
    { atom: "button", text: "Edit", onClick: () => edit(row) }
  ]}
]

// ✅ Better for large tables: memoize or define once
const actionsFor = memoize((row) => [
  { atom: "button", text: "Edit", onClick: () => edit(row) }
]);
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
    { field: "name", header: "Name" },
    { field: "organism", header: "Organism" },
    { field: "resistance", header: "Resistance" },
    {
      field: "status",
      header: "Status",
      render: "badge",
      colorMap: { Active: "green", Archived: "gray", "Under Analysis": "yellow" },
    },
    { field: "registered", header: "Registered", render: "date" },
    {
      field: "id",
      header: "",
      render: "actions",
      items: [
        {
          atom: "button",
          text: "Archive",
          variant: "secondary",
          confirm: "Do you want to archive this agent?",
          visible: () => true, // can be conditioned per row in renderer
        },
        {
          atom: "button",
          text: "Delete",
          variant: "danger",
          confirm: "Are you sure? This cannot be undone.",
        },
      ],
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

## Further Reading

The "attribute triggers behavior" pattern was first explored in [CodeKata-GildedRose-Redesign](https://github.com/Adelost/CodeKata-GildedRose-Redesign) (2014), a refactoring kata that replaced deeply nested if/else logic with data-driven composition. The same principle now drives this UI system.
