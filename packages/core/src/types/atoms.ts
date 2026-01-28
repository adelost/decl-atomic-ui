/**
 * Atom type definitions - Single UI elements
 */
import type { BaseAtom, FormAtom, Callback } from './base';
import type { ActionDef } from './action';
import type { Section } from './page';

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
  disabled?: boolean;
  maxSize?: number; // Max file size in bytes
  placeholder?: string;
  sublabel?: string;
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
  placeholder?: string;
  minDate?: Date | string;
  maxDate?: Date | string;
  disabled?: boolean;
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

export interface SeparatorAtom extends BaseAtom {
  atom: 'separator';

  /** Shape of the separator curve */
  shape?: 'wave' | 'curve' | 'slant' | 'zigzag' | 'triangle';

  /** Fill color (CSS color or theme token) */
  color?: string;

  /** Height in pixels */
  height?: number;

  /** Flip vertically */
  flip?: boolean;

  /** Position relative to parent (affects z-index) */
  position?: 'top' | 'bottom';
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

/** Audio waveform visualization with click-to-seek */
export interface WaveformAtom extends BaseAtom {
  atom: 'waveform';
  samples: number[] | (() => number[]); // Normalized 0-1 amplitude values
  duration: number;
  currentTime?: () => number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  onClick?: (time: number) => void;
}

/** Audio player with playback controls */
export interface AudioPlayerAtom extends BaseAtom {
  atom: 'audio-player';
  src: string | (() => string);

  // Playback control (optional controlled mode)
  currentTime?: () => number;
  onTimeUpdate?: (time: number) => void;
  playing?: () => boolean;
  onPlayPause?: (playing: boolean) => void;

  // Features
  showDownload?: boolean;
  showProgress?: boolean;
  showDuration?: boolean;
  downloadFilename?: string;

  // Appearance
  size?: 'sm' | 'md' | 'lg';
}

/** Simple time display with multiple formats */
export interface TimeDisplayAtom extends BaseAtom {
  atom: 'time-display';
  time: number | (() => number);
  format?: 'short' | 'long' | 'timecode' | 'frames';
  fps?: number;
  size?: 'sm' | 'md' | 'lg';
}

/** Video frame thumbnail extraction */
export interface ThumbnailAtom extends BaseAtom {
  atom: 'thumbnail';
  src: string | (() => string);
  time: number | (() => number);
  width?: number;
  height?: number;
  rounded?: boolean | 'sm' | 'md' | 'lg';
  placeholder?: string;
  onClick?: () => void;
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

// ============================================
// NEW ATOMS (shadcn/Bits UI inspired)
// ============================================

/** PIN/OTP code input with individual digit fields */
export interface PinInputAtom extends FormAtom<string> {
  atom: 'pin-input';
  id: string;
  /** Number of digits (default: 6) */
  length?: number;
  /** Hide digits for security (default: false) */
  mask?: boolean;
  /** Input type restriction */
  type?: 'numeric' | 'alphanumeric';
  /** Placeholder character for empty slots */
  placeholder?: string;
  disabled?: boolean;
  /** Called when all digits are filled */
  onComplete?: (value: string) => unknown;
}

/** Toggle button (pressable on/off state) */
export interface ToggleAtom extends FormAtom<boolean> {
  atom: 'toggle';
  id?: string;
  /** Visual style */
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Content (usually icon or text) */
  children: Section[];
}

/** Keyboard shortcut display */
export interface KbdAtom extends BaseAtom {
  atom: 'kbd';
  /** Key(s) to display - 'Ctrl+S' or ['Ctrl', 'S'] */
  keys: string | string[];
  size?: 'sm' | 'md';
}

/** Capacity/level indicator (semantic alternative to Progress) */
export interface MeterAtom extends BaseAtom {
  atom: 'meter';
  /** Current value */
  value: number | (() => number);
  /** Minimum value (default: 0) */
  min?: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** Values below this are "low" */
  low?: number;
  /** Values above this are "high" */
  high?: number;
  /** Optimal value (determines color) */
  optimum?: number;
  label?: string;
  showValue?: boolean;
}

/** Time input field (HH:MM) */
export interface TimeFieldAtom extends FormAtom<string> {
  atom: 'time-field';
  id: string;
  label?: string;
  placeholder?: string;
  /** Time format (default: '24h') */
  format?: '12h' | '24h';
  /** Minutes step (default: 1) */
  step?: number;
  /** Minimum time (e.g., "09:00") */
  min?: string;
  /** Maximum time (e.g., "17:00") */
  max?: string;
  disabled?: boolean;
  required?: boolean;
}

/** Date range input fields (start/end) */
export interface DateRangeFieldAtom extends FormAtom<{ start: Date | null; end: Date | null }> {
  atom: 'date-range-field';
  id: string;
  label?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  minDate?: Date | string;
  maxDate?: Date | string;
  disabled?: boolean;
  required?: boolean;
}

/** Union of all atom types */
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
  | SeparatorAtom
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
  | WaveformAtom
  | AudioPlayerAtom
  | TimeDisplayAtom
  | ThumbnailAtom
  // Integration Atoms (require external libraries)
  | ThreeCanvasAtom
  | MatterCanvasAtom
  | MotionCanvasAtom
  | CodeBlockAtom
  | CodeEditorAtom
  // New Atoms (shadcn/Bits UI inspired)
  | PinInputAtom
  | ToggleAtom
  | KbdAtom
  | MeterAtom
  | TimeFieldAtom
  | DateRangeFieldAtom;
