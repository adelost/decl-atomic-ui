/**
 * Canvas Renderer
 * Main render loop that orchestrates all layer renderers
 */

import type { CanvasLayer, BoxItem, PoseItem, MaskItem, PointItem, RenderOptions } from './renderers/types';
import { drawBoxes } from './renderers/BoxRenderer';
import { drawPoses } from './renderers/PoseRenderer';
import { drawMasks } from './renderers/MaskRenderer';
import { drawPoints } from './renderers/PointRenderer';
import { HitTester } from './HitTester';

export interface CanvasRendererOptions {
  /** Show FPS counter */
  showFps?: boolean;
  /** Max overlays to render (performance cap) */
  maxOverlays?: number;
  /** Background color (null = transparent) */
  backgroundColor?: string | null;
}

const DEFAULT_OPTIONS: CanvasRendererOptions = {
  showFps: false,
  maxOverlays: 100,
  backgroundColor: null,
};

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private options: CanvasRendererOptions;
  private layers: CanvasLayer[] = [];
  private hoveredId: string | undefined;
  private animationId: number | null = null;
  private running: boolean = false;

  // Performance tracking
  private frameCount: number = 0;
  private lastFpsTime: number = 0;
  private currentFps: number = 0;

  // Hit testing
  public hitTester: HitTester;

  // Dimensions
  private displayWidth: number = 0;
  private displayHeight: number = 0;
  private dpr: number = 1;

  constructor(canvas: HTMLCanvasElement, options: Partial<CanvasRendererOptions> = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2d context');
    this.ctx = ctx;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.hitTester = new HitTester();
    this.dpr = window.devicePixelRatio || 1;
  }

  /**
   * Set canvas dimensions (call when container resizes)
   */
  setSize(width: number, height: number): void {
    this.displayWidth = width;
    this.displayHeight = height;
    this.dpr = window.devicePixelRatio || 1;

    // Set canvas size with device pixel ratio for sharp rendering
    this.canvas.width = width * this.dpr;
    this.canvas.height = height * this.dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    // Update hit tester scale
    this.hitTester.update(this.layers, { x: width, y: height });
  }

  /**
   * Update layers to render
   */
  setLayers(layers: CanvasLayer[]): void {
    this.layers = layers;
    this.hitTester.update(layers, { x: this.displayWidth, y: this.displayHeight });
  }

  /**
   * Set hovered item ID (for highlight effect)
   */
  setHovered(id: string | undefined): void {
    this.hoveredId = id;
  }

  /**
   * Start the render loop
   */
  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastFpsTime = performance.now();
    this.render();
  }

  /**
   * Stop the render loop
   */
  stop(): void {
    this.running = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Render a single frame (can be called manually if not using RAF loop)
   */
  renderFrame(): void {
    this.draw();
  }

  /**
   * Main render loop
   */
  private render = (): void => {
    if (!this.running) return;

    this.draw();
    this.updateFps();

    this.animationId = requestAnimationFrame(this.render);
  };

  /**
   * Draw all layers
   */
  private draw(): void {
    const { ctx, displayWidth, displayHeight, dpr } = this;

    // Clear canvas
    if (this.options.backgroundColor) {
      ctx.fillStyle = this.options.backgroundColor;
      ctx.fillRect(0, 0, displayWidth * dpr, displayHeight * dpr);
    } else {
      ctx.clearRect(0, 0, displayWidth * dpr, displayHeight * dpr);
    }

    // Render options shared by all renderers
    const baseOptions: RenderOptions = {
      color: 'hsl(220, 70%, 50%)',
      scale: { x: displayWidth, y: displayHeight },
      devicePixelRatio: dpr,
    };

    // Track total overlays for performance cap
    let totalOverlays = 0;
    const maxOverlays = this.options.maxOverlays ?? 100;

    // Draw layers in order (back to front)
    for (const layer of this.layers) {
      if (!layer.visible) continue;

      // Check performance cap
      const remainingSlots = maxOverlays - totalOverlays;
      if (remainingSlots <= 0) break;

      // Limit items per layer if needed
      let items = layer.data;
      if (items.length > remainingSlots) {
        items = items.slice(0, remainingSlots);
      }
      totalOverlays += items.length;

      // Merge layer options with base options
      const options = { ...baseOptions, color: layer.color, ...layer.options };

      // Draw based on layer type
      switch (layer.type) {
        case 'masks':
          drawMasks(ctx, items as MaskItem[], options, this.hoveredId);
          break;
        case 'boxes':
          drawBoxes(ctx, items as BoxItem[], options, this.hoveredId);
          break;
        case 'poses':
          drawPoses(ctx, items as PoseItem[], options, this.hoveredId);
          break;
        case 'points':
          drawPoints(ctx, items as PointItem[], options, this.hoveredId);
          break;
        case 'custom':
          if (layer.render) {
            layer.render(ctx, items as any, options);
          }
          break;
      }
    }

    // Draw FPS counter
    if (this.options.showFps) {
      this.drawFps();
    }
  }

  /**
   * Update FPS counter
   */
  private updateFps(): void {
    this.frameCount++;
    const now = performance.now();
    const elapsed = now - this.lastFpsTime;

    if (elapsed >= 1000) {
      this.currentFps = Math.round((this.frameCount * 1000) / elapsed);
      this.frameCount = 0;
      this.lastFpsTime = now;
    }
  }

  /**
   * Draw FPS counter in top-left corner
   */
  private drawFps(): void {
    const { ctx, dpr } = this;
    const fps = this.currentFps;
    const color = fps >= 30 ? '#22c55e' : fps >= 15 ? '#eab308' : '#ef4444';

    ctx.font = `${12 * dpr}px monospace`;
    ctx.fillStyle = color;
    ctx.fillText(`${fps} FPS`, 8 * dpr, 20 * dpr);
  }

  /**
   * Get current FPS
   */
  getFps(): number {
    return this.currentFps;
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stop();
  }
}
