/**
 * DAUI (Declarative Atomic UI) - Type Definitions
 *
 * Pages are data, not code. All UI components are defined as
 * TypeScript interfaces. The renderer interprets them.
 *
 * @see docs/svelte-implementation.md for full documentation
 */

// Re-export action types
export * from './action';

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
  onChange?: (value: T) => unknown;
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
export type Callback = (() => unknown) | Intent;

// ============================================
// ATOMS
// ============================================

export interface InputAtom extends FormAtom<string> {
  atom: 'input';
  id: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
}

export interface SelectAtom extends FormAtom<string> {
  atom: 'select';
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
  atom: 'radio';
  id: string;
  label?: string;
  options: string[];
  required?: boolean;
}

export interface ButtonAtom extends BaseAtom {
  atom: 'button';
  text: string | (() => string);
  variant?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'ghost'
    | (() => 'primary' | 'secondary' | 'danger' | 'ghost');
  submit?: boolean;
  disabled?: boolean | (() => boolean);
  onClick?: Callback;
  confirm?: string;
  /** Declarative action with automatic side effects */
  $action?: ActionDef;
}

export interface UploadAtom extends FormAtom<File | File[] | null> {
  atom: 'upload';
  id: string;
  label?: string;
  accept?: string[];
  multiple?: boolean;
  required?: boolean;
}

export interface CheckboxAtom extends FormAtom<boolean> {
  atom: 'checkbox';
  id: string;
  label: string;
}

export interface DateAtom extends FormAtom<Date | string | null> {
  atom: 'date';
  id: string;
  label?: string;
  required?: boolean;
}

