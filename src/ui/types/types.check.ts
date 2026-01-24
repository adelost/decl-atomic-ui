/**
 * DAUI Type Check
 *
 * Compile-time validation of type correctness.
 * If this file compiles, types work. If @ts-expect-error is "unused", something broke.
 *
 * Run: npm run check
 *
 * ## Why type tests?
 *
 * DAUI's core value is that **pages are data, not code**.
 * TypeScript enforces UI structure at compile-time. These tests ensure:
 *
 * 1. **Types work** - Valid UI definitions compile
 * 2. **Types are tight** - Invalid definitions fail (no accidental `any` leaks)
 * 3. **Policies are enforced** - Architectural decisions (no className/style) are compile errors
 * 4. **Exhaustiveness** - New atoms/molecules/organisms can't be forgotten
 *
 * ## Why this approach?
 *
 * We test *patterns*, not every component permutation:
 * - One FormAtom<T> test covers all form atoms (they share the pattern)
 * - Policy tests are stable (className/style won't suddenly become valid)
 * - Exhaustive switch auto-fails when you add new types
 *
 * This keeps the file small (~200 lines) and low-maintenance.
 *
 * ## When to update
 *
 * - **New atom/molecule/organism**: Add to union in index.ts → switch fails → add case
 * - **New policy**: Add a @ts-expect-error test
 * - **Changed prop**: If it compiles, it works
 */

import type {
  // Base
  Atom,
  Molecule,
  Organism,
  Section,
  Page,
  Intent,
  Callback,
  // Atoms
  InputAtom,
  ButtonAtom,
  NumberInputAtom,
  BadgeAtom,
  // Molecules
  FormMolecule,
  GridMolecule,
  // Organisms
  TableOrganism,
  ModalOrganism,
  ListOrganism,
  TableAction,
  ListItem,
  ResponsiveColumns,
} from "./index";

// ============================================
// 1. BASICS - One example per level
// ============================================

const atom = {
  atom: "input",
  id: "name",
  label: "Name",
} satisfies Atom;

const molecule = {
  molecule: "form",
  id: "f",
  fields: [atom],
} satisfies Molecule;

const organism = {
  organism: "table",
  id: "t",
  data: () => [],
  columns: [],
} satisfies Organism;

const page = {
  layout: "centered",
  title: "Test",
  sections: [atom, molecule, organism],
} satisfies Page;

// ============================================
// 2. PATTERNS - FormAtom<T> type flow
// ============================================

// value/onChange/validate all receive the same type (number)
const typedInput = {
  atom: "number-input",
  id: "qty",
  value: () => 5,
  onChange: (v) => console.log(v.toFixed(2)), // v is number
  validate: (v) => v > 0 || "Must be positive", // v is number
} satisfies NumberInputAtom;

// ============================================
// 3. COMPOSITION - Nested sections
// ============================================

const modal = {
  organism: "modal",
  id: "edit",
  title: "Edit",
  open: () => true,
  onClose: () => {},
  content: [{ molecule: "form", id: "f", fields: [] }],
  footer: [{ atom: "button", text: "Save" }],
} satisfies ModalOrganism;

const list = {
  organism: "list",
  id: "users",
  items: () => [
    {
      key: "1",
      leading: { atom: "badge", text: "1", color: "gold" } satisfies BadgeAtom,
      content: { atom: "text", text: "Alice" },
      trailing: { atom: "text", text: "100 pts", variant: "muted" },
    } satisfies ListItem,
  ],
} satisfies ListOrganism;

// ============================================
// 4. SDUI - Intent and Callback types
// ============================================

// ✅ Code-first: function callback
const buttonWithFunction = {
  atom: "button",
  text: "Save",
  onClick: () => console.log("clicked"),
} satisfies ButtonAtom;

// ✅ Server-driven: Intent object
const buttonWithIntent = {
  atom: "button",
  text: "Add to Cart",
  onClick: { action: "cart.add", payload: { productId: "123" } },
} satisfies ButtonAtom;

// ✅ Intent type directly
const intent: Intent = { action: "navigate", payload: { path: "/home" } };

// ✅ Callback accepts both
const cb1: Callback = () => {};
const cb2: Callback = { action: "test" };

