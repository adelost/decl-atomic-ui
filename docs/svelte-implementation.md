# Deklarativt UI-system med Svelte + TypeScript

## Vision

Alla sidor beskrivs som **TypeScript-objekt** (data), inte som templates eller logik. Vill du ha en ny sida? Kopiera ett objekt och byt ut datan. Allt bygger på **lego-bitar** (Atomic Design) som tvingas vara generiska.

TypeScript-interfaces ger full IDE-support: autocomplete, felmarkering, refaktorering, go-to-definition. Du skriver deklarativ data men med compile-time-säkerhet.

---

## Principer

1. **Sidor = data** - en sidfil är bara ett typat objekt, ingen logik
2. **Atomic Design** - atoms, molecules, organisms. Inget annat existerar.
3. **Ingen specialiserad kod** - om en komponent inte är återanvändbar, är den inte en atom
4. **Ny sida = nytt objekt, noll ny kod** (om befintliga byggblock räcker)
5. **Callbacks = riktiga funktionsreferenser** - IDE:n kan navigera direkt dit
6. **Inga magiska strängar för binding** - använd stores/signals, inte `bind: 'user.name'`

---

## Varför Svelte

| Problem i Angular-implementationen | Svelte-lösning |
|-------------------------------------|----------------|
| jQuery-workaround för formulärvärden | `bind:value` fungerar rakt av |
| `{{onChange()}}` varje render-cycle | `$derived` / `$effect` i Svelte 5 |
| NgSwitch med 30 cases | `<svelte:component this={...}>` |
| Stora inline templates | Svelte-komponenter är naturligt små |

---

## Mappstruktur

```
src/
  ui/
    atoms/            -> Input, Label, Button, Badge, Select, ...
    molecules/        -> FormField, Actions, Card, ...
    organisms/        -> Table, Form, Sidebar, ...
    renderer/         -> PageRenderer, SectionRenderer
    types/            -> Alla interfaces
  pages/              -> Sidobjekt (deklarativ data)
  services/           -> Affärslogik, API-anrop
```

---

## Interfaces (typerna som styr allt)

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

/** Gemensamma properties för alla atoms */
interface BaseAtom {
  visible?: () => boolean;        // villkorad rendering - returnerar false = göms
  validate?: (value: string) => true | string;  // true = OK, string = felmeddelande
}

export interface InputAtom extends BaseAtom {
  atom: "input";
  id: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number";
  onChange?: (value: string) => void;
}

