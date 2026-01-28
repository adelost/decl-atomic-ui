/**
 * Pose Renderer
 * Draws COCO 17-keypoint skeletons on canvas
 */

import type { PoseItem, PoseRenderOptions, Keypoint } from './types';

const DEFAULT_OPTIONS: PoseRenderOptions = {
  color: 'hsl(280, 70%, 50%)',
  scale: { x: 1, y: 1 },
  devicePixelRatio: 1,
  showKeypoints: true,
  lineWidth: 2,
  keypointRadius: 4,
  minConfidence: 0.3,
};

/**
 * COCO 17-keypoint skeleton connections
 * Format: [startIdx, endIdx, colorGroup]
 *
 * Keypoint indices:
 * 0: nose, 1: left_eye, 2: right_eye, 3: left_ear, 4: right_ear
 * 5: left_shoulder, 6: right_shoulder, 7: left_elbow, 8: right_elbow
 * 9: left_wrist, 10: right_wrist, 11: left_hip, 12: right_hip
 * 13: left_knee, 14: right_knee, 15: left_ankle, 16: right_ankle
 */
const SKELETON_EDGES: [number, number, number][] = [
  // Face (purple)
  [0, 1, 0], [0, 2, 0], [1, 3, 0], [2, 4, 0],
  // Center spine (green)
  [5, 6, 1], [11, 12, 1],
  // Left side (blue)
  [5, 7, 2], [7, 9, 2], [5, 11, 2], [11, 13, 2], [13, 15, 2],
  // Right side (orange)
  [6, 8, 3], [8, 10, 3], [6, 12, 3], [12, 14, 3], [14, 16, 3],
];

const EDGE_COLORS = [
  '#8b5cf6', // Purple (face)
  '#22c55e', // Green (center)
  '#3b82f6', // Blue (left)
  '#f97316', // Orange (right)
];

/**
 * Draw a single pose skeleton
 */
function drawPose(
  ctx: CanvasRenderingContext2D,
  pose: PoseItem,
  options: PoseRenderOptions,
  hovered: boolean = false
): void {
  const { scale, devicePixelRatio: dpr, minConfidence } = options;
  const keypoints = pose.keypoints;

  if (!keypoints || keypoints.length < 17) return;

  const lineWidth = (hovered ? options.lineWidth + 1 : options.lineWidth) * dpr;
  const radius = (hovered ? options.keypointRadius + 1 : options.keypointRadius) * dpr;

  // Convert keypoints to canvas coordinates
  const points: (readonly [number, number, number] | null)[] = keypoints.map(kp => {
    if (!kp || kp[2] < minConfidence) return null;
    return [kp[0] * scale.x * dpr, kp[1] * scale.y * dpr, kp[2]] as const;
  });

  // Draw skeleton edges
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';

  for (const [startIdx, endIdx, colorIdx] of SKELETON_EDGES) {
    const start = points[startIdx];
    const end = points[endIdx];

    if (!start || !end) continue;

    // Use pose color if specified, otherwise use segment color
    ctx.strokeStyle = pose.color ?? EDGE_COLORS[colorIdx];
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();
  }

  // Draw keypoints
  if (options.showKeypoints) {
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      if (!point) continue;

      // Color keypoints by body part
      const colorIdx = i <= 4 ? 0 : (i % 2 === 1 ? 2 : 3);
      ctx.fillStyle = pose.color ?? EDGE_COLORS[colorIdx];

      ctx.beginPath();
      ctx.arc(point[0], point[1], radius, 0, Math.PI * 2);
      ctx.fill();

      // White border for visibility
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1 * dpr;
      ctx.stroke();
    }
  }
}

/**
 * Draw all poses in a layer
 */
export function drawPoses(
  ctx: CanvasRenderingContext2D,
  poses: PoseItem[],
  options: Partial<PoseRenderOptions> = {},
  hoveredId?: string
): void {
  const opts: PoseRenderOptions = { ...DEFAULT_OPTIONS, ...options };

  // Draw non-hovered poses first
  for (const pose of poses) {
    if (pose.id !== hoveredId) {
      drawPose(ctx, pose, opts, false);
    }
  }

  // Draw hovered pose on top
  if (hoveredId) {
    const hoveredPose = poses.find(p => p.id === hoveredId);
    if (hoveredPose) {
      drawPose(ctx, hoveredPose, opts, true);
    }
  }
}

/**
 * Check if a point is near any keypoint (for hit testing)
 */
export function hitTestPose(
  pose: PoseItem,
  px: number,
  py: number,
  scale: { x: number; y: number },
  hitRadius: number = 10
): boolean {
  const keypoints = pose.keypoints;
  if (!keypoints) return false;

  for (const kp of keypoints) {
    if (!kp || kp[2] < 0.3) continue;

    const kx = kp[0] * scale.x;
    const ky = kp[1] * scale.y;
    const dist = Math.sqrt((px - kx) ** 2 + (py - ky) ** 2);

    if (dist <= hitRadius) return true;
  }

  return false;
}

/**
 * Get bounding box of a pose for coarse hit testing
 */
export function getPoseBounds(
  pose: PoseItem,
  minConfidence: number = 0.3
): [number, number, number, number] | null {
  const keypoints = pose.keypoints;
  if (!keypoints) return null;

  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;
  let hasValidPoints = false;

  for (const kp of keypoints) {
    if (!kp || kp[2] < minConfidence) continue;
    hasValidPoints = true;
    minX = Math.min(minX, kp[0]);
    minY = Math.min(minY, kp[1]);
    maxX = Math.max(maxX, kp[0]);
    maxY = Math.max(maxY, kp[1]);
  }

  if (!hasValidPoints) return null;

  return [minX, minY, maxX - minX, maxY - minY];
}
