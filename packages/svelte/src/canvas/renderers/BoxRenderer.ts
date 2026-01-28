/**
 * Box Renderer
 * Draws bounding boxes with labels on canvas
 */

import type { BoxItem, BoxRenderOptions } from './types';

const DEFAULT_OPTIONS: BoxRenderOptions = {
  color: 'hsl(220, 70%, 50%)',
  scale: { x: 1, y: 1 },
  devicePixelRatio: 1,
  showLabels: true,
  lineWidth: 2,
  fontSize: 12,
  fillOpacity: 0,
};

/**
 * Draw a single box on the canvas
 */
function drawBox(
  ctx: CanvasRenderingContext2D,
  box: BoxItem,
  options: BoxRenderOptions,
  hovered: boolean = false
): void {
  const { scale, devicePixelRatio: dpr } = options;
  const [nx, ny, nw, nh] = box.bbox;

  // Convert normalized coords to canvas pixels
  const x = nx * scale.x * dpr;
  const y = ny * scale.y * dpr;
  const w = nw * scale.x * dpr;
  const h = nh * scale.y * dpr;

  const color = box.color ?? options.color;
  const lineWidth = (hovered ? options.lineWidth + 1 : options.lineWidth) * dpr;

  // Draw fill if hovered or fillOpacity > 0
  const fillOpacity = hovered ? 0.15 : options.fillOpacity;
  if (fillOpacity > 0) {
    ctx.fillStyle = colorWithAlpha(color, fillOpacity);
    ctx.fillRect(x, y, w, h);
  }

  // Draw stroke
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.strokeRect(x, y, w, h);

  // Draw label
  if (options.showLabels && (box.label || box.confidence !== undefined)) {
    drawLabel(ctx, box, x, y, options, dpr);
  }
}

/**
 * Draw label pill above the box
 */
function drawLabel(
  ctx: CanvasRenderingContext2D,
  box: BoxItem,
  x: number,
  y: number,
  options: BoxRenderOptions,
  dpr: number
): void {
  const color = box.color ?? options.color;
  const fontSize = options.fontSize * dpr;

  // Build label text
  let text = box.label ?? '';
  if (box.confidence !== undefined) {
    const conf = Math.round(box.confidence * 100);
    text = text ? `${text} ${conf}%` : `${conf}%`;
  }

  if (!text) return;

  ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  const metrics = ctx.measureText(text);
  const padding = 4 * dpr;
  const labelHeight = fontSize + padding * 2;
  const labelWidth = metrics.width + padding * 2;

  // Position above box
  const labelX = x;
  const labelY = y - labelHeight;

  // Draw background pill
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(labelX, labelY, labelWidth, labelHeight, 3 * dpr);
  ctx.fill();

  // Draw text
  ctx.fillStyle = 'white';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, labelX + padding, labelY + labelHeight / 2);
}

/**
 * Draw all boxes in a layer
 */
export function drawBoxes(
  ctx: CanvasRenderingContext2D,
  boxes: BoxItem[],
  options: Partial<BoxRenderOptions> = {},
  hoveredId?: string
): void {
  const opts: BoxRenderOptions = { ...DEFAULT_OPTIONS, ...options };

  // Draw non-hovered boxes first, then hovered on top
  for (const box of boxes) {
    if (box.id !== hoveredId) {
      drawBox(ctx, box, opts, false);
    }
  }

  // Draw hovered box on top
  if (hoveredId) {
    const hoveredBox = boxes.find(b => b.id === hoveredId);
    if (hoveredBox) {
      drawBox(ctx, hoveredBox, opts, true);
    }
  }
}

/**
 * Check if a point is inside a box (for hit testing)
 */
export function hitTestBox(
  box: BoxItem,
  px: number,
  py: number,
  scale: { x: number; y: number }
): boolean {
  const [nx, ny, nw, nh] = box.bbox;
  const x = nx * scale.x;
  const y = ny * scale.y;
  const w = nw * scale.x;
  const h = nh * scale.y;

  return px >= x && px <= x + w && py >= y && py <= y + h;
}

/**
 * Convert color to rgba with alpha
 */
function colorWithAlpha(color: string, alpha: number): string {
  // Handle hsl colors
  if (color.startsWith('hsl(')) {
    return color.replace('hsl(', 'hsla(').replace(')', `, ${alpha})`);
  }
  // Handle hex colors
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  // Handle rgb colors
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
  }
  return color;
}
