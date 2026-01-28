/**
 * Molecule type definitions - Composite UI patterns
 */
import type { BaseAtom, FormAtom } from './base';
import type { ActionDef } from './action';
import type { Section } from './page';
import type { ButtonAtom, BadgeAtom, SelectOption, ChatAuthor } from './atoms';

export interface FormMolecule<T = Record<string, unknown>> extends BaseAtom {
  molecule: 'form';
  id: string;
  onSubmit?: (values: T) => unknown;
  action?: string;
  fields: Section[];
  /** Declarative action with automatic side effects */
  $action?: ActionDef;
}

export interface ActionsMolecule extends BaseAtom {
  molecule: 'actions';
  items: ButtonAtom[];
}

export interface LabelValueMolecule extends BaseAtom {
  molecule: 'label-value';
  items: { label: string; value: string | number }[];
}

export interface GridMolecule extends BaseAtom {
  molecule: 'grid';
  columns?: number | ResponsiveColumns;
  gap?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  items: Section[];
}

export interface ResponsiveColumns {
  default?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export interface StackMolecule extends BaseAtom {
  molecule: 'stack';
  direction?: 'horizontal' | 'vertical';
  gap?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  items: Section[];
}

export interface TabsMolecule extends BaseAtom {
  molecule: 'tabs';
  id: string;
  activeTab?: () => string;
  onTabChange?: (tabId: string) => unknown;
  tabs: TabItem[];
}

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  content: Section[];
}

export interface MenuMolecule extends BaseAtom {
  molecule: 'menu';
  id: string;
  trigger: ButtonAtom;
  items: MenuItem[];
  position?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}

export interface MenuItem {
  label: string;
  icon?: string;
  onClick?: () => unknown;
  disabled?: boolean;
  divider?: boolean;
  items?: MenuItem[];
}

export interface BreadcrumbsMolecule extends BaseAtom {
  molecule: 'breadcrumbs';
  items: BreadcrumbItem[];
  separator?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => unknown;
}

export interface PaginationMolecule extends BaseAtom {
  molecule: 'pagination';
  currentPage: () => number;
  totalPages: () => number;
  onPageChange: (page: number) => unknown;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

export interface StepperMolecule extends BaseAtom {
  molecule: 'stepper';
  id: string;
  currentStep: () => number;
  onStepChange?: (step: number) => unknown;
  steps: StepItem[];
  orientation?: 'horizontal' | 'vertical';
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
  molecule: 'search-select';
  id: string;
  label?: string;
  options: () => SearchSelectOption[] | Promise<SearchSelectOption[]>;
  placeholder?: string;
  onSearch?: (query: string) => unknown;
}

export interface SearchSelectOption {
  value: string;
  label: string;
  subtitle?: string;
}

export interface StatCardMolecule extends BaseAtom {
  molecule: 'stat-card';
  title: string;
  value: string | number | (() => string | number);
  change?: { value: number; label?: string };
  icon?: string;
}

export interface TimelineMolecule<T = unknown> extends BaseAtom {
  molecule: 'timeline';
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
  molecule: 'alert-panel';
  type: 'info' | 'success' | 'warning' | 'error' | (() => 'info' | 'success' | 'warning' | 'error');
  message: string | (() => string);
  dismissible?: boolean;
  onDismiss?: () => unknown;
}

export interface ContainerMolecule extends BaseAtom {
  molecule: 'container';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  items: Section[];
}

export interface HeroMolecule extends BaseAtom {
  molecule: 'hero';

  /** Background image URL */
  backgroundImage?: string;

  /** Background color (fallback or overlay base) */
  backgroundColor?: string;

  /** Overlay color with opacity (e.g., "rgba(0,0,0,0.5)") */
  overlayColor?: string;

  /** Background position */
  backgroundPosition?: string;

  /** Enable parallax scrolling effect on background */
  parallax?: boolean;

  /** Parallax intensity (0.1 = subtle, 0.5 = strong) */
  parallaxSpeed?: number;

  /** Predefined height variants */
  height?: 'sm' | 'md' | 'lg' | 'full';

  /** Content alignment */
  align?: 'left' | 'center' | 'right';

  /** Vertical alignment */
  verticalAlign?: 'top' | 'center' | 'bottom';