// ============================================
// 5. POLICY - Architectural constraints
// ============================================
// (Renumbered from 4 due to SDUI section above)

// @ts-expect-error - className is NOT allowed (by design)
const noClassName = { atom: "input", id: "x", className: "bad" } satisfies Atom;

// @ts-expect-error - style is NOT allowed (by design)
const noStyle = { atom: "input", id: "x", style: {} } satisfies Atom;

// @ts-expect-error - missing required 'id'
const missingId = { atom: "input" } satisfies InputAtom;

// @ts-expect-error - missing required 'text'
const missingText = { atom: "button" } satisfies ButtonAtom;

// @ts-expect-error - invalid atom discriminator
const badAtom = { atom: "fake", id: "x" } satisfies Atom;

// @ts-expect-error - invalid molecule discriminator
const badMolecule = { molecule: "fake" } satisfies Molecule;

// @ts-expect-error - invalid organism discriminator
const badOrganism = { organism: "fake" } satisfies Organism;

// @ts-expect-error - invalid layout
const badLayout = { layout: "invalid", title: "X", sections: [] } satisfies Page;

// @ts-expect-error - invalid button variant
const badVariant = { atom: "button", text: "X", variant: "invalid" } satisfies ButtonAtom;

// @ts-expect-error - invalid badge color
const badColor = { atom: "badge", text: "X", color: "purple" } satisfies BadgeAtom;

// ============================================
// 6. HELPER TYPES
// ============================================

const cols: ResponsiveColumns = { default: 1, sm: 2, md: 3, lg: 4, xl: 5 };

// @ts-expect-error - invalid breakpoint
const badCols: ResponsiveColumns = { xxl: 6 };

interface User {
  id: string;
  name: string;
  active: boolean;
}

const action: TableAction<User> = {
  icon: "edit",
  label: "Edit",
  onClick: (row) => console.log(row.name), // row is User
  visible: (row) => row.active, // row is User
};

// ============================================
// 7. EXHAUSTIVE - Auto-fails on new types
// ============================================

// If you add a new atom to the union, TypeScript errors until you add it here.
const atomMap: Record<Atom["atom"], string> = {
  "input": "Input",
  "button": "Button",
  "select": "Select",
  "radio": "Radio",
  "checkbox": "Checkbox",
  "textarea": "TextArea",
  "date": "DateInput",
  "upload": "Upload",
  "badge": "Badge",
  "label": "Label",
  "switch": "Switch",
  "icon-button": "IconButton",
  "search-input": "SearchInput",
  "number-input": "NumberInput",
  "link": "Link",
  "divider": "Divider",
  "text": "Text",
  "image": "Image",
  "avatar": "Avatar",
  "progress": "Progress",
  "toast": "Toast",
  "chart": "Chart",
  "icon": "Icon",
};

// If you add a new molecule to the union, TypeScript errors until you add it here.
const moleculeMap: Record<Molecule["molecule"], string> = {
  "form": "Form",
  "actions": "Actions",
  "label-value": "LabelValue",
  "grid": "Grid",
  "stack": "Stack",
  "tabs": "Tabs",
  "menu": "Menu",
  "breadcrumbs": "Breadcrumbs",
  "pagination": "Pagination",
  "stepper": "Stepper",
  "search-select": "SearchSelect",
  "stat-card": "StatCard",
  "timeline": "Timeline",
  "alert-panel": "AlertPanel",
  "container": "Container",
};

// If you add a new organism to the union, TypeScript errors until you add it here.
const organismMap: Record<Organism["organism"], string> = {
  "table": "Table",
  "sidebar": "Sidebar",
  "modal": "Modal",
  "drawer": "Drawer",
  "list": "List",
  "card": "Card",
  "header": "Header",
  "footer": "Footer",
};

// Silence unused variable warnings (this is a type-check file, not runtime)
void [
  atom,
  molecule,
  organism,
  page,
  typedInput,
  modal,
  list,
  buttonWithFunction,
  buttonWithIntent,
  intent,
  cb1,
  cb2,
  cols,
  action,
  atomMap,
  moleculeMap,
  organismMap,
];

export {};
