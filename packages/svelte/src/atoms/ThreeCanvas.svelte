<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';

  interface Props {
    width?: number;
    height?: number;
    background?: string;
    camera?: {
      fov?: number;
      position?: [number, number, number];
    };
    onReady?: (context: { scene: THREE.Scene; camera: THREE.Camera; renderer: THREE.WebGLRenderer }) => void;
    onFrame?: (delta: number) => void;
  }

  let {
    width = 800,
    height = 600,
    background = '#1a1a2e',
    camera = {},
    onReady,
    onFrame,
  }: Props = $props();

  let container: HTMLDivElement;
  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let cam: THREE.PerspectiveCamera;
  let animationId: number;
  let clock: THREE.Clock;

  onMount(() => {
    // Setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(background);

    cam = new THREE.PerspectiveCamera(camera.fov ?? 75, width / height, 0.1, 1000);
    const pos = camera.position ?? [0, 0, 5];
    cam.position.set(pos[0], pos[1], pos[2]);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    clock = new THREE.Clock();

    // Add default lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Demo: add a rotating cube if no onReady callback
    let demoCube: THREE.Mesh | null = null;
    if (!onReady) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({ color: 0x6366f1 });
      demoCube = new THREE.Mesh(geometry, material);
      scene.add(demoCube);
    }

    // Notify ready
    onReady?.({ scene, camera: cam, renderer });

    // Animation loop
    function animate() {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Default animation for demo cube
      if (demoCube) {
        demoCube.rotation.x += 0.01;
        demoCube.rotation.y += 0.01;
      }

      onFrame?.(delta);
      renderer.render(scene, cam);
    }

    animate();
  });

  onDestroy(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    renderer?.dispose();
  });
</script>

<div
  bind:this={container}
  class="three-canvas"
  style:width="{width}px"
  style:height="{height}px"
></div>

<style>
  .three-canvas {
    border-radius: 0.5rem;
    overflow: hidden;
  }
</style>
