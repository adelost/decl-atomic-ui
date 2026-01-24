/**
 * DAUI (Declarative Atomic UI) - Type Definitions
 *
 * Pages are data, not code. All UI components are defined as
 * TypeScript interfaces. The renderer interprets them.
 *
 * @see docs/svelte-implementation.md for full documentation
 */

// ============================================
// BASE INTERFACES
// ============================================

/** Common properties for all atoms */
export interface BaseAtom {
  visible?: () => boolean;
}

/** Form field atoms with typed value binding */
export interface FormAtom<T> extends BaseAtom {
  value?: () => T;
  onChange?: (value: T) => void;
  validate?: (value: T) => true | string | Promise<true | string>;
}

/**
 * Intent for Server-Driven UI (SDUI)
 *
 * When pages come from a server, functions can't be serialized.
 * Use Intent objects instead, mapped to handlers via an Intent Registry.
 *
 * @example
 * // Code-first (local):
 * onClick: () => cart.add(productId)
 *
 * // Server-driven (serializable):
 * onClick: { action: "cart.add", payload: { productId: "123" } }
 */
export interface Intent {
  action: string;
  payload?: Record<string, unknown>;
}

/** Callback that works both locally (function) and server-driven (Intent) */
export type Callback = (() => void | Promise<void>) | Intent;

// ============================================
// ATOMS
// ============================================

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
  options: SelectOption[] | (() => SelectOption[] | Promise<SelectOption[]>);
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
  onClick?: Callback;
  confirm?: string;
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
  color:
    | "green"
    | "yellow"
    | "red"
    | "blue"
    | "gray"
    | "gold"
    | (() => "green" | "yellow" | "red" | "blue" | "gray" | "gold");
}

export interface LabelAtom extends BaseAtom {
  atom: "label";
  text: string | (() => string);
  tooltip?: string;
}

export interface SwitchAtom extends FormAtom<boolean> {
  atom: "switch";
  id: string;
  label?: string;
}

export interface IconButtonAtom extends BaseAtom {
  atom: "icon-button";
  icon: string;
  label: string;
  variant?: "default" | "danger" | "ghost";
  onClick?: Callback;
  disabled?: boolean | (() => boolean);
}