export interface TextAreaAtom extends FormAtom<string> {
  atom: 'textarea';
  id: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export interface BadgeAtom extends BaseAtom {
  atom: 'badge';
  text: string | (() => string);
  color:
    | 'green'
    | 'yellow'
    | 'red'
    | 'blue'
    | 'gray'
    | 'gold'
    | (() => 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'gold');
}

export interface LabelAtom extends BaseAtom {
  atom: 'label';
  text: string | (() => string);
  tooltip?: string;
}

export interface SwitchAtom extends FormAtom<boolean> {
  atom: 'switch';
  id: string;
  label?: string;
}

export interface IconButtonAtom extends BaseAtom {
  atom: 'icon-button';
  icon: string;
  label: string;
  variant?: 'default' | 'danger' | 'ghost';
  onClick?: Callback;
  disabled?: boolean | (() => boolean);
}

export interface SearchInputAtom extends FormAtom<string> {
  atom: 'search-input';
  id: string;
  placeholder?: string;
  onSearch?: (query: string) => unknown;
}

export interface NumberInputAtom extends FormAtom<number> {
  atom: 'number-input';
  id: string;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface LinkAtom extends BaseAtom {
  atom: 'link';
  text: string;
  href: string;
  variant?: 'default' | 'muted' | 'back';
}

export interface DividerAtom extends BaseAtom {
  atom: 'divider';
  spacing?: 'sm' | 'md' | 'lg';
}

export interface TextAtom extends BaseAtom {
  atom: 'text';
  text: string | (() => string);
  variant?: 'default' | 'muted' | 'small' | 'heading';
}

export interface ImageAtom extends BaseAtom {
  atom: 'image';
  src: string | (() => string);
  alt: string;
  width?: number | string;
  height?: number | string;
  fallback?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'full';
}

export interface AvatarAtom extends BaseAtom {
  atom: 'avatar';
  src?: string | (() => string);
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'busy' | 'away';
}

export interface ProgressAtom extends BaseAtom {
  atom: 'progress';
  value: () => number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export interface ToastAtom extends BaseAtom {
  atom: 'toast';
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  dismissible?: boolean;
  onDismiss?: () => unknown;
}

export interface ChartAtom extends BaseAtom {
  atom: 'chart';
  id?: string;
  type: 'line' | 'area' | 'bar';
  data: ChartDataPoint[] | (() => ChartDataPoint[]);
  height?: number;
  color?: string;
  showGrid?: boolean;
  showLabels?: boolean;
  animate?: boolean;
  curve?: 'linear' | 'monotone' | 'natural' | (() => 'linear' | 'monotone' | 'natural');
}

export interface ChartDataPoint {
  label: string;
  value: number;
  value2?: number; // For comparison charts
}

export interface IconAtom extends BaseAtom {
  atom: 'icon';
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  class?: string;
}

export interface SpinnerAtom extends BaseAtom {
  atom: 'spinner';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

export interface SliderAtom extends FormAtom<number> {
  atom: 'slider';
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

export interface SkeletonAtom extends BaseAtom {
  atom: 'skeleton';
  variant?: 'text' | 'circular' | 'rectangular';
  width?: number | string;
  height?: number | string;
  lines?: number; // for text variant, renders multiple lines
}

export interface TooltipAtom extends BaseAtom {
  atom: 'tooltip';
  content: string | (() => string);
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
  children: Section[];
}

export interface PopoverAtom extends BaseAtom {
  atom: 'popover';
  open?: () => boolean;
  onOpenChange?: (open: boolean) => void;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  trigger: Section[];
  children: Section[];
}

export interface RadioGroupAtom extends FormAtom<string> {
  atom: 'radio-group';
  id?: string;
  label?: string;
  options: RadioGroupOption[];
  orientation?: 'horizontal' | 'vertical';
  required?: boolean;
}

export interface RadioGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// ============================================
// CHAT ATOMS
// ============================================

/** Author information for chat messages */
export interface ChatAuthor {
  id?: string;
  name: string;
  avatar?: string;
}

/** Single chat message bubble */
export interface ChatBubbleAtom extends BaseAtom {
  atom: 'chat-bubble';
  content: string | (() => string);
  author: ChatAuthor;
  timestamp?: number | (() => number);
  variant?: 'user' | 'assistant' | 'system';
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
  replyTo?: { author: string; content: string };
}

/** Animated typing indicator (three dots) */
export interface TypingIndicatorAtom extends BaseAtom {
  atom: 'typing-indicator';
  author?: ChatAuthor;
  size?: 'sm' | 'md' | 'lg';
}

// ============================================
// VIDEO EDITOR ATOMS
// ============================================

/** Vertical playhead line for timeline currentTime */
export interface PlayheadAtom extends BaseAtom {
  atom: 'playhead';
  time: () => number;
  duration: () => number;
  onSeek?: (time: number) => void;
  draggable?: boolean;
  color?: string;
}

/** Colored bar representing a time interval on a track */
export interface TrackSegmentAtom extends BaseAtom {
  atom: 'track-segment';
  start: number;
  end: number;
  duration: number;
  color?: string;
  label?: string;
  active?: boolean;
  onClick?: (e?: MouseEvent) => void;
}

/** Point marker on a track (dot, triangle, or text) */
export interface TrackMarkerAtom extends BaseAtom {
  atom: 'track-marker';
  time: number;
  duration: number;
  variant?: 'dot' | 'triangle' | 'text';
  label?: string;
  color?: string;
  count?: number; // For dot-size scaling
  onClick?: () => void;
}

/** Rectangle overlay with label for video detections */
export interface DetectionBoxAtom extends BaseAtom {
  atom: 'detection-box';
  bbox: [number, number, number, number]; // Normalized 0-1: [x, y, width, height]
  label?: string;
  color?: string;
  confidence?: number;
  onClick?: () => void;
}

/** 17-point skeleton overlay for pose visualization */
export interface PoseSkeletonAtom extends BaseAtom {
  atom: 'pose-skeleton';
  keypoints: [number, number, number][]; // [x, y, confidence] normalized 0-1
  color?: string;
  lineWidth?: number;
  showPoints?: boolean;
}

// ============================================
// INTEGRATION ATOMS (require external libraries)
// ============================================

/** Three.js 3D canvas - requires 'three' package */
export interface ThreeCanvasAtom extends BaseAtom {
  atom: 'three-canvas';
  width?: number;
  height?: number;
  background?: string;
  camera?: {
    fov?: number;
    position?: [number, number, number];
  };
  onReady?: (context: { scene: any; camera: any; renderer: any }) => void;
  onFrame?: (delta: number) => void;
}

/** Matter.js 2D physics canvas - requires 'matter-js' package */
export interface MatterCanvasAtom extends BaseAtom {
  atom: 'matter-canvas';
  width?: number;
  height?: number;
  background?: string;
  gravity?: { x: number; y: number };
  wireframes?: boolean;
  onReady?: (context: { engine: any; world: any; render: any }) => void;
  onFrame?: (delta: number) => void;
}

/** Motion Canvas animation - requires '@motion-canvas/core' package */
export interface MotionCanvasAtom extends BaseAtom {
  atom: 'motion-canvas';
  width?: number;
  height?: number;
  project?: any;
}

/** Code syntax highlighting - requires '@daui/shiki' package */
export interface CodeBlockAtom extends BaseAtom {
  atom: 'code-block';
  code: string | (() => string);
  language: 'json' | 'yaml' | 'typescript' | 'javascript' | 'markdown' | 'python' | 'html' | 'css' | 'svelte' | 'shell';
  theme?: 'dark' | 'light' | 'auto';
  showLineNumbers?: boolean;
  highlightLines?: number[]; // Lines to highlight
  maxHeight?: number | string;
  copyable?: boolean; // Show copy button (default: true)
}

/** Code editor - requires '@daui/codemirror' package */
export interface CodeEditorAtom extends FormAtom<string> {
  atom: 'code-editor';
  id: string;
  language: 'json' | 'yaml' | 'typescript' | 'javascript' | 'markdown' | 'python' | 'html' | 'css';
  height?: number | string;
  readonly?: boolean;
  showLineNumbers?: boolean;
  foldGutter?: boolean;
  lineWrapping?: boolean;
  placeholder?: string;
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
  | IconAtom
  | SpinnerAtom
  | SliderAtom
  | SkeletonAtom
  | TooltipAtom
  | PopoverAtom
  | RadioGroupAtom
  // Chat Atoms
  | ChatBubbleAtom
  | TypingIndicatorAtom
  // Video Editor Atoms
  | PlayheadAtom
  | TrackSegmentAtom
  | TrackMarkerAtom
  | DetectionBoxAtom
  | PoseSkeletonAtom
  // Integration Atoms (require external libraries)
  | ThreeCanvasAtom
  | MatterCanvasAtom
  | MotionCanvasAtom
  | CodeBlockAtom
  | CodeEditorAtom;

// ============================================
// MOLECULES
// ============================================

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
  | ShowcaseMolecule
  | ListMolecule<any>;

// ============================================
// ORGANISMS
// ============================================

export interface TableOrganism<T = Record<string, unknown>> extends BaseAtom {
  organism: 'table';
  id: string;
  data: () => T[] | Promise<T[]>;
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => unknown;

