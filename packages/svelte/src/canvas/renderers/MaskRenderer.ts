/**
 * Mask Renderer
 * Draws polygon masks and segmentation overlays on canvas
 */

import type { MaskItem, MaskRenderOptions, Point } from './types';

const DEFAULT_OPTIONS: MaskRenderOptions = {
  color: 'hsl(150, 70%, 50%)',
  scale: { x: 1, y: 1 },
  devicePixelRatio: 1,
  fillOpacity: 0.3,
  strokeWidth: 2,
};

/**
 * Draw a single polygon mask
 */
function drawMask(
  ctx: CanvasRenderingContext2D,
  mask: MaskItem,
  options: MaskRenderOptions,
  hovered: boolean = false
): void {
  const { scale, devicePixelRatio: dpr } = options;
  const polygon = mask.polygon;

  if (!polygon || polygon.length < 3) return;

  const color = mask.color ?? options.color;
  const fillOpacity = hovered ? options.fillOpacity + 0.2 : options.fillOpacity;
  const strokeWidth = (hovered ? options.strokeWidth + 1 : options.strokeWidth) * dpr;

  // Convert normalized coords to canvas pixels
  const points = polygon.map(([x, y]) => [
    x * scale.x * dpr,
    y * scale.y * dpr,
  ] as const);

  // Draw filled polygon
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();

  // Fill
  ctx.fillStyle = colorWithAlpha(color, fillOpacity);
  ctx.fill();

  // Stroke
  ctx.strokeStyle = color;
  ctx.lineWidth = strokeWidth;
  ctx.stroke();

  // Draw label if present
  if (mask.label) {
    const centroid = getPolygonCentroid(points);
    drawMaskLabel(ctx, mask.label, centroid[0], centroid[1], color, dpr);
  }
}

/**
 * Draw label at mask centroid
 */
function drawMaskLabel(
  ctx: CanvasRenderingContext2D,
  label: string,
  x: number,
  y: number,
  color: string,
  dpr: number
): void {
  const fontSize = 12 * dpr;
  const padding = 4 * dpr;

  ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  const metrics = ctx.measureText(label);
  const labelHeight = fontSize + padding * 2;
  const labelWidth = metrics.width + padding * 2;

  // Center label on centroid
  const labelX = x - labelWidth / 2;
  const labelY = y - labelHeight / 2;

  // Draw background pill
  ctx.fillStyle = colorWithAlpha(color, 0.9);
  ctx.beginPath();
  ctx.roundRect(labelX, labelY, labelWidth, labelHeight, 3 * dpr);
  ctx.fill();

  // Draw text
  ctx.fillStyle = 'white';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(label, x, y);
  ctx.textAlign = 'left'; // Reset
}

/**
 * Calculate centroid of a polygon
 */
function getPolygonCentroid(points: readonly (readonly [number, number])[]): [number, number] {
  let cx = 0, cy = 0;
  for (const [x, y] of points) {
    cx += x;
    cy += y;
  }
  return [cx / points.length, cy / points.length];
}

/**
 * Draw all masks in a layer
 */
export function drawMasks(
  ctx: CanvasRenderingContext2D,
  masks: MaskItem[],
  options: Partial<MaskRenderOptions> = {},
  hoveredId?: string
): void {
  const opts: MaskRenderOptions = { ...DEFAULT_OPTIONS, ...options };

  // Draw non-hovered masks first
  for (const mask of masks) {
    if (mask.id !== hoveredId) {
      drawMask(ctx, mask, opts, false);
    }
  }

  // Draw hovered mask on top
  if (hoveredId) {
    const hoveredMask = masks.find(m => m.id === hoveredId);
    if (hoveredMask) {
      drawMask(ctx, hoveredMask, opts, true);
    }
  }
}

/**
 * Check if a point is inside a polygon mask (for hit testing)
 * Uses ray casting algorithm
 */
export function hitTestMask(
  mask: MaskItem,
  px: number,
  py: number,
  scale: { x: number; y: number }
): boolean {
  const polygon = mask.polygon;
  if (!polygon || polygon.length < 3) return false;

  // Convert to scaled coordinates
  const points = polygon.map(([x, y]) => [x * scale.x, y * scale.y] as const);

  // Ray casting algorithm
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i][0], yi = points[i][1];
    const xj = points[j][0], yj = points[j][1];

    if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Convert color to rgba with alpha
 */
function colorWithAlpha(color: string, alpha: number): string {
  if (color.startsWith('hsl(')) {
    return color.replace('hsl(', 'hsla(').replace(')', `, ${alpha})`);
  }
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
  }
  return color;
}
