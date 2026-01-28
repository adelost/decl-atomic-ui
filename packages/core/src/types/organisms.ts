/**
 * Organism type definitions - Complex UI components
 */
import type { BaseAtom } from './base';
import type { Section } from './page';
import type { ChatAuthor, ChatMessage } from './molecules';

// ============================================
// TABLE ORGANISM
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

// ============================================
// LAYOUT ORGANISMS
// ============================================

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

// ============================================
// DIALOG ORGANISMS
// ============================================

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

// ============================================
// TREE VIEW ORGANISM
// ============================================

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

// ============================================
// MEDIA OVERLAY (Canvas-based, high performance)
// ============================================

/** Base overlay item with common properties */
export interface MediaOverlayItemBase {
  id?: string;
  color?: string;
  startTime?: number;
  endTime?: number;
}

/** Box overlay item */
export interface MediaOverlayBox extends MediaOverlayItemBase {
  bbox: [number, number, number, number]; // [x, y, width, height] normalized 0-1
  label?: string;
  confidence?: number;
}

/** Pose overlay item (COCO 17-keypoint format) */
export interface MediaOverlayPose extends MediaOverlayItemBase {
  keypoints: [number, number, number][]; // [x, y, confidence] normalized 0-1
  label?: string;
}

/** Mask overlay item (polygon) */
export interface MediaOverlayMask extends MediaOverlayItemBase {
  polygon: [number, number][]; // Array of [x, y] points normalized 0-1
  label?: string;
}

/** Point overlay item */
export interface MediaOverlayPoint extends MediaOverlayItemBase {
  point: [number, number]; // [x, y] normalized 0-1
  label?: string;
  radius?: number;
}

/** Custom overlay item for user-defined rendering */
export interface MediaOverlayCustom extends MediaOverlayItemBase {
  data: unknown;
}

/** Union of all overlay item types */
export type MediaOverlayItem =
  | MediaOverlayBox
  | MediaOverlayPose
  | MediaOverlayMask
  | MediaOverlayPoint
  | MediaOverlayCustom;

/** Render options for overlay layers */
export interface MediaOverlayRenderOptions {
  showLabels?: boolean;
  lineWidth?: number;
  fillOpacity?: number;
  minConfidence?: number;
}

/** A layer in the media overlay */
export interface MediaOverlayLayer {
  id: string;
  type: 'boxes' | 'poses' | 'masks' | 'points' | 'custom';
  label?: string;
  visible?: boolean | (() => boolean);
  data: MediaOverlayItem[] | (() => MediaOverlayItem[]);
  color?: string;
  temporal?: boolean;
  options?: MediaOverlayRenderOptions;
  /** Custom render function for 'custom' type */
  render?: (
    ctx: CanvasRenderingContext2D,
    items: MediaOverlayCustom[],
    options: { scale: { x: number; y: number }; devicePixelRatio: number }
  ) => void;
}

/** High-performance canvas-based media overlay */
export interface MediaOverlayOrganism extends BaseAtom {
  organism: 'media-overlay';
  id: string;
  src: string | (() => string);
  type?: 'video' | 'image';

  // Playback control
  currentTime?: () => number;
  duration?: () => number;
  onTimeUpdate?: (time: number) => void;

  // Layers
  layers: MediaOverlayLayer[];

  // UI options
  showOverlayToggles?: boolean;
  showLegend?: boolean;
  showFps?: boolean;
  controls?: boolean;
  aspectRatio?: string;

  // Performance
  maxOverlays?: number;

  // Interaction
  onOverlayClick?: (item: MediaOverlayItem, layerId: string) => void;
  onOverlayHover?: (item: MediaOverlayItem | null, layerId: string | null) => void;
}

// ============================================
// THREE.JS ORGANISMS
// ============================================

/** 2.5D depth map viewer using Three.js */
export interface DepthViewerOrganism extends BaseAtom {
  organism: 'depth-viewer';
  id?: string;

  // Sources
  colorSrc: string | (() => string);
  depthSrc: string | (() => string);
  isVideo?: boolean;

  // Initial settings
  resolution?: number;
  displacement?: number;
  autoRotate?: boolean;
  showWireframe?: boolean;

  // UI options
  showControls?: boolean;
  height?: number;

  // Video callbacks
  onTimeUpdate?: (time: number) => void;
}

/** 3D pose data for Pose3DViewer */
export interface Pose3DData {
  timestamp: number;
  keypoints_3d: number[][];
  track_id?: string | number;
  confidence?: number;
}

/** 3D skeleton viewer using Three.js */
export interface Pose3DViewerOrganism extends BaseAtom {
  organism: 'pose-3d-viewer';
  id?: string;

  // Pose data (array of timestamped 3D poses)
  poses3d: Pose3DData[] | (() => Pose3DData[]);

  // Timeline sync
  currentTime: number | (() => number);

  // Display options
  showGround?: boolean;
  showAxes?: boolean;
  autoRotate?: boolean;
  height?: number;
}

// Keep old names for backwards compatibility (deprecated)
/** @deprecated Use MediaOverlayItem instead */
export type CanvasOverlayItem = MediaOverlayItem;
/** @deprecated Use MediaOverlayLayer instead */
export type CanvasOverlayLayer = MediaOverlayLayer;
/** @deprecated Use MediaOverlayOrganism instead */
export type CanvasOverlayOrganism = MediaOverlayOrganism;

/** Union of all organism types */
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
  | VideoPlayerOrganism
  | MediaOverlayOrganism
  // Three.js Organisms
  | DepthViewerOrganism
  | Pose3DViewerOrganism;