  // Search
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  showSearchCount?: boolean; // Show "3 of 10" counter (default: true when searchable)

  // Sorting
  sortable?: boolean;

  // Pagination
  paginated?: boolean;
  pageSize?: number; // Default: 10
  pageSizeOptions?: number[]; // e.g. [10, 25, 50, 100]

  // Row selection
  selectable?: boolean;
  selectedRows?: () => T[];
  onSelectionChange?: (rows: T[]) => unknown;
  bulkActions?: BulkAction<T>[];

  // Styling
  rowClass?: (row: T) => string; // Dynamic row classes (e.g. "inactive")
  emptyText?: string;
  searchEmptyText?: string; // Different message when search has no results

  // Row actions
  actions?: TableAction<T>[];
}

export interface TableColumn<T = Record<string, unknown>> {
  field: keyof T & string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T) => Section;
}

export interface BulkAction<T> {
  label: string;
  icon?: string;
  variant?: 'default' | 'danger';
  onClick: (rows: T[]) => unknown;
}

export interface TableAction<T> {
  icon: string;
  label: string;
  variant?: 'default' | 'danger';
  onClick: (row: T) => unknown;
  visible?: (row: T) => boolean;
}

export interface SidebarOrganism extends BaseAtom {
  organism: 'sidebar';
  items: { label: string; route: string; icon?: string }[];
}

export interface ModalOrganism extends BaseAtom {
  organism: 'modal';
  id: string;
  title: string | (() => string);
  open: () => boolean;
  onClose: () => unknown;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  content: Section[];
  footer?: Section[];
}

export interface DrawerOrganism extends BaseAtom {
  organism: 'drawer';
  id: string;
  title?: string;
  open: () => boolean;
  onClose: () => unknown;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg';
  content: Section[];
}

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

export interface CardOrganism extends BaseAtom {
  organism: 'card';
  id?: string;
  header?: Section;
  media?: Section;
  content: Section[];
  footer?: Section;
  onClick?: () => unknown;
  variant?: 'default' | 'outlined' | 'elevated';
}

export interface HeaderOrganism extends BaseAtom {
  organism: 'header';
  logo?: { src: string; alt: string; href?: string };
  title?: string;
  nav?: NavItem[];
  actions?: Section[];
  sticky?: boolean;
}

export interface NavItem {
  label: string;
  href?: string;
  onClick?: () => unknown;
  active?: () => boolean;
  items?: NavItem[];
}

export interface FooterOrganism extends BaseAtom {
  organism: 'footer';
  copyright?: string;
  links?: { label: string; href: string }[];
  columns?: FooterColumn[];
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface CommandOrganism extends BaseAtom {
  organism: 'command';
  id: string;
  open: () => boolean;
  onOpenChange: (open: boolean) => unknown;
  placeholder?: string;
  groups: CommandGroup[];
  onSelect?: (value: string) => unknown;
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
  onSelect?: () => unknown;
}

export interface AlertDialogOrganism extends BaseAtom {
  organism: 'alert-dialog';
  open: () => boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  variant?: 'default' | 'danger';
}

export interface TreeViewOrganism extends BaseAtom {
  organism: 'tree-view';
  id: string;
  nodes: TreeViewNode[];
  onNodeClick?: (node: TreeViewNode) => unknown;
  layout?: 'vertical' | 'horizontal';
  nodeSize?: 'sm' | 'md' | 'lg';
}

export interface TreeViewNode {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  status: 'locked' | 'available' | 'completed' | (() => 'locked' | 'available' | 'completed');
  parent?: string; // ID of parent node - creates edge
  href?: string;
  data?: unknown;
}

// ============================================
// CHAT ORGANISMS
// ============================================

/** Complete chat panel with header, messages, and input */
export interface ChatPanelOrganism extends BaseAtom {
  organism: 'chat-panel';
  id: string;

