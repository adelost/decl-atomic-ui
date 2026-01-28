<!--
  DepthViewer - 2.5D parallax viewer using Three.js

  Projects an image/video onto a displaced triangle grid based on depth map.
  Supports mouse/touch interaction for parallax viewing.
-->
<script lang="ts">
  import type { DepthViewerOrganism } from '@daui/core';
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  import Icon from '../atoms/Icon.svelte';

  let {
    id,
    colorSrc,
    depthSrc,
    isVideo,
    resolution: initialResolution = 256,
    displacement: initialDisplacement = 0.4,
    autoRotate: initialAutoRotate = false,
    showWireframe: initialWireframe = false,
    showControls = true,
    height = 400,
    onTimeUpdate,
  }: Omit<DepthViewerOrganism, 'organism'> = $props();

  // Resolve reactive props
  let colorUrl = $derived(typeof colorSrc === 'function' ? colorSrc() : colorSrc);
  let depthUrl = $derived(typeof depthSrc === 'function' ? depthSrc() : depthSrc);

  // Auto-detect video from URL if not explicitly set
  let isVideoMode = $derived(
    isVideo !== undefined ? isVideo : (colorUrl?.endsWith('.mp4') || colorUrl?.endsWith('.webm'))
  );

  // DOM refs
  let container = $state<HTMLDivElement | null>(null);
  let wrapper = $state<HTMLDivElement | null>(null);

  // Three.js objects
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let mesh: THREE.Mesh | null = null;
  let controls: OrbitControls | null = null;
  let videoElement = $state<HTMLVideoElement | null>(null);
  let depthVideoElement = $state<HTMLVideoElement | null>(null);
  let animationId: number;

  // Mouse tracking for parallax
  let targetRotationX = 0;
  let targetRotationY = 0;

  // View state
  let isFullscreen = $state(false);
  let viewMode = $state<'parallax' | 'inspect'>('parallax');

  // Settings
  let resolution = $state(initialResolution);
  let maxResolution = $state(1024);
  let displacement = $state(initialDisplacement);
  let autoRotate = $state(initialAutoRotate);
  let showWireframe = $state(initialWireframe);

  // Vertex shader - displaces Z based on depth
  const vertexShader = `
    uniform sampler2D depthMap;
    uniform float displacementScale;
    uniform float time;

    varying vec2 vUv;
    varying float vDepth;

    void main() {
      vUv = uv;

      // Sample depth - white = near (high Z), black = far (low Z)
      float depth = texture2D(depthMap, uv).r;
      vDepth = depth;

      // Displace vertex along Z (toward camera)
      vec3 displaced = position;
      displaced.z = depth * displacementScale;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }
  `;

  // Fragment shader - samples color texture
  const fragmentShader = `
    uniform sampler2D colorMap;
    uniform bool wireframe;

    varying vec2 vUv;
    varying float vDepth;

    void main() {
      if (wireframe) {
        // Wireframe mode - show depth as color
        gl_FragColor = vec4(vec3(vDepth), 1.0);
      } else {
        gl_FragColor = texture2D(colorMap, vUv);
      }
    }
  `;

  function init() {
    if (!container) return;

    const width = container.clientWidth;
    const h = container.clientHeight || height;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    // Camera
    camera = new THREE.PerspectiveCamera(50, width / h, 0.1, 100);
    camera.position.z = 1.2;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // OrbitControls (disabled by default, used in inspect mode)
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 0.5;
    controls.maxDistance = 2.5;
    controls.minPolarAngle = Math.PI * 0.3;
    controls.maxPolarAngle = Math.PI * 0.7;
    controls.minAzimuthAngle = -Math.PI * 0.4;
    controls.maxAzimuthAngle = Math.PI * 0.4;
    controls.enablePan = true;
    controls.panSpeed = 0.5;
    controls.screenSpacePanning = true;

    // Load textures
    loadAndCreateMesh();

    // Event listeners
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('dblclick', resetView);
    window.addEventListener('resize', onResize);

    // Start animation
    animate();
  }

  function loadAndCreateMesh() {
    const loader = new THREE.TextureLoader();

    if (isVideoMode) {
      // Video mode
      videoElement = document.createElement('video');
      videoElement.src = colorUrl;
      videoElement.loop = true;
      videoElement.muted = true;
      videoElement.playsInline = true;
      videoElement.crossOrigin = 'anonymous';

      depthVideoElement = document.createElement('video');
      depthVideoElement.src = depthUrl;
      depthVideoElement.loop = true;
      depthVideoElement.muted = true;
      depthVideoElement.playsInline = true;
      depthVideoElement.crossOrigin = 'anonymous';

      Promise.all([
        new Promise(resolve => videoElement!.addEventListener('loadeddata', resolve, { once: true })),
        new Promise(resolve => depthVideoElement!.addEventListener('loadeddata', resolve, { once: true }))
      ]).then(() => {
        const colorTexture = new THREE.VideoTexture(videoElement!);
        const depthTexture = new THREE.VideoTexture(depthVideoElement!);
        colorTexture.minFilter = THREE.LinearFilter;
        colorTexture.magFilter = THREE.LinearFilter;
        depthTexture.minFilter = THREE.LinearFilter;
        depthTexture.magFilter = THREE.LinearFilter;
        createMesh(colorTexture, depthTexture);
        videoElement!.play();
        depthVideoElement!.play();
      });
    } else {
      // Image mode
      loader.load(depthUrl, (depthTexture) => {
        depthTexture.minFilter = THREE.LinearFilter;
        depthTexture.magFilter = THREE.LinearFilter;

        loader.load(colorUrl, (colorTexture) => {
          colorTexture.minFilter = THREE.LinearFilter;
          colorTexture.magFilter = THREE.LinearFilter;
          createMesh(colorTexture, depthTexture);
        });
      });
    }
  }

  function createMesh(colorTexture: THREE.Texture, depthTexture: THREE.Texture) {
    // Remove existing mesh
    if (mesh) {
      scene.remove(mesh);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    }

    // Get aspect ratio from texture
    const colorImg = colorTexture.image as HTMLImageElement | HTMLVideoElement | undefined;
    const aspect = colorImg && 'width' in colorImg
      ? colorImg.width / colorImg.height
      : 16 / 9;

    // Set max resolution based on depth map
    const depthImg = depthTexture.image as HTMLImageElement | HTMLVideoElement | undefined;
    if (depthImg && 'width' in depthImg) {
      const depthW = depthImg.width;
      const depthH = depthImg.height;
      const smallerDim = Math.min(depthW, depthH);
      maxResolution = Math.floor(smallerDim / 16) * 16;
      maxResolution = Math.max(16, maxResolution);
      resolution = maxResolution;
    }

    // Create plane geometry with subdivisions
    const geometry = new THREE.PlaneGeometry(aspect, 1, resolution, resolution);

    // Shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        colorMap: { value: colorTexture },
        depthMap: { value: depthTexture },
        displacementScale: { value: displacement },
        wireframe: { value: showWireframe },
        time: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  }

  function animate() {
    animationId = requestAnimationFrame(animate);

    if (!mesh) return;

    const material = mesh.material as THREE.ShaderMaterial;

    // Update uniforms
    material.uniforms.displacementScale.value = displacement;
    material.uniforms.wireframe.value = showWireframe;
    material.uniforms.time.value = performance.now() * 0.001;

    // Mode-specific updates
    if (viewMode === 'inspect') {
      controls?.update();
    } else {
      // Parallax mode
      if (autoRotate) {
        targetRotationY = Math.sin(performance.now() * 0.0005) * 0.2;
        targetRotationX = Math.cos(performance.now() * 0.0003) * 0.1;
      }

      mesh.rotation.y += (targetRotationY - mesh.rotation.y) * 0.05;
      mesh.rotation.x += (targetRotationX - mesh.rotation.x) * 0.05;
    }

    // Update video textures
    if (isVideoMode && videoElement && depthVideoElement && mesh) {
      material.uniforms.colorMap.value.needsUpdate = true;
      material.uniforms.depthMap.value.needsUpdate = true;

      // Sync videos
      if (Math.abs(depthVideoElement.currentTime - videoElement.currentTime) > 0.05) {
        depthVideoElement.currentTime = videoElement.currentTime;
      }

      // Report time
      onTimeUpdate?.(videoElement.currentTime);
    }

    renderer.render(scene, camera);
  }

  function onMouseMove(event: MouseEvent) {
    if (viewMode !== 'parallax' || !container) return;

    const rect = container.getBoundingClientRect();
    const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    if (!autoRotate) {
      targetRotationY = mouseX * 0.3;
      targetRotationX = mouseY * 0.2;
    }
  }

  function onTouchMove(event: TouchEvent) {
    if (viewMode !== 'parallax' || !container || event.touches.length === 0) return;

    const rect = container.getBoundingClientRect();
    const touch = event.touches[0];
    const mouseX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

    if (!autoRotate) {
      targetRotationY = mouseX * 0.3;
      targetRotationX = mouseY * 0.2;
    }
  }

  function onResize() {
    if (!container || !renderer || !camera) return;

    const width = container.clientWidth;
    const h = container.clientHeight || height;

    camera.aspect = width / h;
    camera.updateProjectionMatrix();
    renderer.setSize(width, h);
  }

  function toggleViewMode() {
    viewMode = viewMode === 'parallax' ? 'inspect' : 'parallax';

    if (viewMode === 'inspect') {
      if (controls) controls.enabled = true;
      if (mesh) {
        mesh.rotation.x = 0;
        mesh.rotation.y = 0;
      }
    } else {
      if (controls) {
        controls.enabled = false;
        controls.reset();
      }
    }
  }

  function resetView() {
    controls?.reset();
    if (mesh) {
      mesh.rotation.x = 0;
      mesh.rotation.y = 0;
    }
    targetRotationX = 0;
    targetRotationY = 0;
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

  function updateResolution(newRes: number) {
    resolution = newRes;
    if (mesh) {
      const savedRotation = { x: mesh.rotation.x, y: mesh.rotation.y };
      const material = mesh.material as THREE.ShaderMaterial;
      const colorTexture = material.uniforms.colorMap.value;
      const depthTexture = material.uniforms.depthMap.value;
      createMesh(colorTexture, depthTexture);
      if (mesh) {
        mesh.rotation.x = savedRotation.x;
        mesh.rotation.y = savedRotation.y;
      }
    }
  }

  function togglePlayPause() {
    if (!videoElement || !depthVideoElement) return;
    if (videoElement.paused) {
      videoElement.play();
      depthVideoElement.play();
    } else {
      videoElement.pause();
      depthVideoElement.pause();
    }
  }

  function cleanup() {
    if (animationId) cancelAnimationFrame(animationId);
    if (videoElement) {
      videoElement.pause();
      videoElement.src = '';
    }
    if (depthVideoElement) {
      depthVideoElement.pause();
      depthVideoElement.src = '';
    }
    controls?.dispose();
    if (renderer) {
      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    }
    if (mesh) {
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    }
    container?.removeEventListener('mousemove', onMouseMove);
    container?.removeEventListener('touchmove', onTouchMove);
    container?.removeEventListener('dblclick', resetView);
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

  // Watch for URL changes
  $effect(() => {
    if (colorUrl && depthUrl && renderer) {
      loadAndCreateMesh();
    }
  });
</script>

<div class="depth-viewer" class:fullscreen={isFullscreen} bind:this={wrapper} {id}>
  <div
    class="viewport"
    class:inspect-mode={viewMode === 'inspect'}
    bind:this={container}
    style:height="{height}px"
  >
    <!-- Viewport controls -->
    <div class="viewport-controls">
      <button
        class="viewport-btn"
        class:active={viewMode === 'inspect'}
        onclick={toggleViewMode}
        title={viewMode === 'parallax' ? 'Inspect mode - drag to rotate' : 'Parallax mode - hover to view'}
      >
        <Icon name={viewMode === 'inspect' ? 'search' : 'eye'} size="sm" />
      </button>
      <button class="viewport-btn" onclick={toggleFullscreen} title="Toggle fullscreen">
        <Icon name={isFullscreen ? 'minimize-2' : 'maximize-2'} size="sm" />
      </button>
    </div>
  </div>

  {#if showControls}
    <div class="controls">
      <label class="control-item">
        <span>Quality</span>
        <input
          type="range"
          min="16"
          max={maxResolution}
          step="16"
          bind:value={resolution}
          onchange={() => updateResolution(resolution)}
        />
        <span class="value">{resolution}</span>
      </label>

      <label class="control-item">
        <span>Depth</span>
        <input
          type="range"
          min="0"
          max="1.5"
          step="0.01"
          bind:value={displacement}
        />
        <span class="value">{displacement.toFixed(2)}</span>
      </label>

      <label class="control-item toggle">
        <span>Auto-rotate</span>
        <input type="checkbox" bind:checked={autoRotate} />
      </label>

      <label class="control-item toggle">
        <span>Wireframe</span>
        <input type="checkbox" bind:checked={showWireframe} />
      </label>

      {#if isVideoMode && videoElement}
        <button class="control-btn" onclick={togglePlayPause}>
          <Icon name={videoElement.paused ? 'play' : 'pause'} size="sm" />
        </button>
      {/if}
    </div>
  {/if}

  <p class="hint">
    {#if viewMode === 'inspect'}
      Drag to rotate | Scroll to zoom | Double-click to reset
    {:else}
      Move mouse to view parallax effect
    {/if}
  </p>
</div>

<style>
  .depth-viewer {
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

  .fullscreen .controls {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    border-radius: 6px;
    z-index: 10;
  }

  .fullscreen .hint {
    display: none;
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

  .viewport.inspect-mode {
    cursor: grab;
    box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  .viewport.inspect-mode:active {
    cursor: grabbing;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 0.75rem;
    background: hsl(var(--muted) / 0.5);
    border-radius: 6px;
  }

  .control-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
  }

  .control-item span:first-child {
    color: hsl(var(--muted-foreground));
    min-width: 60px;
  }

  .control-item input[type="range"] {
    width: 100px;
    height: 4px;
    -webkit-appearance: none;
    appearance: none;
    background: hsl(var(--border));
    border-radius: 2px;
  }

  .control-item input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    background: hsl(var(--primary));
    border-radius: 50%;
    cursor: pointer;
  }

  .control-item.toggle {
    cursor: pointer;
    gap: 0.5rem;
  }

  .control-item input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: hsl(var(--primary));
  }

  .value {
    font-family: monospace;
    min-width: 40px;
    text-align: right;
    color: hsl(var(--foreground));
  }

  .control-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem 0.5rem;
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .hint {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
    text-align: center;
    margin: 0;
  }
</style>
