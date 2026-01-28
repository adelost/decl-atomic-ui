/**
 * Canvas Renderer Types
 * Shared types for all canvas renderers
 */

/** Normalized bounding box [x, y, width, height] in 0-1 range */
export type BBox = [number, number, number, number];

/** Normalized point [x, y] in 0-1 range */
export type Point = [number, number];

/** Keypoint with confidence [x, y, confidence] */
export type Keypoint = [number, number, number];

/** Base item that all overlay items extend */
export interface BaseOverlayItem {
  id?: string;
  color?: string;
  startTime?: number;
  endTime?: number;
}

/** Box overlay item */
export interface BoxItem extends BaseOverlayItem {
  bbox: BBox;
  label?: string;
  confidence?: number;
}

/** Pose overlay item */
export interface PoseItem extends BaseOverlayItem {
  keypoints: Keypoint[];
  label?: string;
}

/** Mask overlay item (polygon or RLE) */
export interface MaskItem extends BaseOverlayItem {
  // Polygon points (normalized 0-1)
  polygon?: Point[];
  // RLE encoded mask (for future use)
  rle?: { counts: number[]; size: [number, number] };
  label?: string;
}

/** Point overlay item */
export interface PointItem extends BaseOverlayItem {
  point: Point;
  label?: string;
  radius?: number;
}

/** Custom overlay item with user-defined render function */
export interface CustomItem extends BaseOverlayItem {
  data: unknown;
}

/** Union of all overlay item types */
export type OverlayItem = BoxItem | PoseItem | MaskItem | PointItem | CustomItem;

/** Render options shared by all renderers */
export interface RenderOptions {
  color: string;
  scale: { x: number; y: number };
  devicePixelRatio: number;
}

/** Box-specific render options */
export interface BoxRenderOptions extends RenderOptions {
  showLabels: boolean;
  lineWidth: number;
  fontSize: number;
  fillOpacity: number;
}

/** Pose-specific render options */
export interface PoseRenderOptions extends RenderOptions {
  showKeypoints: boolean;
  lineWidth: number;
  keypointRadius: number;
  minConfidence: number;
}

/** Mask-specific render options */
export interface MaskRenderOptions extends RenderOptions {
  fillOpacity: number;
  strokeWidth: number;
}

/** Point-specific render options */
export interface PointRenderOptions extends RenderOptions {
  showLabels: boolean;
  radius: number;
  fontSize: number;
}

/** Hit test result */
export interface HitResult {
  item: OverlayItem;
  layerId: string;
  layerType: string;
}

/** Layer definition for the canvas renderer */
export interface CanvasLayer {
  id: string;
  type: 'boxes' | 'poses' | 'masks' | 'points' | 'custom';
  visible: boolean;
  color: string;
  data: OverlayItem[];
  options?: Partial<BoxRenderOptions | PoseRenderOptions | MaskRenderOptions | PointRenderOptions>;
  // For custom type
  render?: (ctx: CanvasRenderingContext2D, items: CustomItem[], options: RenderOptions) => void;
}