  // Header
  title?: string | (() => string);
  subtitle?: string | (() => string);
  avatar?: ChatAuthor;
  status?: 'online' | 'offline' | 'typing' | (() => 'online' | 'offline' | 'typing');
  showHeader?: boolean;

  // Messages
  messages: () => ChatMessage[] | Promise<ChatMessage[]>;
  currentUserId?: string;
  showTimestamps?: boolean;
  groupByDate?: boolean;
  typingIndicator?: ChatAuthor | (() => ChatAuthor | null);
  emptyText?: string;

  // Input
  placeholder?: string;
  onSend: (message: string) => unknown;
  onTyping?: (isTyping: boolean) => unknown;
  inputDisabled?: boolean | (() => boolean);

  // Actions
  onClose?: () => unknown;
  onMinimize?: () => unknown;
  headerActions?: Section[];

  // Styling
  height?: number | string;
  maxHeight?: number | string;
  variant?: 'default' | 'floating' | 'embedded';
}

// ============================================
// SLIDE MODAL ORGANISM
// ============================================

/** Theme for slide modal items */
export type SlideTheme = 'default' | 'gold' | 'cyan' | 'green' | 'purple';

/** Individual slide item in a slide modal */
export interface SlideItem {
  id: string;
  header?: string;
  icon?: string;
  title: string;
  subtitle?: string;
  content?: Section[];
  badge?: string;
  theme?: SlideTheme;
}

/** Multi-slide modal with queue navigation */
export interface SlideModalOrganism extends BaseAtom {
  organism: 'slide-modal';
  id: string;
  open: () => boolean;
  onClose: () => unknown;

  // Slides
  slides: SlideItem[] | (() => SlideItem[]);
  currentIndex?: () => number;
  onIndexChange?: (index: number) => unknown;

  // Navigation
  showDots?: boolean;
  showArrows?: boolean;
  nextText?: string;
  prevText?: string;
  closeText?: string;
  allowBackdropClose?: boolean;

  // Callbacks
  onSlideChange?: (slide: SlideItem, index: number) => unknown;
  onComplete?: () => unknown;

  // Styling
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'celebration' | 'onboarding';
}

// ============================================
// VIDEO EDITOR ORGANISMS
// ============================================

/** Multi-track timeline with zoom and keyboard shortcuts */
export interface VideoTimelineOrganism extends BaseAtom {
  organism: 'video-timeline';
  id: string;
  duration: () => number;
  currentTime: () => number;
  onSeek: (time: number) => void;

