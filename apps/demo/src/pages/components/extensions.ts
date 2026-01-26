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