export interface SearchInputAtom extends FormAtom<string> {
  atom: "search-input";
  id: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export interface NumberInputAtom extends FormAtom<number> {
  atom: "number-input";
  id: string;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface LinkAtom extends BaseAtom {
  atom: "link";
  text: string;
  href: string;
  variant?: "default" | "muted" | "back";
}

export interface DividerAtom extends BaseAtom {
  atom: "divider";
  spacing?: "sm" | "md" | "lg";
}

export interface TextAtom extends BaseAtom {
  atom: "text";
  text: string | (() => string);
  variant?: "default" | "muted" | "small" | "heading";
}

export interface ImageAtom extends BaseAtom {
  atom: "image";
  src: string | (() => string);
  alt: string;
  width?: number | string;
  height?: number | string;
  fallback?: string;
  objectFit?: "cover" | "contain" | "fill";
  rounded?: boolean | "sm" | "md" | "lg" | "full";
}

export interface AvatarAtom extends BaseAtom {
  atom: "avatar";
  src?: string | (() => string);
  alt?: string;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "square";
  status?: "online" | "offline" | "busy" | "away";
}

export interface ProgressAtom extends BaseAtom {
  atom: "progress";
  value: () => number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: "primary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
}

export interface ToastAtom extends BaseAtom {
  atom: "toast";
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export interface ChartAtom extends BaseAtom {
  atom: "chart";
  id?: string;
  type: "line" | "area" | "bar";
  data: ChartDataPoint[] | (() => ChartDataPoint[]);
  height?: number;
  color?: string;
  showGrid?: boolean;
  showLabels?: boolean;
  animate?: boolean;
  curve?: "linear" | "monotone" | "natural";
}

export interface ChartDataPoint {
  label: string;
  value: number;
  value2?: number; // For comparison charts
}

export interface IconAtom extends BaseAtom {
  atom: "icon";
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: string;
  class?: string;
}

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
  | LabelAtom
  | SwitchAtom
  | IconButtonAtom
  | SearchInputAtom
  | NumberInputAtom
  | LinkAtom
  | DividerAtom
  | TextAtom
  | ImageAtom
  | AvatarAtom
  | ProgressAtom
  | ToastAtom
  | ChartAtom
  | IconAtom;

// ============================================
// MOLECULES
// ============================================

export interface FormMolecule<T = Record<string, unknown>> {
  molecule: "form";
  id: string;
  onSubmit?: (values: T) => void;
  action?: string;
  fields: Section[];
}

export interface ActionsMolecule {
  molecule: "actions";
  items: ButtonAtom[];
}

export interface LabelValueMolecule {
  molecule: "label-value";
  items: { label: string; value: string | number }[];
}

export interface GridMolecule {
  molecule: "grid";
  columns?: number | ResponsiveColumns;
  gap?: "none" | "sm" | "md" | "lg";
  padding?: "none" | "sm" | "md" | "lg";
  items: Section[];
}

export interface ResponsiveColumns {
  default?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export interface StackMolecule {
  molecule: "stack";
  direction?: "horizontal" | "vertical";
  gap?: "none" | "sm" | "md" | "lg";
  padding?: "none" | "sm" | "md" | "lg";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
  items: Section[];
}

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
  divider?: boolean;
  items?: MenuItem[];
}

export interface BreadcrumbsMolecule {
  molecule: "breadcrumbs";
  items: BreadcrumbItem[];
  separator?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface PaginationMolecule {
  molecule: "pagination";
  currentPage: () => number;
  totalPages: () => number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

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
  validate?: () => boolean;
}

export interface SearchSelectMolecule extends FormAtom<string> {
  molecule: "search-select";
  id: string;
  label?: string;
  options: () => SearchSelectOption[] | Promise<SearchSelectOption[]>;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export interface SearchSelectOption {
  value: string;
  label: string;
  subtitle?: string;
}

export interface StatCardMolecule {
  molecule: "stat-card";
  title: string;
  value: string | number | (() => string | number);
  change?: { value: number; label?: string };
  icon?: string;
}

export interface TimelineMolecule<T = unknown> {
  molecule: "timeline";
  id: string;
  entries: () => TimelineEntry<T>[] | Promise<TimelineEntry<T>[]>;
}

export interface TimelineEntry<T = unknown> {
  timestamp: number;
  title: string;
  subtitle?: string;
  icon?: string;
  data?: T;
}

export interface AlertPanelMolecule extends BaseAtom {
  molecule: "alert-panel";
  type: "info" | "success" | "warning" | "error";
  message: string | (() => string);
  dismissible?: boolean;
  onDismiss?: () => void;
}

export interface ContainerMolecule {
  molecule: "container";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
  items: Section[];
}

export type Molecule =
  | FormMolecule<any>
  | ActionsMolecule
  | LabelValueMolecule
  | GridMolecule
  | StackMolecule
  | TabsMolecule
  | MenuMolecule
  | BreadcrumbsMolecule
  | PaginationMolecule
  | StepperMolecule
  | SearchSelectMolecule
  | StatCardMolecule
  | TimelineMolecule<any>
  | AlertPanelMolecule
  | ContainerMolecule;

// ============================================
// ORGANISMS
// ============================================

export interface TableOrganism<T = Record<string, unknown>> {
  organism: "table";
  id: string;
  data: () => T[] | Promise<T[]>;
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => void;
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  sortable?: boolean;
  paginated?: boolean;
  emptyText?: string;
  actions?: TableAction<T>[];
}

export interface TableColumn<T = Record<string, unknown>> {
  field: keyof T & string;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (value: unknown, row: T) => Section;
}

export interface TableAction<T> {
  icon: string;
  label: string;
  variant?: "default" | "danger";
  onClick: (row: T) => void | Promise<void>;
  visible?: (row: T) => boolean;
}

export interface SidebarOrganism {
  organism: "sidebar";
  items: { label: string; route: string; icon?: string }[];
}

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

export interface ListOrganism<T = unknown> {
  organism: "list";
  id: string;
  items: () => ListItem<T>[] | Promise<ListItem<T>[]>;
  onItemClick?: (item: T) => void;
  emptyText?: string;
}

export interface ListItem<T = unknown> {
  key: string;
  leading?: Section;
  content: Section;
  trailing?: Section;
  data?: T;
}

export interface CardOrganism {
  organism: "card";
  id?: string;
  header?: Section;
  media?: Section;
  content: Section[];
  footer?: Section;
  onClick?: () => void;
  variant?: "default" | "outlined" | "elevated";
}

export interface HeaderOrganism {
  organism: "header";
  logo?: { src: string; alt: string; href?: string };
  title?: string;
  nav?: NavItem[];
  actions?: Section[];
  sticky?: boolean;
}

export interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: () => boolean;
  items?: NavItem[];
}

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

export type Organism =
  | TableOrganism<any>
  | SidebarOrganism
  | ModalOrganism
  | DrawerOrganism
  | ListOrganism<any>
  | CardOrganism
  | HeaderOrganism
  | FooterOrganism;

// ============================================
// PAGE
// ============================================

export type Section = Atom | Molecule | Organism;

export interface Page {
  layout: "centered" | "full" | "sidebar";
  title: string;
  sections: Section[];
}