  // Tracks
  tracks: VideoTimelineTrack[];

  // Zoom
  zoom?: () => number;
  onZoomChange?: (zoom: number) => void;
  minZoom?: number; // Default: 1
  maxZoom?: number; // Default: 10

  // Selection
  selectedIds?: () => Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;

  // Keyboard shortcuts
  shortcuts?: {
    split?: boolean; // 'S' - split at playhead
    delete?: boolean; // 'D' - delete selected
    selectAll?: boolean; // 'Ctrl+A'
  };

  // Appearance
  height?: number;
  showTimeRuler?: boolean;
}

export interface VideoTimelineTrack {
  id: string;
  label: string;
  icon?: string;
  type: 'segments' | 'markers' | 'keyframes';
  color?: string;
  data: () => VideoTimelineTrackData[];
  visible?: boolean | (() => boolean);
  onVisibilityChange?: (visible: boolean) => void;
}

export interface VideoTimelineTrackData {
  id: string;
  start: number;
  end?: number; // For segments
  label?: string;
  color?: string;
  count?: number; // For markers
}

/** HTML5 video player with overlay support */
export interface VideoPlayerOrganism extends BaseAtom {
  organism: 'video-player';
  id: string;
  src: string | (() => string);
  type?: 'video' | 'image';
  poster?: string;

  // Playback control
  currentTime?: () => number;
  onTimeUpdate?: (time: number, duration: number) => void;
  playbackRate?: () => number;
  playing?: () => boolean;
  onPlayPause?: (playing: boolean) => void;

  // Overlays
  overlays?: () => VideoOverlay[];
  showOverlays?: {
    boxes?: boolean;
    faces?: boolean;
    poses?: boolean;
    subtitles?: boolean;
  };

  // Transcript/subtitles
  transcript?: () => TranscriptSegment[];
  showSubtitles?: boolean;

  // Interaction
  onOverlayClick?: (overlay: VideoOverlay) => void;
  onOverlayContextMenu?: (overlay: VideoOverlay, action: string) => void;

  // Appearance
  width?: number | string;
  height?: number | string;
  aspectRatio?: string; // e.g., "16/9"
  controls?: boolean;
}

export interface VideoOverlay {
  id?: string;
  type: 'box' | 'pose' | 'mask' | 'point';
  bbox?: [number, number, number, number]; // Normalized 0-1: [x, y, width, height]
  label?: string;
  color?: string;
  confidence?: number;
  keypoints?: [number, number, number][]; // For poses: [x, y, confidence]
  track_id?: number;
}

export interface TranscriptSegment {
  id?: string;
  start: number;
  end: number;
  text: string;
  words?: TranscriptWord[];
  speaker?: string;
}

export interface TranscriptWord {
  word: string;
  start: number;
  end: number;
  confidence?: number;
}

export type Organism =
  | TableOrganism<any>
  | SidebarOrganism
  | ModalOrganism
  | DrawerOrganism
  | CardOrganism
  | HeaderOrganism
  | FooterOrganism
  | CommandOrganism
  | TreeViewOrganism
  | AlertDialogOrganism
  // Chat Organisms
  | ChatPanelOrganism
  // Slide Modal
  | SlideModalOrganism
  // Video Editor Organisms
  | VideoTimelineOrganism
  | VideoPlayerOrganism;

// ============================================
// PAGE
// ============================================

export type Section = Atom | Molecule | Organism;

/** Keyboard shortcut definition for page-level actions */
export interface KeyboardShortcut {
  /** Single key ('s', 'Space', 'Escape') or sequence ('↑↑↓↓←→←→') */
  keys: string;
  /** Modifier keys for single-key shortcuts */
  modifiers?: ('ctrl' | 'shift' | 'alt' | 'meta')[];
  /** Action to execute */
  action: Callback;
  /** Description for help/tooltip */
  description?: string;
  /** Prevent default browser behavior */
  preventDefault?: boolean;
  /** Only trigger once (useful for easter eggs) */
  once?: boolean;
}

export interface Page {
  layout: 'centered' | 'full' | 'sidebar';
  title: string;
  sections: Section[];
  /** Page-level keyboard shortcuts */
  shortcuts?: KeyboardShortcut[];
}
