/**
 * Point Renderer
 * Draws point markers with optional labels on canvas
 */

import type { PointItem, PointRenderOptions } from './types';

const DEFAULT_OPTIONS: PointRenderOptions = {
  color: 'hsl(45, 90%, 50%)',
  scale: { x: 1, y: 1 },
  devicePixelRatio: 1,
  showLabels: true,
  radius: 6,
  fontSize: 11,
};

/**
 * Draw a single point marker
 */
function drawPoint(
  ctx: CanvasRenderingContext2D,
  point: PointItem,
  options: PointRenderOptions,
  hovered: boolean = false
): void {
  const { scale, devicePixelRatio: dpr } = options;
  const [nx, ny] = point.point;

  // Convert normalized coords to canvas pixels
  const x = nx * scale.x * dpr;
  const y = ny * scale.y * dpr;

  const color = point.color ?? options.color;
  const radius = (point.radius ?? options.radius) * (hovered ? 1.3 : 1) * dpr;

  // Draw outer ring
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  // Draw white border
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2 * dpr;
  ctx.stroke();

  // Draw inner dot
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();

  // Draw label
  if (options.showLabels && point.label) {
    drawPointLabel(ctx, point.label, x, y, radius, color, options, dpr);
  }
}

/**
 * Draw label next to point
 */
function drawPointLabel(
  ctx: CanvasRenderingContext2D,
  label: string,
  x: number,
  y: number,
  radius: number,
  color: string,
  options: PointRenderOptions,
  dpr: number
): void {
  const fontSize = options.fontSize * dpr;
  const padding = 4 * dpr;
  const offset = radius + 6 * dpr;

  ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  const metrics = ctx.measureText(label);
  const labelHeight = fontSize + padding * 2;
  const labelWidth = metrics.width + padding * 2;

  // Position to the right of the point
  const labelX = x + offset;
  const labelY = y - labelHeight / 2;

  // Draw background pill
  ctx.fillStyle = colorWithAlpha(color, 0.9);
  ctx.beginPath();
  ctx.roundRect(labelX, labelY, labelWidth, labelHeight, 3 * dpr);
  ctx.fill();

  // Draw text
  ctx.fillStyle = 'white';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, labelX + padding, y);
}

/**
 * Draw all points in a layer
 */
export function drawPoints(
  ctx: CanvasRenderingContext2D,
  points: PointItem[],
  options: Partial<PointRenderOptions> = {},
  hoveredId?: string
): void {
  const opts: PointRenderOptions = { ...DEFAULT_OPTIONS, ...options };

  // Draw non-hovered points first
  for (const point of points) {
    if (point.id !== hoveredId) {
      drawPoint(ctx, point, opts, false);
    }
  }

  // Draw hovered point on top
  if (hoveredId) {
    const hoveredPoint = points.find(p => p.id === hoveredId);
    if (hoveredPoint) {
      drawPoint(ctx, hoveredPoint, opts, true);
    }
  }
}

/**
 * Check if a cursor is near a point (for hit testing)
 */
export function hitTestPoint(
  point: PointItem,
  px: number,
  py: number,
  scale: { x: number; y: number },
  hitRadius: number = 10
): boolean {
  const [nx, ny] = point.point;
  const x = nx * scale.x;
  const y = ny * scale.y;

  const dist = Math.sqrt((px - x) ** 2 + (py - y) ** 2);
  return dist <= hitRadius;
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
