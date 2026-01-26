# Component Catalog (Extended)

This catalog provides detailed documentation for components. For a quick reference of all available components, see [CHEATSHEET.md](../CHEATSHEET.md).

> **Note:** This document may be partially outdated. The CHEATSHEET.md has the authoritative list of all 70 components (35 atoms, 24 molecules, 11 organisms).

**Current components include:**
- **Chat:** chat-bubble, chat-input, chat-header, chat-messages-list, chat-panel
- **Media:** video-player, video-timeline, track, playhead, track-segment, track-marker
- **Celebration:** slide-modal (achievements, onboarding, tutorials)
- **Data:** table, tree-view, filter-bar, search-select, stat-card, tag-cloud
- **Layout:** stack, grid, tabs, accordion, card, modal

---

## Layout

### GridMolecule

```typescript
export interface GridMolecule {
  molecule: "grid";
  columns?: number | ResponsiveColumns;
  gap?: "none" | "sm" | "md" | "lg";
  padding?: "none" | "sm" | "md" | "lg";
  items: Section[];
}

// Responsive column notation
export interface ResponsiveColumns {
  default?: number;  // Fallback
  sm?: number;       // >= 640px
  md?: number;       // >= 768px
  lg?: number;       // >= 1024px
  xl?: number;       // >= 1280px
}

// Usage
{
  molecule: "grid",
  columns: { default: 1, sm: 2, md: 3, lg: 4 },
  gap: "md",
  padding: "lg",
  items: [
    { organism: "card", content: [...] },
    { organism: "card", content: [...] },
    { organism: "card", content: [...] },
    { organism: "card", content: [...] },
  ]
}
```

### StackMolecule

```typescript
export interface StackMolecule {
  molecule: "stack";
  direction?: "horizontal" | "vertical";
  gap?: "none" | "sm" | "md" | "lg";
  padding?: "none" | "sm" | "md" | "lg";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;  // for flexbox wrap
  items: Section[];
}

// Usage: Action bar
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

// Usage: Tag cloud with wrap
{
  molecule: "stack",
  direction: "horizontal",
  gap: "sm",
  wrap: true,
  items: tags.map(tag => ({ atom: "badge", text: tag, color: "blue" })),
}
```

**Note:** We do NOT add `className` or `style` props. That would break the declarative principle. Instead, we extend with semantic props (padding, wrap, etc.).

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

**Z-index scale** (define early to avoid conflicts):

```css
:root {
  --z-dropdown: 100;
  --z-modal: 200;
  --z-drawer: 200;
  --z-toast: 300;
  --z-tooltip: 400;
}
```

### ModalOrganism

```typescript
export interface ModalOrganism {
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

### SwitchAtom

Better than checkbox for on/off settings.

```typescript
export interface SwitchAtom extends FormAtom<boolean> {
  atom: "switch";
  id: string;
  label?: string;
}

// Usage
{
  atom: "switch",
  id: "dark-mode",
  label: "Dark Mode",
  value: () => settingsStore.darkMode,
  onChange: (v) => settingsStore.darkMode = v,
}
```

### IconButtonAtom

For actions in tables (edit, delete) or compact action areas.

```typescript
export interface IconButtonAtom extends BaseAtom {
  atom: "icon-button";
  icon: string;
  label: string; // for a11y (screen readers)
  variant?: "default" | "danger" | "ghost";
  onClick?: () => void | Promise<void>;  // Promise = auto loading state
  disabled?: boolean | (() => boolean);
}

// Usage
{
  atom: "icon-button",
  icon: "trash",
  label: "Delete item",
  variant: "danger",
  onClick: async () => {
    await api.deleteItem(item.id);
    toast.success("Deleted!");
  },
}
```

### SearchInputAtom

Search field with icon and clear button.

```typescript
export interface SearchInputAtom extends FormAtom<string> {
  atom: "search-input";
  id: string;
  placeholder?: string;
  onSearch?: (query: string) => void;  // debounced search trigger
}

