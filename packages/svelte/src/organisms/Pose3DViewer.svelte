<!--
  Pose3DViewer - 3D skeleton visualization using Three.js

  Displays 3D poses with:
  - OrbitControls for free rotation/zoom
  - Color-coded limbs (blue=left, orange=right, green=center)
  - Ground plane for depth reference
  - Timeline sync with interpolation
-->
<script lang="ts">
  import type { Pose3DViewerOrganism } from '@daui/core';
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  import Icon from '../atoms/Icon.svelte';

  let {
    id,
    poses3d,
    currentTime,
    showGround = true,
    showAxes = false,
    autoRotate: initialAutoRotate = false,
    height = 300,
  }: Omit<Pose3DViewerOrganism, 'organism'> = $props();

  // Resolve reactive props
  let posesData = $derived(typeof poses3d === 'function' ? poses3d() : poses3d);
  let time = $derived(typeof currentTime === 'function' ? currentTime() : currentTime);

  // COCO 17 skeleton bone connections
  const SKELETON_BONES: [number, number][] = [
    [0, 1], [0, 2], [1, 3], [2, 4],           // Face
    [5, 6], [5, 7], [7, 9], [6, 8], [8, 10],  // Arms
    [5, 11], [6, 12], [11, 12],               // Torso
    [11, 13], [13, 15], [12, 14], [14, 16],   // Legs
  ];

  // Limb side classification
  const LIMB_SIDES: Record<string, 'left' | 'right' | 'center'> = {
    '0,1': 'left', '0,2': 'right', '1,3': 'left', '2,4': 'right',
    '5,6': 'center', '5,7': 'left', '7,9': 'left',
    '6,8': 'right', '8,10': 'right',
    '5,11': 'left', '6,12': 'right', '11,12': 'center',
    '11,13': 'left', '13,15': 'left', '12,14': 'right', '14,16': 'right',
  };

  const LIMB_COLORS = {
    left: 0x3b82f6,   // Blue
    right: 0xf97316,  // Orange
    center: 0x22c55e, // Green
  };

  const CSS_COLORS = {
    left: '#3b82f6',
    right: '#f97316',
    center: '#22c55e',
  };

  const KEYPOINT_NAMES = [
    'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
    'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
    'left_wrist', 'right_wrist', 'left_hip', 'right_hip',
    'left_knee', 'right_knee', 'left_ankle', 'right_ankle',
  ];

  // DOM refs
  let container = $state<HTMLDivElement | null>(null);
  let wrapper = $state<HTMLDivElement | null>(null);

  // Three.js objects
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let controls: OrbitControls;
  let skeletonGroup: THREE.Group | null = null;
  let groundPlane: THREE.Group | null = null;
  let axesHelper: THREE.AxesHelper | null = null;
  let animationId: number;

  // View state
  let isFullscreen = $state(false);
  let autoRotate = $state(initialAutoRotate);

  // Find pose at current time with interpolation
  let currentPose = $derived.by(() => {
    if (!posesData || posesData.length === 0) return null;

    const sorted = [...posesData].sort((a, b) => a.timestamp - b.timestamp);

    // Binary search for bracketing poses
    let left = 0;
    let right = sorted.length - 1;

    while (left < right) {
      const mid = Math.floor((left + right + 1) / 2);
      if (sorted[mid].timestamp <= time) {
        left = mid;
      } else {
        right = mid - 1;
      }
    }

    const before = sorted[left];
    const after = sorted[left + 1];

    if (!after || before.timestamp >= time) {
      return before.keypoints_3d;
    }

    // Interpolate
    const t = (time - before.timestamp) / (after.timestamp - before.timestamp);
    return interpolatePoses(before.keypoints_3d, after.keypoints_3d, t);
  });

  function interpolatePoses(
    pose1: number[][],
    pose2: number[][],
    t: number
  ): number[][] {
    if (!pose1 || !pose2) return pose1 || pose2;
    return pose1.map((kp1, i) => {
      const kp2 = pose2[i];
      if (!kp1 || !kp2) return kp1 || kp2;
      return [
        kp1[0] + (kp2[0] - kp1[0]) * t,
        kp1[1] + (kp2[1] - kp1[1]) * t,
        kp1[2] + (kp2[2] - kp1[2]) * t,
      ];
    });
  }

  function init() {
    if (!container) return;

    const width = container.clientWidth;
    const h = container.clientHeight || height;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    // Camera
    camera = new THREE.PerspectiveCamera(50, width / h, 0.1, 100);
    camera.position.set(0, 1, 3);
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-5, 5, -5);
    scene.add(backLight);

    // OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controls.target.set(0, 0, 0);
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.0;

    // Ground plane
    if (showGround) {
      groundPlane = createGroundPlane();
      scene.add(groundPlane);
    }

    // Axes helper
    if (showAxes) {
      axesHelper = new THREE.AxesHelper(0.5);
      scene.add(axesHelper);
    }

    // Skeleton group
    skeletonGroup = new THREE.Group();
    scene.add(skeletonGroup);

    // Event listeners
    window.addEventListener('resize', onResize);

    // Start animation
    animate();
  }

  function createGroundPlane(): THREE.Group {
    const group = new THREE.Group();

    const planeGeometry = new THREE.PlaneGeometry(2, 2);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0x333333,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1;
    group.add(plane);

    const grid = new THREE.GridHelper(2, 10, 0x444444, 0x222222);
    grid.position.y = -0.99;
    group.add(grid);

    return group;
  }

  function createBoneCylinder(
    start: number[],
    end: number[],
    color: number,
    radius: number = 0.015
  ): THREE.Mesh | null {
    const startVec = new THREE.Vector3(start[0], start[1], start[2]);
    const endVec = new THREE.Vector3(end[0], end[1], end[2]);

    const direction = new THREE.Vector3().subVectors(endVec, startVec);
    const length = direction.length();

    if (length < 0.001) return null;

    const geometry = new THREE.CylinderGeometry(radius, radius, length, 8);
    const material = new THREE.MeshPhongMaterial({ color, shininess: 30 });
    const bone = new THREE.Mesh(geometry, material);

    bone.position.copy(startVec).add(endVec).multiplyScalar(0.5);
    bone.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize()
    );

    return bone;
  }

  function createJointSphere(
    position: number[],
    color: number,
    radius: number = 0.025
  ): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(radius, 16, 16);
    const material = new THREE.MeshPhongMaterial({ color, shininess: 60 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(position[0], position[1], position[2]);
    return sphere;
  }

  function updateSkeletonFromPose() {
    if (!skeletonGroup || !currentPose) return;

    // Capture for closure
    const group = skeletonGroup;

    // Clear existing skeleton
    while (group.children.length > 0) {
      const child = group.children[0] as THREE.Mesh;
      group.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) (child.material as THREE.Material).dispose();
    }

    // Add bones
    for (const [startIdx, endIdx] of SKELETON_BONES) {
      const start = currentPose[startIdx];
      const end = currentPose[endIdx];
      if (!start || !end) continue;

      const side = LIMB_SIDES[`${startIdx},${endIdx}`] || 'center';
      const color = LIMB_COLORS[side];

      const bone = createBoneCylinder(start, end, color);
      if (bone) group.add(bone);
    }

    // Add joints
    currentPose.forEach((kp, idx) => {
      if (!kp) return;

      let color = 0xffffff;
      if (idx >= 5) {
        const name = KEYPOINT_NAMES[idx];
        if (name.startsWith('left_')) color = LIMB_COLORS.left;
        else if (name.startsWith('right_')) color = LIMB_COLORS.right;
        else color = LIMB_COLORS.center;
      }

      const joint = createJointSphere(kp, color);
      group.add(joint);
    });
  }

  function animate() {
    animationId = requestAnimationFrame(animate);

    if (controls) {
      controls.autoRotate = autoRotate;
      controls.update();
    }

    updateSkeletonFromPose();
    renderer?.render(scene, camera);
  }

  function onResize() {
    if (!container || !renderer || !camera) return;

    const width = container.clientWidth;
    const h = container.clientHeight || height;

    camera.aspect = width / h;
    camera.updateProjectionMatrix();
    renderer.setSize(width, h);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      wrapper?.requestFullscreen();
      isFullscreen = true;
    } else {
      document.exitFullscreen();
      isFullscreen = false;
    }
  }

  function onFullscreenChange() {
    isFullscreen = !!document.fullscreenElement;
    setTimeout(onResize, 100);
  }

  function resetCamera() {
    if (controls) {
      controls.reset();
      camera.position.set(0, 1, 3);
      camera.lookAt(0, 0, 0);
      controls.target.set(0, 0, 0);
    }
  }

  function cleanup() {
    if (animationId) cancelAnimationFrame(animationId);
    controls?.dispose();
    if (renderer) {
      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    }
    window.removeEventListener('resize', onResize);
  }

  onMount(() => {
    init();
    document.addEventListener('fullscreenchange', onFullscreenChange);
  });

  onDestroy(() => {
    cleanup();
    document.removeEventListener('fullscreenchange', onFullscreenChange);
  });

  // Watch for pose changes
  $effect(() => {
    if (currentPose) {
      updateSkeletonFromPose();
    }
  });

  // Watch for ground plane toggle
  $effect(() => {
    if (scene && groundPlane) {
      if (showGround) {
        if (!scene.children.includes(groundPlane)) {
          scene.add(groundPlane);
        }
      } else {
        scene.remove(groundPlane);
      }
    }
  });
