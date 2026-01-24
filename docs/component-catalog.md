# Component Catalog (Extended)

This catalog extends the core components in [svelte-implementation.md](./svelte-implementation.md) with additional building blocks for common UI patterns.

**Status:** Work in Progress - add components as needed.

---

## Layout

### GridMolecule

```typescript
export interface GridMolecule {
  molecule: "grid";
  columns?: number | { sm?: number; md?: number; lg?: number }; // responsive
  gap?: "none" | "sm" | "md" | "lg";
  items: Section[];
}

// Usage
{
  molecule: "grid",
  columns: { sm: 1, md: 2, lg: 3 },
  gap: "md",
  items: [
    { atom: "card", title: "Card 1", items: [...] },
    { atom: "card", title: "Card 2", items: [...] },
    { atom: "card", title: "Card 3", items: [...] },
  ]
}
```

### StackMolecule

```typescript
export interface StackMolecule {
  molecule: "stack";
  direction?: "horizontal" | "vertical";
  gap?: "none" | "sm" | "md" | "lg";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  items: Section[];
}

// Usage
{
  molecule: "stack",
  direction: "horizontal",
  gap: "md",
  justify: "between",
  items: [
    { atom: "button", text: "Cancel", variant: "secondary" },
    { atom: "button", text: "Save", variant: "primary" },
  ]
}
```

### TabsMolecule

```typescript
export interface TabsMolecule {
  molecule: "tabs";
  id: string;
  activeTab?: () => string;
  onTabChange?: (tabId: string) => void;
  tabs: TabItem[];
}

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  content: Section[];
}

// Usage
{
  molecule: "tabs",
  id: "settings-tabs",
  activeTab: () => settingsStore.activeTab,
  onTabChange: (id) => settingsStore.activeTab = id,
  tabs: [
    {
      id: "general",
      label: "General",
      content: [
        { atom: "input", id: "name", label: "Name" },
      ]
    },
    {
      id: "advanced",
      label: "Advanced",
      content: [
        { atom: "checkbox", id: "debug", label: "Enable debug mode" },
      ]
    }
  ]
}
```

---

## Overlays

### ModalOrganism

```typescript
export interface ModalOrganism<T = void> {
  organism: "modal";
  id: string;
  title: string;
  open: () => boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "fullscreen";
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  content: Section[];
  footer?: Section[];
}

// Usage
{
  organism: "modal",
  id: "confirm-delete",
  title: "Confirm Delete",
  open: () => modalStore.isOpen,
  onClose: () => modalStore.isOpen = false,
  size: "sm",
  content: [
    { atom: "label", text: "Are you sure you want to delete this item?" },
  ],
  footer: [
    { atom: "button", text: "Cancel", variant: "secondary", onClick: () => modalStore.isOpen = false },
    { atom: "button", text: "Delete", variant: "danger", onClick: handleDelete },
  ]
}
```

### DrawerOrganism

```typescript
export interface DrawerOrganism {
  organism: "drawer";
  id: string;
  title?: string;
  open: () => boolean;
  onClose: () => void;
  position?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg";
  content: Section[];
}

// Usage
{
  organism: "drawer",
  id: "filters",
  title: "Filters",
  open: () => filterStore.drawerOpen,
  onClose: () => filterStore.drawerOpen = false,
  position: "right",
  content: [
    { atom: "select", id: "status", label: "Status", options: statusOptions },
    { atom: "date", id: "fromDate", label: "From" },
    { atom: "date", id: "toDate", label: "To" },
  ]
}
```

### ToastAtom

```typescript
export interface ToastAtom {
  atom: "toast";
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number; // ms, 0 = persistent
  dismissible?: boolean;
  onDismiss?: () => void;
}

// Typically managed by a toast service, not placed in pages directly
// toastService.show({ message: "Saved!", type: "success" })
```

---

## Navigation

### MenuMolecule

```typescript
export interface MenuMolecule {
  molecule: "menu";
  id: string;
  trigger: ButtonAtom;
  items: MenuItem[];
  position?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
}

export interface MenuItem {
  label: string;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean; // renders a separator line
  items?: MenuItem[]; // nested submenu
}

// Usage
{
  molecule: "menu",
  id: "user-menu",
  trigger: { atom: "button", text: "Options", variant: "secondary" },
  items: [
    { label: "Profile", icon: "user", onClick: () => goto("/profile") },
    { label: "Settings", icon: "cog", onClick: () => goto("/settings") },
    { divider: true },
    { label: "Logout", icon: "logout", onClick: authService.logout },
  ]
}
```

### BreadcrumbsMolecule