// Usage
{
  atom: "search-input",
  id: "member-search",
  placeholder: "Search members...",
  value: () => searchStore.query,
  onChange: (v) => searchStore.query = v,
  onSearch: (query) => memberStore.search(query),
}
```

### NumberInputAtom

For quantity, price, numeric values.

```typescript
export interface NumberInputAtom extends FormAtom<number> {
  atom: "number-input";
  id: string;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
}

// Usage
{
  atom: "number-input",
  id: "quantity",
  label: "Quantity",
  min: 1,
  max: 100,
  step: 1,
  value: () => cartItem.quantity,
  onChange: (v) => cart.updateQuantity(cartItem.id, v),
}
```

### LinkAtom

For navigation (vs Button for actions).

```typescript
export interface LinkAtom extends BaseAtom {
  atom: "link";
  text: string;
  href: string;
  variant?: "default" | "muted" | "back";
}

// Usage
{
  atom: "link",
  text: "View all members",
  href: "/members",
  variant: "default",
}
```

### DividerAtom

Visual separator.

```typescript
export interface DividerAtom extends BaseAtom {
  atom: "divider";
  spacing?: "sm" | "md" | "lg";
}

// Usage
{
  atom: "divider",
  spacing: "md",
}
```

### TextAtom

Typography with variants.

```typescript
export interface TextAtom extends BaseAtom {
  atom: "text";
  text: string | (() => string);
  variant?: "default" | "muted" | "small" | "heading";
}

// Usage
{
  atom: "text",
  text: () => `Welcome, ${userStore.name}!`,
  variant: "heading",
}
```

### ImageAtom

For images in cards, avatars, etc.

```typescript
export interface ImageAtom extends BaseAtom {
  atom: "image";
  src: string | (() => string);
  alt: string;
  width?: number | string;
  height?: number | string;
  fallback?: string;  // Placeholder if image fails to load
  objectFit?: "cover" | "contain" | "fill";
  rounded?: boolean | "sm" | "md" | "lg" | "full";  // "full" = circle
}

