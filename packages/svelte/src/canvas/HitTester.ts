/**
 * Hit Tester
 * Handles click and hover detection for canvas overlays
 */

import type { CanvasLayer, HitResult, BoxItem, PoseItem, MaskItem, PointItem } from './renderers/types';
import { hitTestBox } from './renderers/BoxRenderer';
import { hitTestPose } from './renderers/PoseRenderer';
import { hitTestMask } from './renderers/MaskRenderer';
import { hitTestPoint } from './renderers/PointRenderer';

export class HitTester {
  private layers: CanvasLayer[] = [];
  private scale: { x: number; y: number } = { x: 1, y: 1 };

  /**
   * Update the layers and scale for hit testing
   */
  update(layers: CanvasLayer[], scale: { x: number; y: number }): void {
    this.layers = layers;
    this.scale = scale;
  }

  /**
   * Test if a point hits any overlay item
   * Returns the topmost hit item (last layer, last item)
   */
  hitTest(x: number, y: number): HitResult | null {
    // Iterate layers in reverse (top to bottom)
    for (let i = this.layers.length - 1; i >= 0; i--) {
      const layer = this.layers[i];
      if (!layer.visible) continue;

      const result = this.hitTestLayer(layer, x, y);
      if (result) return result;
    }

    return null;
  }

  /**
   * Test a single layer for hits
   */
  private hitTestLayer(layer: CanvasLayer, x: number, y: number): HitResult | null {
    const items = layer.data;
    if (!items || items.length === 0) return null;

    // Iterate items in reverse (top to bottom)
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      let hit = false;

      switch (layer.type) {
        case 'boxes':
          hit = hitTestBox(item as BoxItem, x, y, this.scale);
          break;
        case 'poses':
          hit = hitTestPose(item as PoseItem, x, y, this.scale);
          break;
        case 'masks':
          hit = hitTestMask(item as MaskItem, x, y, this.scale);
          break;
        case 'points':
          hit = hitTestPoint(item as PointItem, x, y, this.scale);
          break;
        // Custom layers don't support hit testing by default
      }

      if (hit) {
        return {
          item,
          layerId: layer.id,
          layerType: layer.type,
        };
      }
    }

    return null;
  }

  /**
   * Get all hits at a point (not just topmost)
   */
  hitTestAll(x: number, y: number): HitResult[] {
    const results: HitResult[] = [];

    for (const layer of this.layers) {
      if (!layer.visible) continue;

      for (const item of layer.data) {
        let hit = false;

        switch (layer.type) {
          case 'boxes':
            hit = hitTestBox(item as BoxItem, x, y, this.scale);
            break;
          case 'poses':
            hit = hitTestPose(item as PoseItem, x, y, this.scale);
            break;
          case 'masks':
            hit = hitTestMask(item as MaskItem, x, y, this.scale);
            break;
          case 'points':
            hit = hitTestPoint(item as PointItem, x, y, this.scale);
            break;
        }

        if (hit) {
          results.push({
            item,
            layerId: layer.id,
            layerType: layer.type,
          });
        }
      }
    }

    return results;
  }
}