  /** Max content width */
  contentWidth?: 'sm' | 'md' | 'lg' | 'full';

  /** Bottom separator config */
  separator?: {
    shape: 'wave' | 'curve' | 'slant' | 'triangle';
    color?: string;
    height?: number;
  };

  /** Content sections */
  items: Section[];
}

export interface TooltipMolecule extends BaseAtom {
  molecule: 'tooltip';
  content: string;
  trigger: Section;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export interface PopoverMolecule extends BaseAtom {
  molecule: 'popover';
  id: string;
  trigger: Section;
  content: Section[];
  position?: 'top' | 'bottom' | 'left' | 'right';
  open?: () => boolean;
  onOpenChange?: (open: boolean) => unknown;
}

export interface AccordionMolecule extends BaseAtom {
  molecule: 'accordion';
  id?: string;
  items: AccordionItem[];
  type?: 'single' | 'multiple'; // single = only one open at a time
  collapsible?: boolean;
  value?: () => string | string[];
  onValueChange?: (value: string | string[]) => unknown;
}

export interface AccordionItem {
  id: string;
  title: string;
  content: string; // Simple string content for now
  disabled?: boolean;
}

export interface DropdownMenuMolecule extends BaseAtom {
  molecule: 'dropdown-menu';
  trigger: Section[];
  items: DropdownMenuItem[];
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
}

export interface DropdownMenuItem {
  id?: string;
  type?: 'separator';
  label?: string;
  icon?: string;
  disabled?: boolean;
  destructive?: boolean;
  onSelect?: () => unknown;
}

export interface AlertDialogMolecule extends BaseAtom {
  molecule: 'alert-dialog';
  id: string;
  title: string;
  description?: string;
  open: () => boolean;
  onOpenChange: (open: boolean) => unknown;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => unknown;
  onConfirm?: () => unknown;
  variant?: 'default' | 'danger';
}

export interface ComboboxMolecule extends FormAtom<string | string[]> {
  molecule: 'combobox';
  id: string;
  label?: string;
  placeholder?: string;
  options: SelectOption[] | (() => SelectOption[] | Promise<SelectOption[]>);
  multiple?: boolean;
  searchable?: boolean;
  creatable?: boolean; // allow creating new options
  onSearch?: (query: string) => unknown;
}

export interface ContextMenuMolecule extends BaseAtom {
  molecule: 'context-menu';
  id: string;
  trigger: Section;
  items: MenuItem[];
}

export interface ScrollAreaMolecule extends BaseAtom {
  molecule: 'scroll-area';
  maxHeight?: number | string;
  maxWidth?: number | string;
  content: Section[];
}

export interface PageHeaderMolecule extends BaseAtom {
  molecule: 'page-header';
  title: string | (() => string);
  subtitle?: string | (() => string);
  actions?: Section[];
  badge?: BadgeAtom;
}

export interface FilterBarMolecule extends BaseAtom {
  molecule: 'filter-bar';
  search?: {
    id?: string;
    placeholder?: string;
    value: () => string;
    onChange: (value: string) => unknown;
  };
  filters?: FilterBarFilter[];
}

export interface FilterBarFilter {
  id: string;
  label?: string;
  options: SelectOption[] | (() => SelectOption[]);
  value: () => string;
  onChange: (value: string) => unknown;
}

// ============================================
// CHAT MOLECULES
// ============================================

/** Chat message data structure */
export interface ChatMessage {
  id: string;
  content: string;
  author: ChatAuthor;
  timestamp: number;
  variant?: 'user' | 'assistant' | 'system';
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
  replyTo?: { author: string; content: string };
}

/** Text input with send button for chat */
export interface ChatInputMolecule extends BaseAtom {
  molecule: 'chat-input';
  id?: string;
  placeholder?: string;
  disabled?: boolean | (() => boolean);
  onSend: (message: string) => unknown;
  onTyping?: (isTyping: boolean) => unknown;
  maxLength?: number;
  showCharCount?: boolean;
}

/** Header bar for chat panel */
export interface ChatHeaderMolecule extends BaseAtom {
  molecule: 'chat-header';
  title: string | (() => string);
  subtitle?: string | (() => string);
  avatar?: ChatAuthor;
  status?: 'online' | 'offline' | 'typing' | (() => 'online' | 'offline' | 'typing');
  actions?: Section[];
  onClose?: () => unknown;
  onMinimize?: () => unknown;
}

/** Scrollable list of chat messages with auto-scroll */
export interface ChatMessagesListMolecule extends BaseAtom {
  molecule: 'chat-messages-list';
  id?: string;
  messages: () => ChatMessage[] | Promise<ChatMessage[]>;
  currentUserId?: string;
  showTimestamps?: boolean;
  groupByDate?: boolean;
  typingIndicator?: ChatAuthor | (() => ChatAuthor | null);
  onMessageClick?: (message: ChatMessage) => unknown;
  emptyText?: string;
}

// ============================================
// VIDEO EDITOR MOLECULES
// ============================================

/** A single track row in the timeline */
export interface TrackMolecule extends BaseAtom {
  molecule: 'track';
  id: string;
  label: string;
  icon?: string;
  duration: () => number;
  currentTime: () => number;
  trackVisible?: boolean | (() => boolean);
  onVisibilityChange?: (visible: boolean) => void;
  onSeek?: (time: number) => void;
  segments?: TrackSegmentData[];
  markers?: TrackMarkerData[];
}

export interface TrackSegmentData {
  id: string;
  start: number;
  end: number;
  color?: string;
  label?: string;
}

export interface TrackMarkerData {
  id: string;
  time: number;
  variant?: 'dot' | 'triangle' | 'text';
  label?: string;
  color?: string;
  count?: number;
}

/** Frame-by-frame navigation controls */
export interface FrameControlsMolecule extends BaseAtom {
  molecule: 'frame-controls';
  fps: number;
  currentTime: () => number;
  duration: () => number;
  onSeek: (time: number) => void;
}

/** Playback speed selector (0.25x - 2x) */
export interface SpeedControlMolecule extends BaseAtom {
  molecule: 'speed-control';
  speed: () => number;
  onChange: (speed: number) => void;
  options?: number[]; // Default: [0.25, 0.5, 1, 1.5, 2]
}

/** Label + value displayed vertically */
export interface DataPointMolecule extends BaseAtom {
  molecule: 'data-point';
  label: string;
  value: string | number | (() => string | number);
  variant?: 'default' | 'large';
}

/** Clickable tags with optional size weighting */
export interface TagCloudMolecule extends BaseAtom {
  molecule: 'tag-cloud';
  tags: TagCloudItem[];
  onTagClick?: (tag: string) => void;
}

export interface TagCloudItem {
  label: string;
  count?: number; // For size weighting
  color?: string;
  active?: boolean;
}

/** Individual toggle item for overlay controls */
export interface OverlayToggleItem {
  id: string;
  label: string;
  icon?: string;
  enabled: () => boolean;
  onChange: (enabled: boolean) => void;
}

/** Toggle controls for overlay visibility */
export interface OverlayTogglesMolecule extends BaseAtom {
  molecule: 'overlay-toggles';
  items: OverlayToggleItem[];
  showAllToggle?: boolean;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md';
}

/** A variant option for ShowcaseMolecule */
export interface ShowcaseVariant {
  /** Label shown in the variant selector */
  label: string;
  /** The component definition for this variant */
  component: Section;
}

/** Displays a component alongside its code definition */
export interface ShowcaseMolecule extends BaseAtom {
  molecule: 'showcase';
  /** Title shown above the showcase */
  title?: string;
  /** Description text */
  description?: string;
  /** The component definition to render AND display as code (used when no variants) */
  component?: Section;
  /** Interactive variants - user can switch between them */
  variants?: ShowcaseVariant[];
  /** Additional static examples to show below */
  children?: Section[];
  /** Layout style - defaults to 'stacked' */
  layout?: 'side-by-side' | 'stacked';
  /** Code language for syntax highlighting */
  codeLanguage?: 'typescript' | 'json';
  /** Whether to show line numbers in code */
  showLineNumbers?: boolean;
  /** Alignment of the previewed component */
  previewAlign?: 'center' | 'stretch';
}

/** List molecule for displaying items */
export interface ListMolecule<T = unknown> extends BaseAtom {
  molecule: 'list';
  id: string;
  items: () => ListItem<T>[] | Promise<ListItem<T>[]>;
  onItemClick?: (item: T) => unknown;
  emptyText?: string;
}

export interface ListItem<T = unknown> {
  key: string;
  leading?: Section;
  content: Section;
  trailing?: Section;
  data?: T;
}

// ============================================
// NEW MOLECULES (shadcn/Bits UI inspired)
// ============================================

/** Grouped toggle buttons (segmented control) */
export interface ToggleGroupMolecule extends FormAtom<string | string[]> {
  molecule: 'toggle-group';
  id?: string;
  /** 'single' = radio behavior, 'multiple' = checkbox behavior */
  type?: 'single' | 'multiple';
  items: ToggleGroupItem[];
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
}

export interface ToggleGroupItem {
  value: string;
  label?: string;
  icon?: string;
  disabled?: boolean;
}

/** Star rating input */
export interface RatingGroupMolecule extends FormAtom<number> {
  molecule: 'rating-group';
  id?: string;
  /** Maximum rating (default: 5) */
  max?: number;
  /** Icon name (default: 'star') */
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Readonly display mode */
  readonly?: boolean;
  /** Show numeric value */
  showValue?: boolean;
  /** Allow half-star ratings */
  allowHalf?: boolean;
}

/** Preview card on hover (user profiles, link previews) */
export interface HoverCardMolecule extends BaseAtom {
  molecule: 'hover-card';
  /** Element that triggers the hover card */
  trigger: Section[];
  /** Content shown in the card */
  content: Section[];
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  /** Delay before opening (ms) */
  openDelay?: number;
  /** Delay before closing (ms) */
  closeDelay?: number;
}

/** Calendar picker for date ranges */
export interface DateRangePickerMolecule extends FormAtom<{ start: Date | null; end: Date | null }> {
  molecule: 'date-range-picker';
  id: string;
  label?: string;
  placeholder?: string;
  minDate?: Date | string;
  maxDate?: Date | string;
  /** Number of calendar months to display (default: 2) */
  numberOfMonths?: 1 | 2;
  disabled?: boolean;
  required?: boolean;
}

/** Toolbar container for app/editor toolbars */
export interface ToolbarMolecule extends BaseAtom {
  molecule: 'toolbar';
  id?: string;
  orientation?: 'horizontal' | 'vertical';
  /** Keyboard navigation loops */
  loop?: boolean;
  items: ToolbarItem[];
}

export type ToolbarItem = ToolbarButton | ToolbarToggleGroup | ToolbarSeparator | ToolbarLink;

export interface ToolbarButton {
  type: 'button';
  icon?: string;
  label?: string;
  tooltip?: string;
  disabled?: boolean;
  onClick?: () => unknown;
}

export interface ToolbarToggleGroup {
  type: 'toggle-group';
  id: string;
  mode: 'single' | 'multiple';
  value: () => string | string[];
  onChange: (value: string | string[]) => unknown;
  items: { value: string; icon?: string; label?: string; tooltip?: string }[];
}

export interface ToolbarSeparator {
  type: 'separator';
}

export interface ToolbarLink {
  type: 'link';
  href: string;
  icon?: string;
  label?: string;
}

/** Union of all molecule types */
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
  | ContainerMolecule
  | HeroMolecule
  | TooltipMolecule
  | PopoverMolecule
  | AccordionMolecule
  | AlertDialogMolecule
  | DropdownMenuMolecule
  | ComboboxMolecule
  | ContextMenuMolecule
  | ScrollAreaMolecule
  | PageHeaderMolecule
  | FilterBarMolecule
  // Chat Molecules
  | ChatInputMolecule
  | ChatHeaderMolecule
  | ChatMessagesListMolecule
  // Video Editor Molecules
  | TrackMolecule
  | FrameControlsMolecule
  | SpeedControlMolecule
  | DataPointMolecule
  | TagCloudMolecule
  | OverlayTogglesMolecule
  | ShowcaseMolecule
  | ListMolecule<any>
  // New Molecules (shadcn/Bits UI inspired)
  | ToggleGroupMolecule
  | RatingGroupMolecule
  | HoverCardMolecule
  | DateRangePickerMolecule
  | ToolbarMolecule;
