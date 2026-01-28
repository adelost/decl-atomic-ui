import type { Section } from 'svelte-daui';
import { showcaseStore } from '../../stores/showcase.svelte';

/**
 * Extension showcases - optional presets for specialized use cases
 */
export const extensionShowcases: Section[] = [
  {
    molecule: 'alert-panel',
    type: 'info',
    message: 'Extensions: Optional presets for specialized use cases',
  },

  // === CHARTS PRESET ===
  { atom: 'text', variant: 'heading', text: '📊 Charts Preset' },
  { atom: 'text', variant: 'muted', text: 'Data visualization components' },

  {
    molecule: 'showcase',
    title: 'Chart',
    description: 'Line, area, and bar charts',
    layout: 'side-by-side',
    previewAlign: 'stretch',
    variants: [
      {
        label: 'Line',
        component: {
          atom: 'chart',
          type: 'line',
          data: [
            { label: 'Mon', value: 20 },
            { label: 'Tue', value: 35 },
            { label: 'Wed', value: 25 },
            { label: 'Thu', value: 45 },
            { label: 'Fri', value: 30 },
          ],
          height: 150,
          showGrid: true,
        },
      },
      {
        label: 'Area',
        component: {
          atom: 'chart',
          type: 'area',
          data: [
            { label: 'Mon', value: 20 },
            { label: 'Tue', value: 35 },
            { label: 'Wed', value: 25 },
            { label: 'Thu', value: 45 },
            { label: 'Fri', value: 30 },
          ],
          height: 150,
          showGrid: true,
        },
      },
      {
        label: 'Bar',
        component: {
          atom: 'chart',
          type: 'bar',
          data: [
            { label: 'Mon', value: 20 },
            { label: 'Tue', value: 35 },
            { label: 'Wed', value: 25 },
            { label: 'Thu', value: 45 },
            { label: 'Fri', value: 30 },
          ],
          height: 150,
          showGrid: true,
        },
      },
    ],
  },

  { atom: 'divider' },

  // === TABLE PRESET ===
  { atom: 'text', variant: 'heading', text: '📋 Table Preset' },
  { atom: 'text', variant: 'muted', text: 'Advanced data tables with search and sorting' },

  {
    molecule: 'showcase',
    title: 'Table',
    description: 'Data table with search, sort, and custom cell rendering',
    layout: 'stacked',
    previewAlign: 'stretch',
    component: {
      organism: 'table',
      id: 'extensions-table',
      data: () => [
        { id: '1', name: 'Alice', role: 'Admin', status: 'Active' },
        { id: '2', name: 'Bob', role: 'Editor', status: 'Away' },
        { id: '3', name: 'Carol', role: 'Viewer', status: 'Active' },
      ],
      searchable: true,
      searchKeys: ['name', 'role'],
      columns: [
        { field: 'name', header: 'Name', sortable: true },
        { field: 'role', header: 'Role', sortable: true },
        { field: 'status', header: 'Status', render: (v) => ({ atom: 'badge', text: String(v), color: v === 'Active' ? 'green' : 'yellow' }) },
      ],
    },
  },

  { atom: 'divider' },

  // === MEDIA PRESET ===
  { atom: 'text', variant: 'heading', text: '🎬 Media Preset' },
  { atom: 'text', variant: 'muted', text: 'Video playback and timeline editing components' },

  {
    molecule: 'showcase',
    title: 'Video Player',
    description: 'HTML5 video with overlay support for annotations',
    layout: 'stacked',
    component: {
      organism: 'video-player',
      id: 'demo-video',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      poster: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Big_Buck_Bunny_thumbnail_vlc.png/320px-Big_Buck_Bunny_thumbnail_vlc.png',
      currentTime: () => showcaseStore.videoTime,
      onTimeUpdate: (t: number) => (showcaseStore.videoTime = t),
      playing: () => showcaseStore.videoPlaying,
      onPlayPause: (p: boolean) => (showcaseStore.videoPlaying = p),
      aspectRatio: '16/9',
      controls: true,
    },
  },

  {
    molecule: 'showcase',
    title: 'Video Timeline',
    description: 'Multi-track timeline editor for video editing',
    layout: 'stacked',
    component: {
      organism: 'video-timeline',
      id: 'demo-timeline',
      duration: () => 60,
      currentTime: () => showcaseStore.videoTime,
      onSeek: (t: number) => (showcaseStore.videoTime = t),
      zoom: () => showcaseStore.timelineZoom,
      onZoomChange: (z: number) => (showcaseStore.timelineZoom = z),
      selectedIds: () => showcaseStore.selectedSegments,
      onSelectionChange: (ids: Set<string>) => (showcaseStore.selectedSegments = ids),
      height: 150,
      tracks: [
        {
          id: 'video',
          label: 'Video',
          type: 'segments',
          icon: 'video',
          color: 'hsl(220, 70%, 50%)',
          data: () => [
            { id: 'v1', start: 0, end: 20, label: 'Intro' },
            { id: 'v2', start: 22, end: 45, label: 'Main' },
            { id: 'v3', start: 47, end: 60, label: 'Outro' },
          ],
        },
        {
          id: 'audio',
          label: 'Audio',
          type: 'segments',
          icon: 'music',
          color: 'hsl(150, 60%, 45%)',
          data: () => [{ id: 'a1', start: 0, end: 60, label: 'Background Music' }],
        },
        {
          id: 'markers',
          label: 'Markers',
          type: 'markers',
          icon: 'flag',
          color: 'hsl(45, 90%, 50%)',
          data: () => [
            { id: 'm1', start: 10, label: 'Cut' },
            { id: 'm2', start: 30, label: 'Transition' },
            { id: 'm3', start: 50, label: 'Fade' },
          ],
        },
      ],
    },
  },

  {
    molecule: 'showcase',
    title: 'Waveform',
    description: 'Audio waveform visualization with click-to-seek (synced with video player)',
    layout: 'stacked',
    component: {
      atom: 'waveform',
      samples: Array.from({ length: 200 }, (_, i) => {
        // Generate a more realistic waveform pattern
        const t = i / 200;
        return Math.abs(Math.sin(t * 20) * Math.sin(t * 3) * 0.7 + Math.random() * 0.3);
      }),
      duration: 60,
      currentTime: () => showcaseStore.videoTime,
      height: 60,
      color: 'hsl(150, 60%, 45%)',
      onClick: (t: number) => (showcaseStore.videoTime = t),
    },
  },

  {
    molecule: 'showcase',
    title: 'Time Display',
    description: 'Time display with multiple formats (synced with video player above)',
    layout: 'side-by-side',
    variants: [
      {
        label: 'Short',
        component: {
          atom: 'time-display',
          time: () => showcaseStore.videoTime,
          format: 'short',
          size: 'lg',
        },
      },
      {
        label: 'Long',
        component: {
          atom: 'time-display',
          time: () => showcaseStore.videoTime + 3600,
          format: 'long',
          size: 'lg',
        },
      },
      {
        label: 'Timecode',
        component: {
          atom: 'time-display',
          time: () => showcaseStore.videoTime,
          format: 'timecode',
          fps: 30,
          size: 'lg',
        },
      },
      {
        label: 'Frames',
        component: {
          atom: 'time-display',
          time: () => showcaseStore.videoTime,
          format: 'frames',
          fps: 30,
          size: 'lg',
        },
      },
    ],
  },

  {
    molecule: 'showcase',
    title: 'Thumbnail',
    description: 'Video frame thumbnail extraction at different timestamps',
    layout: 'stacked',
    component: {
      molecule: 'stack',
      direction: 'horizontal',
      gap: 'md',
      items: [
        {
          atom: 'thumbnail',
          src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          time: 5,
          width: 120,
          height: 68,
          rounded: 'sm',
        },
        {
          atom: 'thumbnail',
          src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          time: 30,
          width: 120,
          height: 68,
          rounded: 'md',
        },
        {
          atom: 'thumbnail',
          src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          time: 60,
          width: 120,
          height: 68,
          rounded: 'lg',
        },
        {
          atom: 'thumbnail',
          src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          time: () => showcaseStore.videoTime,
          width: 120,
          height: 68,
          rounded: 'md',
        },
      ],
    },
  },

  {
    molecule: 'showcase',
    title: 'Overlay Toggles',
    description: 'Toggle controls for overlay visibility',
    layout: 'stacked',
    component: {
      molecule: 'overlay-toggles',
      showAllToggle: true,
      items: [
        {
          id: 'boxes',
          label: 'Boxes',
          icon: 'grid',
          enabled: () => showcaseStore.overlayToggles.boxes,
          onChange: (v: boolean) => (showcaseStore.overlayToggles = { ...showcaseStore.overlayToggles, boxes: v }),
        },
        {
          id: 'poses',
          label: 'Poses',
          icon: 'user',
          enabled: () => showcaseStore.overlayToggles.poses,
          onChange: (v: boolean) => (showcaseStore.overlayToggles = { ...showcaseStore.overlayToggles, poses: v }),
        },
        {
          id: 'labels',
          label: 'Labels',
          icon: 'tag',
          enabled: () => showcaseStore.overlayToggles.labels,
          onChange: (v: boolean) => (showcaseStore.overlayToggles = { ...showcaseStore.overlayToggles, labels: v }),
        },
      ],
    },
  },

  {
    molecule: 'showcase',
    title: 'Media Overlay',
    description: 'Canvas-based video/image overlay with boxes, poses, masks, and points',
    layout: 'stacked',
    component: {
      organism: 'media-overlay',
      id: 'demo-media-overlay',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'video',
      aspectRatio: '16/9',
      controls: true,
      showOverlayToggles: true,
      showLegend: true,
      showFps: true,
      layers: [
        {
          id: 'detections',
          label: 'Detections',
          type: 'boxes',
          color: 'hsl(220, 70%, 50%)',
          data: () => [
            { id: 'b1', bbox: [0.1, 0.15, 0.25, 0.35], label: 'Person', confidence: 0.95 },
            { id: 'b2', bbox: [0.55, 0.2, 0.2, 0.3], label: 'Object', confidence: 0.87 },
            { id: 'b3', bbox: [0.35, 0.5, 0.15, 0.25], label: 'Animal', confidence: 0.72 },
          ],
        },
        {
          id: 'poses',
          label: 'Poses',
          type: 'poses',
          color: 'hsl(280, 70%, 50%)',
          data: () => [
            {
              id: 'pose1',
              keypoints: [
                [0.22, 0.2, 0.9],  // nose
                [0.21, 0.18, 0.85], // left_eye
                [0.23, 0.18, 0.85], // right_eye
                [0.19, 0.19, 0.7],  // left_ear
                [0.25, 0.19, 0.7],  // right_ear
                [0.17, 0.28, 0.9],  // left_shoulder
                [0.27, 0.28, 0.9],  // right_shoulder
                [0.14, 0.38, 0.85], // left_elbow
                [0.30, 0.38, 0.85], // right_elbow
                [0.12, 0.45, 0.8],  // left_wrist
                [0.32, 0.45, 0.8],  // right_wrist
                [0.18, 0.45, 0.9],  // left_hip
                [0.26, 0.45, 0.9],  // right_hip
                [0.17, 0.58, 0.85], // left_knee
                [0.27, 0.58, 0.85], // right_knee
                [0.16, 0.72, 0.8],  // left_ankle
                [0.28, 0.72, 0.8],  // right_ankle
              ],
            },
          ],
        },
        {
          id: 'regions',
          label: 'Regions',
          type: 'masks',
          color: 'hsl(150, 70%, 45%)',
          data: () => [
            {
              id: 'mask1',
              polygon: [[0.6, 0.6], [0.75, 0.55], [0.85, 0.65], [0.8, 0.8], [0.65, 0.78]],
              label: 'Area',
            },
          ],
        },
        {
          id: 'markers',
          label: 'Markers',
          type: 'points',
          color: 'hsl(45, 90%, 50%)',
          data: () => [
            { id: 'p1', point: [0.5, 0.1], label: 'Point 1' },
            { id: 'p2', point: [0.9, 0.5], label: 'Point 2' },
          ],
        },
      ],
      onOverlayClick: (item: any, layerId: string) => {
        console.log('Clicked:', item, 'in layer:', layerId);
      },
    },
  },

  {
    molecule: 'showcase',
    title: 'Media Overlay - Performance (100+ objects)',
    description: 'Stress test with many overlays rendered on canvas',
    layout: 'stacked',
    component: {
      organism: 'media-overlay',
      id: 'demo-media-overlay-perf',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'video',
      aspectRatio: '16/9',
      controls: true,
      showFps: true,
      maxOverlays: 150,
      layers: [
        {
          id: 'many-boxes',
          label: 'Boxes (100)',
          type: 'boxes',
          color: 'hsl(220, 70%, 50%)',
          data: () => Array.from({ length: 100 }, (_, i) => ({
            id: `box-${i}`,
            bbox: [
              0.05 + (i % 10) * 0.09,
              0.05 + Math.floor(i / 10) * 0.09,
              0.07,
              0.07,
            ] as [number, number, number, number],
            label: `#${i + 1}`,
            confidence: 0.5 + Math.random() * 0.5,
          })),
        },
        {
          id: 'many-points',
          label: 'Points (50)',
          type: 'points',
          color: 'hsl(45, 90%, 50%)',
          data: () => Array.from({ length: 50 }, (_, i) => ({
            id: `point-${i}`,
            point: [Math.random() * 0.9 + 0.05, Math.random() * 0.9 + 0.05] as [number, number],
          })),
        },
      ],
    },
  },

  { atom: 'divider' },

  // === CANVAS PRESET ===
  { atom: 'text', variant: 'heading', text: '🎨 Canvas Preset' },
  { atom: 'text', variant: 'muted', text: '3D graphics and physics simulations' },

  {
    molecule: 'showcase',
    title: 'Three Canvas',
    description: '3D rendering with Three.js - rotating cube demo',
    layout: 'stacked',
    component: {
      atom: 'three-canvas',
      width: 400,
      height: 300,
      background: '#1a1a2e',
    },
  },

  {
    molecule: 'showcase',
    title: 'Depth Viewer',
    description: '2.5D parallax viewer using Three.js. Hover for parallax, click inspect button to orbit. Requires color + depth map pair (e.g. from Depth Anything).',
    layout: 'stacked',
    component: {
      organism: 'depth-viewer',
      id: 'demo-depth-viewer',
      // Sample images - using same image for both (no 3D effect without real depth map)
      colorSrc: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      depthSrc: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      height: 350,
      displacement: 0.3,
      showControls: true,
    },
  },

  {
    molecule: 'showcase',
    title: 'Pose 3D Viewer',
    description: '3D skeleton visualization with color-coded limbs (blue=left, orange=right, green=center). Drag to rotate, scroll to zoom.',
    layout: 'stacked',
    component: {
      organism: 'pose-3d-viewer',
      id: 'demo-pose3d',
      // Sample pose data (standing T-pose)
      poses3d: [
        {
          timestamp: 0,
          keypoints_3d: [
            [0, 0.9, 0],      // nose
            [-0.03, 0.92, 0], // left_eye
            [0.03, 0.92, 0],  // right_eye
            [-0.08, 0.9, 0],  // left_ear
            [0.08, 0.9, 0],   // right_ear
            [-0.2, 0.7, 0],   // left_shoulder
            [0.2, 0.7, 0],    // right_shoulder
            [-0.4, 0.7, 0],   // left_elbow
            [0.4, 0.7, 0],    // right_elbow
            [-0.55, 0.7, 0],  // left_wrist
            [0.55, 0.7, 0],   // right_wrist
            [-0.1, 0.4, 0],   // left_hip
            [0.1, 0.4, 0],    // right_hip
            [-0.1, 0.0, 0],   // left_knee
            [0.1, 0.0, 0],    // right_knee
            [-0.1, -0.4, 0],  // left_ankle
            [0.1, -0.4, 0],   // right_ankle
          ],
        },
      ],
      currentTime: 0,
      showGround: true,
      autoRotate: true,
      height: 350,
    },
  },

  {
    molecule: 'showcase',
    title: 'Matter Canvas',
    description: '2D physics with Matter.js - falling boxes demo',
    layout: 'stacked',
    component: {
      atom: 'matter-canvas',
      width: 400,
      height: 300,
      background: '#1a1a2e',
      gravity: { x: 0, y: 1 },
    },
  },
];