```typescript
export interface BreadcrumbsMolecule {
  molecule: "breadcrumbs";
  items: BreadcrumbItem[];
  separator?: string; // default "/"
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  // Last item is automatically non-clickable (current page)
}

// Usage
{
  molecule: "breadcrumbs",
  items: [
    { label: "Home", href: "/" },
    { label: "Samples", href: "/samples" },
    { label: "Sample #123" }, // current page, no link
  ]
}
```

### PaginationMolecule

```typescript
export interface PaginationMolecule {
  molecule: "pagination";
  currentPage: () => number;
  totalPages: () => number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisiblePages?: number; // default 5
}

// Usage
{
  molecule: "pagination",
  currentPage: () => sampleStore.page,
  totalPages: () => sampleStore.totalPages,
  onPageChange: (page) => sampleStore.loadPage(page),
  showFirstLast: true,
}
```

---

## Display

### AvatarAtom

```typescript
export interface AvatarAtom extends BaseAtom {
  atom: "avatar";
  src?: string | (() => string);
  alt?: string;
  fallback?: string; // initials or icon when no image
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "square";
  status?: "online" | "offline" | "busy" | "away";
}

// Usage
{
  atom: "avatar",
  src: () => userStore.avatarUrl,
  fallback: "JD",
  size: "md",
  status: "online",
}
```

### ProgressAtom

```typescript
export interface ProgressAtom extends BaseAtom {
  atom: "progress";
  value: () => number; // 0-100
  max?: number; // default 100
  label?: string;
  showValue?: boolean;
  color?: "primary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
}

// Usage
{
  atom: "progress",
  value: () => uploadStore.progress,
  label: "Uploading...",
  showValue: true,
  color: "primary",
}
```

### StepperMolecule

```typescript
export interface StepperMolecule {
  molecule: "stepper";
  id: string;
  currentStep: () => number;
  onStepChange?: (step: number) => void;
  steps: StepItem[];
  orientation?: "horizontal" | "vertical";
  allowClickNavigation?: boolean;
}

export interface StepItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  content: Section[];
  validate?: () => boolean; // must return true to proceed
}

// Usage
{
  molecule: "stepper",
  id: "registration-wizard",
  currentStep: () => wizardStore.step,
  onStepChange: (step) => wizardStore.step = step,
  steps: [
    {
      id: "personal",
      label: "Personal Info",
      content: [
        { atom: "input", id: "name", label: "Name", required: true },
        { atom: "input", id: "email", label: "Email", type: "email" },
      ],
      validate: () => wizardStore.name.length > 0,
    },
    {
      id: "preferences",
      label: "Preferences",
      content: [
        { atom: "checkbox", id: "newsletter", label: "Subscribe to newsletter" },
      ],
    },
    {
      id: "confirm",
      label: "Confirm",
      content: [
        { molecule: "label-value", items: [
          { label: "Name", value: wizardStore.name },
          { label: "Email", value: wizardStore.email },
        ]},
      ],
    },
  ]
}
```

---

## App Layout

### HeaderOrganism

```typescript
export interface HeaderOrganism {
  organism: "header";
  logo?: { src: string; alt: string; href?: string };
  title?: string;
  nav?: NavItem[];
  actions?: Section[]; // buttons, avatar, etc.
  sticky?: boolean;
}

export interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: () => boolean;
  items?: NavItem[]; // dropdown
}

// Usage
{
  organism: "header",
  logo: { src: "/logo.svg", alt: "MyApp", href: "/" },
  nav: [
    { label: "Dashboard", href: "/", active: () => route === "/" },
    { label: "Samples", href: "/samples", active: () => route.startsWith("/samples") },
    { label: "Reports", href: "/reports" },
  ],
  actions: [
    { molecule: "menu", id: "user-menu", trigger: { atom: "avatar", src: userStore.avatar, size: "sm" }, items: [...] },
  ],
  sticky: true,
}
```

### FooterOrganism

```typescript
export interface FooterOrganism {
  organism: "footer";
  copyright?: string;
  links?: { label: string; href: string }[];
  columns?: FooterColumn[];
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

// Usage
{
  organism: "footer",
  copyright: "© 2024 MyApp",
  columns: [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ]
    },
  ]
}
```

---

## Adding New Components

When adding a new component, follow this pattern:

1. **Decide the level:** Atom (primitive), Molecule (group), or Organism (complex/stateful)
2. **Define the interface** with TypeScript
3. **Use `FormAtom<T>`** if it has a value that can be bound
4. **Use functions for reactivity:** `value: () => T`, not `value: T`
5. **Add to the union type** in the appropriate file

```typescript
// Example: Adding a new atom
export interface NewAtom extends FormAtom<string> {
  atom: "new";
  id: string;
  // ... specific props
}

// Add to union
export type Atom = InputAtom | ButtonAtom | ... | NewAtom;
```