export interface SelectAtom extends BaseAtom {
  atom: "select";
  id: string;
  label?: string;
  options: SelectOption[] | (() => SelectOption[]);
  placeholder?: string;
  required?: boolean;
  onChange?: (value: string) => void;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface RadioAtom extends BaseAtom {
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
  disabled?: boolean;
  onClick?: () => void;
  confirm?: string; // "Är du säker?" -> visar dialog först
}

export interface UploadAtom extends BaseAtom {
  atom: "upload";
  id: string;
  label?: string;
  accept?: string[];
  multiple?: boolean;
  required?: boolean;
}

export interface CheckboxAtom extends BaseAtom {
  atom: "checkbox";
  id: string;
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export interface DateAtom extends BaseAtom {
  atom: "date";
  id: string;
  label?: string;
  required?: boolean;
}

export interface TextAreaAtom extends BaseAtom {
  atom: "textarea";
  id: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export interface BadgeAtom extends BaseAtom {
  atom: "badge";
  text: string;
  color: "green" | "yellow" | "red" | "blue" | "gray";
}

export interface LabelAtom extends BaseAtom {
  atom: "label";
  text: string;
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
  onSubmit: (values: T) => void;
  fields: Atom[];
}

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
  items?: ButtonAtom[];
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

## Exempel: Sidobjekt (detta är all "kod" som behövs per sida)

### Registrera prov

```typescript
// pages/registrera-prov.ts
import type { Page } from "../ui/types/page";
import { provService } from "../services/prov.service";
import { grunddataService } from "../services/grunddata.service";
import { router } from "../router";

export const registreraProv: Page = {
  layout: "centered",
  title: "Registrera prov",
  sections: [
    {
      molecule: "form",
      id: "prov-form",
      onSubmit: provService.create,
      fields: [
        { atom: "input", id: "namn", label: "Provnamn", required: true },
        {
          atom: "select",
          id: "organism",
          label: "Organism",
          options: grunddataService.getOrganismer,
          placeholder: "Välj organism...",
        },
        {
          atom: "radio",
          id: "primarOdling",
          label: "Från primärodling?",
          options: ["Ja", "Nej", "Vet ej"],
        },
        {
          atom: "upload",
          id: "provfil",
          label: "Ladda upp sekvensfil",
          accept: [".fastq", ".fasta", ".bam"],
        },
      ],
    },
    {
      molecule: "actions",
      items: [
        { atom: "button", text: "Spara", variant: "primary", submit: true },
        { atom: "button", text: "Avbryt", onClick: router.back },
      ],
    },
  ],
};
```

### Lista prover

```typescript
// pages/lista-prover.ts
import type { Page } from "../ui/types/page";
import { provService } from "../services/prov.service";
import { router } from "../router";

export const listaProver: Page = {
  layout: "full",
  title: "Prover",
  sections: [
    {
      organism: "table",
      id: "prov-tabell",
      data: provService.list,
      searchable: true,
      sortable: true,
      onRowClick: (row) => router.push(`/prov/${row.id}`),
      columns: [
        { field: "namn", header: "Provnamn" },
        { field: "organism", header: "Organism" },
        {
          field: "status",
          header: "Status",
          render: "badge",
          colorMap: { Klar: "green", Pågår: "yellow", Fel: "red" },
        },
        {
          field: "actions",
          header: "",
          render: "actions",
          items: [
            {
              atom: "button",
              text: "Ta bort",
              variant: "danger",
              onClick: provService.delete,
              confirm: "Är du säker?",
            },
          ],
        },
      ],
    },
  ],
};
```

### Inspektera prov (detaljvy)

```typescript
// pages/inspektera-prov.ts
import type { Page } from "../ui/types/page";
import { provService } from "../services/prov.service";

export const inspekteraProv = (prov: Prov): Page => ({
  layout: "centered",
  title: `Prov: ${prov.namn}`,
  sections: [
    {
      molecule: "card",
      title: "Provuppgifter",
      items: [
        {
          molecule: "label-value",
          items: [
            { label: "Provnamn", value: prov.namn },
            { label: "Organism", value: prov.organism },
            { label: "Status", value: prov.status },
            { label: "Skapad", value: prov.skapad },
          ],
        },
      ],
    },
    {
      molecule: "actions",
      items: [
        { atom: "button", text: "Redigera", variant: "primary", onClick: () => router.push(`/prov/${prov.id}/edit`) },
        { atom: "button", text: "Ta bort", variant: "danger", onClick: () => provService.delete(prov.id), confirm: "Är du säker?" },
      ],
    },
  ],
});
```

---

## Renderer (Svelte-motorn)

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
  // ... övriga atoms

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

## Exempel: En atom (Input)

```svelte
<!-- ui/atoms/Input.svelte -->
<script lang="ts">
  import type { InputAtom } from "../types/atoms";

  let { id, label, required, placeholder, type = "text", onChange }: InputAtom = $props();
  let value = $state("");
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
    bind:value
    onchange={() => onChange?.(value)}
  />
</div>
```

---

## Routing (koppla URL -> sidobjekt)

```typescript
// router/routes.ts
import { registreraProv } from "../pages/registrera-prov";
import { listaProver } from "../pages/lista-prover";
import { inspekteraProv } from "../pages/inspektera-prov";
import { provService } from "../services/prov.service";

export const routes = [
  { path: "/prover", page: listaProver },
  { path: "/prover/ny", page: registreraProv },
  { path: "/prover/:id", page: async (params) => inspekteraProv(await provService.get(params.id)) },
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

## Reaktivt state (hur sektioner kommunicerar)

Sektioner kan dela state via Svelte stores/signals. En store definieras i en service eller dedikerad store-fil och refereras av flera sektioner.

### Exempel: Select filtrerar tabell

```typescript
// stores/filter.store.ts
import { writable } from "svelte/store";

export const selectedOrganism = writable<string>("");
```

```typescript
// pages/filtrerad-lista.ts
import type { Page } from "../ui/types/page";
import { selectedOrganism } from "../stores/filter.store";
import { provService } from "../services/prov.service";
import { grunddataService } from "../services/grunddata.service";
import { get } from "svelte/store";

export const filtreradLista: Page = {
  layout: "full",
  title: "Prover",
  sections: [
    {
      atom: "select",
      id: "organism-filter",
      label: "Filtrera på organism",
      options: grunddataService.getOrganismer,
      placeholder: "Alla...",
      onChange: (value) => selectedOrganism.set(value),
    },
    {
      organism: "table",
      id: "prov-tabell",
      data: () => provService.listByOrganism(get(selectedOrganism)),
      columns: [
        { field: "namn", header: "Provnamn" },
        { field: "organism", header: "Organism" },
      ],
    },
  ],
};
```

### Exempel: Formulär som uppdaterar lista efter submit

```typescript
// stores/prov-list.store.ts
import { writable } from "svelte/store";
import { provService } from "../services/prov.service";
import type { Prov } from "../types/prov";

export const provList = writable<Prov[]>([]);

export async function refreshProvList() {
  provList.set(await provService.list());
}
```

```typescript
// pages/prover-med-form.ts
import type { Page } from "../ui/types/page";
import { provService } from "../services/prov.service";
import { refreshProvList, provList } from "../stores/prov-list.store";
import { get } from "svelte/store";

export const proverMedForm: Page = {
  layout: "full",
  title: "Hantera prover",
  sections: [
    {
      molecule: "form",
      id: "snabb-registrering",
      onSubmit: async (values) => {
        await provService.create(values);
        await refreshProvList();
      },
      fields: [
        { atom: "input", id: "namn", label: "Provnamn", required: true },
      ],
    },
    {
      organism: "table",
      id: "prov-tabell",
      data: () => get(provList),
      columns: [
        { field: "namn", header: "Provnamn" },
        { field: "status", header: "Status" },
      ],
    },
  ],
};
```

---

## Loading & Error states

Renderern hanterar asynkron data automatiskt. När `data` returnerar en `Promise` visas loading-state tills datat resolvas, och felmeddelande om det rejectas.

### Flöde

```
data() anropas
    │
    ├─ Promise pending  → Spinner visas
    ├─ Promise resolved → Data renderas
    └─ Promise rejected → Felmeddelande visas
```

### SectionRenderer med async-stöd

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
  <div class="spinner" aria-label="Laddar...">⏳</div>
{:else if state === "error"}
  <div class="error-message" role="alert">{error}</div>
{:else}
  <slot {data} />
{/if}
```

---

## Debugging

Debugging hör hemma i **renderern**, inte i page-objekten. Håll datan ren.

### Debug-flagga

```typescript
// renderer/config.ts
export const DEBUG = import.meta.env.DEV;
```

### SectionRenderer med debug-läge

```svelte
<!-- ui/renderer/SectionRenderer.svelte -->
<script lang="ts">
  import { DEBUG } from "./config";
  // ... övrig kod
</script>

{#if DEBUG}
  <div class="debug-section" data-type={level}>
    <pre class="debug-data">{JSON.stringify(section, null, 2)}</pre>
  </div>
{/if}

<!-- Faktisk rendering -->
{#if level === "atom"}
  ...
```

### Vad debug-läget visar

- Vilken section-typ som renderas (`atom`, `molecule`, `organism`)
- Vilken data som skickades in
- Visuella gränser runt varje section

### Console-dump för DevTools

```typescript
// App.svelte (endast i dev)
if (DEBUG) {
  window.__PAGE__ = currentPage;
  console.log('[page]', currentPage.title, currentPage.sections.length, 'sections');
}
```

Inspektera `__PAGE__` i browser console för att se hela strukturen.

### Princip

| Gör | Gör inte |
|-----|----------|
| Lägg debug-logik i renderern | Lägg logging i page-objekt |
| En global `DEBUG`-flagga | Separata debug-props per atom |
| Console + visuella gränser | Komplex tracing-infrastruktur |

---

## Vad ger detta?

| Fördel | Hur |
|--------|-----|
| **Autocomplete** | TypeScript-interfaces -> IDE föreslår rätt properties |
| **Felmarkering** | Skriver du `atom: "inptu"` -> röd linje direkt |
| **Refaktorering** | Byt namn på `InputAtom.label` -> uppdateras i alla sidor |
| **Go-to-definition** | Ctrl+click på `provService.create` -> hoppar till servicen |
| **Kopierbart** | Ny sida = kopiera objekt, byt data |
| **Ingen specialkod** | Om atomerna räcker behöver du aldrig röra UI-kod |
| **Testbart** | Sidobjekt är ren data -> enkelt att validera |

---

## När behöver man skriva ny kod?

| Situation | Vad gör man |
|-----------|-------------|
| Ny sida med befintliga byggblock | Nytt TypeScript-objekt (data) |
| Ny typ av fält (t.ex. ColorPicker) | Ny atom-komponent + interface |
| Ny kombination (t.ex. Stepper/Wizard) | Ny molecule + interface |
| Ny API-integration | Ny service |
| Ny layout | Ny layout-variant i PageRenderer |

---

## Jämförelse med Angular DynamicItem

| Aspekt | Angular DynamicItem | Detta system |
|--------|--------------------|----|
| Typsäkerhet | Ett interface, 50+ optional props | Discriminated unions per atom |
| IDE-feedback | Begränsad (allt matchar) | Full (bara rätt props visas) |
| Reaktivitet | `{{onChange()}}` hack | Svelte 5 runes |
| Formulärvärden | jQuery workaround | `bind:value` |
| Struktur | Platt (allt = DynamicItem) | Hierarkisk (atom/molecule/organism) |
| Callbacks | Strängar eller inline | Riktiga funktionsreferenser |
| Utbyggbarhet | Ny case i switch | Ny komponent i map |

---

## Realistiskt sidexempel: Filter + Tabell + Actions

Ett komplett exempel som visar stores, villkorad rendering, validering och asynkron data i samarbete.

### Typer

```typescript
// types/agens.ts
export interface Agens {
  id: string;
  namn: string;
  organism: string;
  resistens: string;
  status: "Aktiv" | "Arkiverad" | "Under analys";
  registrerad: string;
}
```

### Store

```typescript
// stores/agens.store.ts
import { writable, derived } from "svelte/store";
import { agensService } from "../services/agens.service";
import type { Agens } from "../types/agens";

export const organismFilter = writable<string>("");
export const statusFilter = writable<string>("");
export const agensList = writable<Agens[]>([]);

export const filteredAgens = derived(
  [agensList, organismFilter, statusFilter],
  ([$list, $organism, $status]) =>
    $list
      .filter((a) => !$organism || a.organism === $organism)
      .filter((a) => !$status || a.status === $status)
);

export async function loadAgens() {
  agensList.set(await agensService.list());
}
```

### Sidobjekt

```typescript
// pages/agens-oversikt.ts
import type { Page } from "../ui/types/page";
import type { Agens } from "../types/agens";
import type { FormMolecule } from "../ui/types/molecules";
import type { TableOrganism } from "../ui/types/organisms";
import {
  organismFilter,
  statusFilter,
  filteredAgens,
  loadAgens,
} from "../stores/agens.store";
import { grunddataService } from "../services/grunddata.service";
import { agensService } from "../services/agens.service";
import { router } from "../router";
import { get } from "svelte/store";

// Typat formulär
interface NyAgensForm {
  namn: string;
  organism: string;
  resistens: string;
}

const nyAgensForm: FormMolecule<NyAgensForm> = {
  molecule: "form",
  id: "ny-agens",
  onSubmit: async (values) => {
    await agensService.create(values);
    await loadAgens();
  },
  fields: [
    {
      atom: "input",
      id: "namn",
      label: "Namn",
      required: true,
      validate: (v) => v.length >= 2 || "Namn måste vara minst 2 tecken",
    },
    {
      atom: "select",
      id: "organism",
      label: "Organism",
      options: grunddataService.getOrganismer,
      required: true,
    },
    {
      atom: "input",
      id: "resistens",
      label: "Resistensprofil",
      visible: () => get(organismFilter) !== "",  // visas bara om filter är satt
    },
  ],
};

const agensTabell: TableOrganism<Agens> = {
  organism: "table",
  id: "agens-tabell",
  data: () => get(filteredAgens),
  searchable: true,
  sortable: true,
  paginated: true,
  onRowClick: (row) => router.push(`/agens/${row.id}`),
  columns: [
    { field: "namn", header: "Namn" },
    { field: "organism", header: "Organism" },
    { field: "resistens", header: "Resistens" },
    {
      field: "status",
      header: "Status",
      render: "badge",
      colorMap: { Aktiv: "green", Arkiverad: "gray", "Under analys": "yellow" },
    },
    { field: "registrerad", header: "Registrerad", render: "date" },
    {
      field: "id",
      header: "",
      render: "actions",
      items: [
        {
          atom: "button",
          text: "Arkivera",
          variant: "secondary",
          confirm: "Vill du arkivera denna agens?",
          visible: () => true, // kan villkoras per rad i renderern
        },
        {
          atom: "button",
          text: "Ta bort",
          variant: "danger",
          confirm: "Är du säker? Detta går inte att ångra.",
        },
      ],
    },
  ],
};

export const agensOversikt: Page = {
  layout: "full",
  title: "Agensöversikt",
  sections: [
    // Filter-rad
    {
      atom: "select",
      id: "organism-filter",
      label: "Organism",
      options: grunddataService.getOrganismer,
      placeholder: "Alla organismer...",
      onChange: (v) => organismFilter.set(v),
    },
    {
      atom: "select",
      id: "status-filter",
      label: "Status",
      options: [
        { value: "Aktiv", label: "Aktiv" },
        { value: "Arkiverad", label: "Arkiverad" },
        { value: "Under analys", label: "Under analys" },
      ],
      placeholder: "Alla statusar...",
      onChange: (v) => statusFilter.set(v),
    },
    // Tabell
    agensTabell,
    // Registreringsformulär
    nyAgensForm,
    {
      molecule: "actions",
      items: [
        { atom: "button", text: "Registrera", variant: "primary", submit: true },
      ],
    },
  ],
};
```

---

## Filosofi: Convention over enforcement

Systemet är **inte en tvångströja**. Det är ett konvent som gör det enkelt att göra rätt.

- **Inget hindrar** dig från att skriva en vanlig Svelte-komponent utanför atom-systemet om behovet finns
- **Men** om du håller dig till mönstret får du: autocomplete, validering, kopierbarhet, konsekvent UI
- **Lint-regel** kan varna (inte blockera) om filer utanför `ui/` importerar DOM-element direkt:

```javascript
// .eslintrc.js (exempel)
rules: {
  "no-restricted-imports": ["warn", {
    patterns: [{
      group: ["svelte/internal"],
      message: "Använd ui/atoms istället för direkta DOM-element i sidobjekt"
    }]
  }]
}
```

Tanken: gör det *lättare* att följa mönstret än att avvika från det, men lås inte in teamet.

---

## Designmönster: Attribut triggar beteende

Detta mönster genomsyrar hela systemet — både UI och affärslogik.

### Principen

```
Om ett attribut finns på objektet → aktiveras motsvarande beteende
```

### I UI-systemet

```typescript
{ atom: "input", visible: () => showField, validate: (v) => v.length > 0 }
//               ↑ attribut finns = beteende aktiveras
```

### I affärslogik (samma mönster)

```typescript
{ name: "Aged Brie", improveWithTime: { max: 50 }, expire: true }
//                   ↑ attribut finns = behavior körs
```

### Motorn (identisk struktur)

```typescript
// UI: för varje atom-typ, rendera rätt komponent
// Logik: för varje attribut, kör motsvarande behavior
for (const [key, behavior] of Object.entries(behaviors)) {
  if (key in item) behavior(item, item[key]);
}
```

### Varför detta fungerar

| | UI | Affärslogik |
|---|---|---|
| Trigger | `atom: "input"` | `degrade: true` |
| Behavior | Renderar komponent | Kör funktion |
| Extension | Ny atom + interface | Nytt attribut + behavior |
| Komposition | Sections med atoms | Items med behaviors |

**Gyllene regeln:** Data beskriver VAD, motorn hanterar HUR.