// Usage
{
  atom: "image",
  src: () => product.imageUrl,
  alt: product.name,
  width: 200,
  height: 200,
  fallback: "/placeholder.png",
  objectFit: "cover",
  rounded: "md",
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

### SearchSelectMolecule

Autocomplete for large lists (members, products).

```typescript
export interface SearchSelectMolecule extends FormAtom<string> {
  molecule: "search-select";
  id: string;
  label?: string;
  options: () => SearchSelectOption[] | Promise<SearchSelectOption[]>;
  placeholder?: string;
  onSearch?: (query: string) => void;  // for server-side filtering
}

export interface SearchSelectOption {
  value: string;
  label: string;
  subtitle?: string;
}

// IMPORTANT: Lazy-loading behavior:
// - options() is NOT called at render
// - options() is called on focus OR first search
// - If SearchSelect is in a table (50 rows), does NOT trigger 50 API calls
// - Renderer should cache result after first call

// Usage
{
  molecule: "search-select",
  id: "member-select",
  label: "Select Member",
  placeholder: "Search members...",
  options: () => memberService.search(searchQuery),
  onSearch: (query) => searchQuery = query,
  value: () => selectedMemberId,
  onChange: (id) => selectedMemberId = id,
}
```

### StatCardMolecule

Dashboard metrics display.

```typescript
export interface StatCardMolecule {
  molecule: "stat-card";
  title: string;
  value: string | number | (() => string | number);
  change?: { value: number; label?: string };
  icon?: string;
}

// Usage
{
  molecule: "stat-card",
  title: "Total Sales",
  value: () => `${salesStore.total} kr`,
  change: { value: 12.5, label: "vs last month" },
  icon: "trending-up",
}
```

### TimelineMolecule

Activity history display.

```typescript
export interface TimelineMolecule<T = unknown> {
  molecule: "timeline";
  id: string;
  entries: () => TimelineEntry<T>[];
}

export interface TimelineEntry<T = unknown> {
  timestamp: number;
  title: string;
  subtitle?: string;
  icon?: string;
  data?: T;
}

// Usage
{
  molecule: "timeline",
  id: "activity-log",
  entries: () => activityStore.entries.map(e => ({
    timestamp: e.createdAt,
    title: e.action,
    subtitle: e.user.name,
    icon: e.type === "purchase" ? "shopping-cart" : "edit",
  })),
}
```

### AlertPanelMolecule

Inline notifications/alerts.

```typescript
export interface AlertPanelMolecule extends BaseAtom {
  molecule: "alert-panel";
  type: "info" | "success" | "warning" | "error";
  message: string | (() => string);
  dismissible?: boolean;
  onDismiss?: () => void;
}

// Usage
{
  molecule: "alert-panel",
  type: "warning",
  message: "Your session will expire in 5 minutes.",
  dismissible: true,
  onDismiss: () => sessionWarningDismissed = true,
  visible: () => showSessionWarning && !sessionWarningDismissed,
}
```

### ContainerMolecule

Content width constraint with padding.

```typescript
export interface ContainerMolecule {
  molecule: "container";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
  items: Section[];
}

// Usage
{
  molecule: "container",
  maxWidth: "lg",
  padding: "md",
  items: [
    { atom: "text", text: "Page content", variant: "heading" },
    { organism: "table", id: "data-table", ... },
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

## Organisms (Extended)

### ListOrganism

Critical for leaderboards, member lists, activity feeds. Uses slots pattern.

```typescript
export interface ListOrganism<T = unknown> {
  molecule: "list";
  id: string;
  items: () => ListItem<T>[];
  onItemClick?: (item: T) => void;
  emptyText?: string;
}

export interface ListItem<T = unknown> {
  key: string;
  leading?: Section;   // Avatar, icon, rank badge
  content: Section;    // Main content (text, title+subtitle)
  trailing?: Section;  // Actions, badges, chevron
  data?: T;            // Underlying data for onClick
}

// Usage: Leaderboard
{
  molecule: "list",
  id: "leaderboard",
  items: () => topUsers.map((user, i) => ({
    key: user.id,
    leading: { atom: "badge", text: `${i + 1}`, color: i < 3 ? "gold" : "gray" },
    content: {
      molecule: "stack",
      direction: "vertical",
      gap: "none",
      items: [
        { atom: "text", text: user.name, variant: "default" },
        { atom: "text", text: user.title, variant: "muted" }
      ]
    },
    trailing: { atom: "text", text: `${user.points} pts` },
    data: user
  })),
  onItemClick: (user) => goto(`/members/${user.id}`),
  emptyText: "No members found",
}
```

### CardOrganism

Flexible container that replaces ProductCard, MemberCard, etc. through composition.

```typescript
export interface CardOrganism {
  organism: "card";
  id?: string;
  header?: Section;    // Title, actions
  media?: Section;     // Image, avatar
  content: Section[];  // Main content
  footer?: Section;    // Buttons, metadata
  onClick?: () => void;
  variant?: "default" | "outlined" | "elevated";
}

// Usage: ProductCard
{
  organism: "card",
  media: { atom: "image", src: product.image, alt: product.name, objectFit: "cover" },
  content: [
    { atom: "text", text: product.name, variant: "heading" },
    { atom: "text", text: `${product.price} kr`, variant: "default" }
  ],
  footer: {
    atom: "button",
    text: "Buy",
    onClick: () => cart.add(product)
  }
}

// Usage: MemberCard
{
  organism: "card",
  header: {
    molecule: "stack",
    direction: "horizontal",
    justify: "between",
    items: [
      { atom: "text", text: member.name, variant: "heading" },
      { atom: "badge", text: member.role, color: "blue" }
    ]
  },
  content: [
    { atom: "avatar", src: member.avatar, size: "lg" },
    { atom: "text", text: member.email, variant: "muted" }
  ],
  onClick: () => goto(`/members/${member.id}`),
  variant: "outlined",
}
```

### TableOrganism (Enhanced)

Extended table with search, actions, and custom cell rendering.

```typescript
export interface TableOrganism<T = Record<string, unknown>> {
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

export interface TableColumn<T> {
  field: keyof T & string;
  header: string;
  sortable?: boolean;
  width?: string;
  // Custom rendering per column (single path, not two)
  render?: (value: unknown, row: T) => Section;
}

export interface TableAction<T> {
  icon: string;
  label: string;  // for a11y
  variant?: "default" | "danger";
  onClick: (row: T) => void | Promise<void>;  // Promise = auto loading
  visible?: (row: T) => boolean;
}

// Usage
{
  organism: "table",
  id: "members-table",
  data: () => memberService.list(),
  searchable: true,
  searchKeys: ["name", "email"],
  searchPlaceholder: "Search members...",
  emptyText: "No members found",
  columns: [
    { field: "name", header: "Name", sortable: true },
    { field: "email", header: "Email" },
    { field: "status", header: "Status", render: (val, row) => ({
      atom: "badge",
      text: val,
      color: row.active ? "green" : "gray"
    })},
    { field: "joined", header: "Joined", render: (val) => ({
      atom: "text",
      text: new Date(val).toLocaleDateString(),
      variant: "muted"
    })}
  ],
  actions: [
    {
      icon: "edit",
      label: "Edit member",
      onClick: (row) => openEditModal(row),
    },
    {
      icon: "trash",
      label: "Delete member",
      variant: "danger",
      onClick: async (row) => {
        await memberService.delete(row.id);
        toast.success("Member deleted");
      },
      visible: (row) => row.role !== "admin",
    }
  ],
  onRowClick: (row) => goto(`/members/${row.id}`),
}
```

---

## Inputs (Extended)

### SliderAtom

For range selection (volume, brightness, etc.).

```typescript
export interface SliderAtom extends FormAtom<number> {
  atom: "slider";
  id: string;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  marks?: SliderMark[];
}

export interface SliderMark {
  value: number;
  label?: string;
}

// Usage
{
  atom: "slider",
  id: "volume",
  label: "Volume",
  min: 0,
  max: 100,
  step: 1,
  showValue: true,
  value: () => audioStore.volume,
  onChange: (v) => audioStore.volume = v,
}

// With marks
{
  atom: "slider",
  id: "temperature",
  label: "Temperature",
  min: 0,
  max: 100,
  marks: [
    { value: 0, label: "Cold" },
    { value: 50, label: "Warm" },
    { value: 100, label: "Hot" },
  ],
  value: () => settings.temp,
  onChange: (v) => settings.temp = v,
}
```

### ComboboxMolecule

Enhanced select with search, multi-select, and create options.

```typescript
export interface ComboboxMolecule extends FormAtom<string | string[]> {
  molecule: "combobox";
  id: string;
  label?: string;
  placeholder?: string;
  options: SelectOption[] | (() => SelectOption[] | Promise<SelectOption[]>);
  multiple?: boolean;
  searchable?: boolean;
  creatable?: boolean; // allow creating new options
  onSearch?: (query: string) => void;
}

// Usage: Simple combobox
{
  molecule: "combobox",
  id: "country",
  label: "Country",
  placeholder: "Select a country...",
  options: countries,
  searchable: true,
  value: () => formStore.country,
  onChange: (v) => formStore.country = v,
}

// Usage: Multi-select tags
{
  molecule: "combobox",
  id: "tags",
  label: "Tags",
  placeholder: "Add tags...",
  options: () => tagService.search(query),
  multiple: true,
  searchable: true,
  creatable: true,
  onSearch: (q) => query = q,
  value: () => formStore.tags,
  onChange: (v) => formStore.tags = v,
}
```

---

## Feedback

### SkeletonAtom

Loading placeholder to prevent layout shift.

```typescript
export interface SkeletonAtom extends BaseAtom {
  atom: "skeleton";
  variant?: "text" | "circular" | "rectangular";
  width?: number | string;
  height?: number | string;
  lines?: number; // for text variant
}

// Usage: Avatar placeholder
{
  atom: "skeleton",
  variant: "circular",
  width: 48,
  height: 48,
}

// Usage: Text placeholder
{
  atom: "skeleton",
  variant: "text",
  lines: 3,
  width: "100%",
}

// Usage: Card placeholder
{
  atom: "skeleton",
  variant: "rectangular",
  width: "100%",
  height: 200,
}
```

### TooltipMolecule

Hover tooltip for any element.

```typescript
export interface TooltipMolecule {
  molecule: "tooltip";
  content: string;
  trigger: Section;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number; // ms before showing
}

// Usage
{
  molecule: "tooltip",
  content: "Delete this item permanently",
  position: "top",
  trigger: {
    atom: "icon-button",
    icon: "trash",
    label: "Delete",
    variant: "danger",
    onClick: handleDelete,
  }
}
```

### AlertDialogMolecule

Confirmation dialog for destructive actions. Simpler than Modal for yes/no decisions.

```typescript
export interface AlertDialogMolecule {
  molecule: "alert-dialog";
  id: string;
  title: string;
  description?: string;
  open: () => boolean;
  onOpenChange: (open: boolean) => void;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  variant?: "default" | "danger";
}

// Usage
{
  molecule: "alert-dialog",
  id: "confirm-delete",
  title: "Delete project?",
  description: "This action cannot be undone. All data will be permanently removed.",
  open: () => showDeleteDialog,
  onOpenChange: (open) => showDeleteDialog = open,
  cancelText: "Cancel",
  confirmText: "Delete",
  variant: "danger",
  onCancel: () => showDeleteDialog = false,
  onConfirm: async () => {
    await projectService.delete(projectId);
    showDeleteDialog = false;
  },
}
```

---

## Disclosure

### AccordionMolecule

Collapsible sections for FAQ, settings, etc.

```typescript
export interface AccordionMolecule {
  molecule: "accordion";
  id: string;
  items: AccordionItem[];
  type?: "single" | "multiple"; // single = only one open at a time
  defaultOpen?: string[]; // item ids
}

export interface AccordionItem {
  id: string;
  title: string;
  content: Section[];
  disabled?: boolean;
}

// Usage: FAQ
{
  molecule: "accordion",
  id: "faq",
  type: "single",
  items: [
    {
      id: "q1",
      title: "What is DAUI?",
      content: [
        { atom: "text", text: "DAUI is a declarative UI pattern where pages are defined as data, not code." }
      ]
    },
    {
      id: "q2",
      title: "How do I add new components?",
      content: [
        { atom: "text", text: "Define a TypeScript interface, add to the union type, then implement the renderer." }
      ]
    },
  ]
}

// Usage: Settings with multiple open
{
  molecule: "accordion",
  id: "settings",
  type: "multiple",
  defaultOpen: ["appearance"],
  items: [
    {
      id: "appearance",
      title: "Appearance",
      content: [
        { atom: "switch", id: "dark-mode", label: "Dark Mode", ... },
        { atom: "select", id: "theme", label: "Theme", ... },
      ]
    },
    {
      id: "notifications",
      title: "Notifications",
      content: [
        { atom: "switch", id: "email", label: "Email notifications", ... },
      ]
    },
  ]
}
```

### PopoverMolecule

Content popup anchored to a trigger element.

```typescript
export interface PopoverMolecule {
  molecule: "popover";
  id: string;
  trigger: Section;
  content: Section[];
  position?: "top" | "bottom" | "left" | "right";
  open?: () => boolean;
  onOpenChange?: (open: boolean) => void;
}

// Usage: User card popover
{
  molecule: "popover",
  id: "user-popover",
  position: "bottom",
  trigger: {
    atom: "avatar",
    src: () => user.avatar,
    fallback: "JD",
    size: "sm",
  },
  content: [
    { atom: "text", text: user.name, variant: "heading" },
    { atom: "text", text: user.email, variant: "muted" },
    { atom: "divider", spacing: "sm" },
    { atom: "button", text: "View Profile", variant: "secondary", onClick: viewProfile },
  ]
}
```

---

## Menus

### ContextMenuMolecule

Right-click menu for table rows, cards, etc.

```typescript
export interface ContextMenuMolecule {
  molecule: "context-menu";
  id: string;
  trigger: Section;
  items: MenuItem[]; // reuses MenuItem from MenuMolecule
}

// Usage: Table row with context menu
{
  molecule: "context-menu",
  id: "row-actions",
  trigger: {
    molecule: "stack",
    direction: "horizontal",
    items: [
      { atom: "text", text: row.name },
      { atom: "text", text: row.email, variant: "muted" },
    ]
  },
  items: [
    { label: "Edit", icon: "edit", onClick: () => editRow(row) },
    { label: "Duplicate", icon: "copy", onClick: () => duplicateRow(row) },
    { divider: true },
    { label: "Delete", icon: "trash", onClick: () => deleteRow(row) },
  ]
}
```

### CommandOrganism

Command palette for keyboard-driven navigation (Cmd+K style).

```typescript
export interface CommandOrganism {
  organism: "command";
  id: string;
  open: () => boolean;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;
  groups: CommandGroup[];
  onSelect?: (value: string) => void;
  emptyText?: string;
}

export interface CommandGroup {
  label?: string;
  items: CommandItem[];
}

export interface CommandItem {
  value: string;
  label: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  onSelect?: () => void;
}

// Usage
{
  organism: "command",
  id: "command-palette",
  open: () => commandOpen,
  onOpenChange: (open) => commandOpen = open,
  placeholder: "Type a command or search...",
  emptyText: "No results found",
  groups: [
    {
      label: "Navigation",
      items: [
        { value: "home", label: "Go to Home", icon: "home", shortcut: "G H", onSelect: () => goto("/") },
        { value: "settings", label: "Go to Settings", icon: "cog", shortcut: "G S", onSelect: () => goto("/settings") },
      ]
    },
    {
      label: "Actions",
      items: [
        { value: "new-project", label: "Create Project", icon: "plus", shortcut: "C P", onSelect: openNewProject },
        { value: "search", label: "Search", icon: "search", shortcut: "/", onSelect: focusSearch },
      ]
    }
  ]
}
```

---

## Containers

### ScrollAreaMolecule

Custom scrollbar container for consistent cross-browser styling.

```typescript
export interface ScrollAreaMolecule {
  molecule: "scroll-area";
  maxHeight?: number | string;
  maxWidth?: number | string;
  content: Section[];
}

// Usage: Scrollable sidebar
{
  molecule: "scroll-area",
  maxHeight: "calc(100vh - 64px)",
  content: [
    { molecule: "list", id: "nav-items", items: () => navItems, ... }
  ]
}

// Usage: Horizontal scroll
{
  molecule: "scroll-area",
  maxWidth: "100%",
  content: [
    {
      molecule: "stack",
      direction: "horizontal",
      gap: "md",
      items: images.map(img => ({ atom: "image", src: img.url, ... }))
    }
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

---

## Common Patterns

### Pattern: Searchable List

To make a list searchable, compose a `SearchInputAtom` with a filtered `ListOrganism` using a reactive store. Don't look for a `searchable` prop on the list itself—that's intentional.

**Why no built-in search?** Lists have free-form content (leading/content/trailing slots), making it unclear what to search on. Instead, you control the filtering logic explicitly.

```typescript
// 1. State & Logic (in your page/store)
const query = writable("");
const allUsers = [...];

const filteredUsers = derived(query, ($q) =>
  allUsers
    .filter(u => u.name.toLowerCase().includes($q.toLowerCase()))
    .map(u => ({
      key: u.id,
      content: { atom: "text", text: u.name },
      trailing: { atom: "badge", text: u.role, color: "blue" },
      data: u
    }))
);

// 2. UI Definition
{
  molecule: "stack",
  direction: "vertical",
  gap: "md",
  items: [
    {
      atom: "search-input",
      id: "user-search",
      placeholder: "Search users...",
      onSearch: (v) => query.set(v)
    },
    {
      molecule: "list",
      id: "user-list",
      items: () => get(filteredUsers),
      emptyText: "No users found",
      onItemClick: (user) => goto(`/users/${user.id}`)
    }
  ]
}
```

**Note:** `TableOrganism` has built-in `searchable` because tables have standardized layouts with toolbars. Lists are more free-form, so filtering is left to the developer.
