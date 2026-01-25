<script lang="ts">
  import type { PoseSkeletonAtom } from '@daui/core';

  let {
    keypoints,
    color = 'hsl(var(--primary))',
    lineWidth = 2,
    showPoints = true,
  }: Omit<PoseSkeletonAtom, 'atom'> = $props();

  // COCO 17-point skeleton connections
  // 0: nose, 1: left_eye, 2: right_eye, 3: left_ear, 4: right_ear
  // 5: left_shoulder, 6: right_shoulder, 7: left_elbow, 8: right_elbow
  // 9: left_wrist, 10: right_wrist, 11: left_hip, 12: right_hip
  // 13: left_knee, 14: right_knee, 15: left_ankle, 16: right_ankle
  const SKELETON_CONNECTIONS: [number, number][] = [
    // Face
    [0, 1], [0, 2], [1, 3], [2, 4],
    // Upper body
    [5, 6], [5, 7], [7, 9], [6, 8], [8, 10],
    // Torso
    [5, 11], [6, 12], [11, 12],
    // Lower body
    [11, 13], [13, 15], [12, 14], [14, 16],
  ];

  const CONFIDENCE_THRESHOLD = 0.3;

  let connections = $derived.by(() => {
    if (!keypoints || keypoints.length < 17) return [];

    return SKELETON_CONNECTIONS.filter(([i, j]) => {
      const [, , c1] = keypoints[i] || [0, 0, 0];
      const [, , c2] = keypoints[j] || [0, 0, 0];
      return c1 > CONFIDENCE_THRESHOLD && c2 > CONFIDENCE_THRESHOLD;
    }).map(([i, j]) => ({
      x1: keypoints[i][0] * 100,
      y1: keypoints[i][1] * 100,
      x2: keypoints[j][0] * 100,
      y2: keypoints[j][1] * 100,
    }));
  });

  let visiblePoints = $derived.by(() => {
    if (!keypoints) return [];

    return keypoints
      .map((kp, index) => ({
        x: kp[0] * 100,
        y: kp[1] * 100,
        confidence: kp[2],
        index,
      }))
      .filter((p) => p.confidence > CONFIDENCE_THRESHOLD);
  });
</script>

<svg
  class="pose-skeleton"
  viewBox="0 0 100 100"
  preserveAspectRatio="none"
  style:--skeleton-color={color}
>
  <!-- Limb connections -->
  {#each connections as conn}
    <line
      x1="{conn.x1}%"
      y1="{conn.y1}%"
      x2="{conn.x2}%"
      y2="{conn.y2}%"
      stroke={color}
      stroke-width={lineWidth}
      stroke-linecap="round"
    />
  {/each}

  <!-- Keypoints -->
  {#if showPoints}
    {#each visiblePoints as point}
      <circle
        cx="{point.x}%"
        cy="{point.y}%"
        r={lineWidth + 1}
        fill={color}
      />
    {/each}
  {/if}
</svg>

<style>
  .pose-skeleton {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
</style>