</script>

<div class="pose3d-viewer" class:fullscreen={isFullscreen} bind:this={wrapper} {id}>
  <div class="viewport" bind:this={container} style:height="{height}px">
    <!-- Controls overlay -->
    <div class="viewport-controls">
      <button class="viewport-btn" onclick={resetCamera} title="Reset view">
        <Icon name="rotate-ccw" size="sm" />
      </button>
      <button
        class="viewport-btn"
        class:active={autoRotate}
        onclick={() => autoRotate = !autoRotate}
        title="Auto-rotate"
      >
        <Icon name="refresh-cw" size="sm" />
      </button>
      <button class="viewport-btn" onclick={toggleFullscreen} title="Toggle fullscreen">
        <Icon name={isFullscreen ? 'minimize-2' : 'maximize-2'} size="sm" />
      </button>
    </div>

    <!-- Status overlay -->
    {#if !currentPose}
      <div class="status-overlay">
        <span>No 3D pose data</span>
      </div>
    {/if}
  </div>

  <!-- Legend -->
  <div class="legend">
    <div class="legend-item">
      <span class="legend-color" style:background={CSS_COLORS.left}></span>
      <span>Left</span>
    </div>
    <div class="legend-item">
      <span class="legend-color" style:background={CSS_COLORS.right}></span>
      <span>Right</span>
    </div>
    <div class="legend-item">
      <span class="legend-color" style:background={CSS_COLORS.center}></span>
      <span>Center</span>
    </div>
  </div>

  <p class="hint">Drag to rotate | Scroll to zoom | Double-click to reset</p>
</div>

<style>
  .pose3d-viewer {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .viewport {
    position: relative;
    width: 100%;
    border-radius: 6px;
    overflow: hidden;
    background: #1a1a1a;
  }

  .fullscreen {
    background: #1a1a1a;
  }

  .fullscreen .viewport {
    height: 100vh !important;
    border-radius: 0;
  }

  .fullscreen .legend,
  .fullscreen .hint {
    position: absolute;
    bottom: 1rem;
  }

  .fullscreen .legend {
    left: 1rem;
  }

  .fullscreen .hint {
    right: 1rem;
  }

  .viewport-controls {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;
    gap: 0.5rem;
    opacity: 0;
    transition: opacity 0.2s;
    z-index: 10;
  }

  .viewport:hover .viewport-controls {
    opacity: 1;
  }

  .viewport-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    color: white;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }

  .viewport-btn:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  .viewport-btn.active {
    background: rgba(59, 130, 246, 0.6);
    border-color: rgba(59, 130, 246, 0.8);
  }

  .status-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.7);
    color: hsl(var(--muted-foreground));
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.85rem;
  }

  .legend {
    display: flex;
    gap: 1rem;
    padding: 0.5rem;
    background: hsl(var(--muted) / 0.5);
    border-radius: 6px;
    font-size: 0.75rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }

  .hint {
    font-size: 0.7rem;
    color: hsl(var(--muted-foreground));
    text-align: center;
    margin: 0;
  }
</style>
