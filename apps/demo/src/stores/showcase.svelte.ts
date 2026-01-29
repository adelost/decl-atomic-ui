import { emit } from 'svelte-daui';

/**
 * Showcase demo state - shared across all component tabs
 */
export class ShowcaseStore {
  // Modal states
  modalOpen = $state(false);
  alertOpen = $state(false);
  slideModalOpen = $state(false);
  celebrationOpen = $state(false);

  // Form control states
  sliderValue = $state(50);
  radioValue = $state('option1');
  accordionValue = $state('');
  numberValue = $state(5);
  searchSelectValue = $state('');

  // Filter bar states
  filterSearch = $state('');
  filterStatus = $state('all');
  filterRole = $state('all');

  // Tag cloud state
  activeTag = $state('');

  // Video/timeline states
  videoTime = $state(0);
  videoPlaying = $state(false);
  timelineZoom = $state(1);
  selectedSegments = $state(new Set<string>());

  // New video components states
  overlayToggles = $state<Record<string, boolean>>({
    boxes: true,
    poses: true,
    labels: false,
  });
  canvasDrawingMode = $state<'none' | 'box' | 'points'>('none');

  // Pagination state
  paginationPage = $state(3);

  // Upload state
  uploadedFiles = $state<File | File[] | null>(null);

  // Audio player state
  audioTime = $state(0);
  audioPlaying = $state(false);

  // Date picker state
  selectedDate = $state<Date | null>(null);

  // New component states
  pinValue = $state('');
  toggleValue = $state(false);
  meterValue = $state(65);
  timeValue = $state('14:30');
  dateRangeValue = $state<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  toggleGroupValue = $state('left');
  ratingValue = $state(3);
  toolbarAlignment = $state('left');
  toolbarFormatting = $state<string[]>([]);

  // Secret code state
  secretUnlocked = $state(false);

  // DAG view state - simulated pipeline execution
  dagNodes = $state<Array<{
    id: string;
    label: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
    progress?: number;
    duration?: number;
    dependsOn?: string[];
    error?: string;
    retryAttempt?: number;
    retryMax?: number;
    optional?: boolean;
  }>>([
    { id: 'download', label: 'download', status: 'completed', duration: 1200 },
    { id: 'extract', label: 'extract', status: 'completed', duration: 450, dependsOn: ['download'] },
    { id: 'transcribe', label: 'transcribe', status: 'running', progress: 65, dependsOn: ['extract'] },
    { id: 'analyze', label: 'analyze', status: 'running', progress: 30, dependsOn: ['extract'] },
    { id: 'summarize', label: 'summarize', status: 'pending', dependsOn: ['transcribe', 'analyze'] },
    { id: 'export', label: 'export', status: 'pending', dependsOn: ['summarize'], optional: true },
  ]);

  dagSelectedNode = $state<string | null>(null);
  dagSimulationRunning = $state(false);
  private dagSimulationTimer: ReturnType<typeof setInterval> | null = null;

  // DAG simulation - simulates a pipeline running
  startDagSimulation = () => {
    if (this.dagSimulationRunning) return;
    this.dagSimulationRunning = true;

    // Reset all nodes to pending
    this.dagNodes = this.dagNodes.map(n => ({ ...n, status: 'pending' as const, progress: undefined, duration: undefined }));

    let currentIndex = 0;
    const runNext = () => {
      if (currentIndex >= this.dagNodes.length) {
        this.dagSimulationRunning = false;
        return;
      }

      const node = this.dagNodes[currentIndex];

      // Check dependencies
      const deps = node.dependsOn || [];
      const allDepsCompleted = deps.every(depId =>
        this.dagNodes.find(n => n.id === depId)?.status === 'completed'
      );

      if (!allDepsCompleted) {
        // Wait for deps
        setTimeout(runNext, 100);
        return;
      }

      // Start running
      this.dagNodes = this.dagNodes.map(n =>
        n.id === node.id ? { ...n, status: 'running' as const, progress: 0 } : n
      );

      // Simulate progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 20 + 10;
        if (progress >= 100) {
          clearInterval(progressInterval);
          // Complete
          const duration = Math.floor(Math.random() * 2000) + 500;
          this.dagNodes = this.dagNodes.map(n =>
            n.id === node.id ? { ...n, status: 'completed' as const, progress: undefined, duration } : n
          );
          currentIndex++;
          setTimeout(runNext, 200);
        } else {
          this.dagNodes = this.dagNodes.map(n =>
            n.id === node.id ? { ...n, progress: Math.min(95, Math.floor(progress)) } : n
          );
        }
      }, 300);
    };

    runNext();
  };

  stopDagSimulation = () => {
    this.dagSimulationRunning = false;
  };

  // Tree view state
  treeNodeStatus = $state<Record<string, 'locked' | 'available' | 'completed'>>({
    fundamentals: 'completed',
    frontend: 'available',
    backend: 'available',
    react: 'locked',
    svelte: 'locked',
    nodejs: 'locked',
    nextjs: 'locked',
    express: 'locked',
    fastify: 'locked',
  });

  // Tree unlock relationships
  readonly treeUnlocks: Record<string, string[]> = {
    fundamentals: ['frontend', 'backend'],
    frontend: ['react', 'svelte'],
    backend: ['nodejs'],
    react: ['nextjs'],
    nodejs: ['express', 'fastify'],
  };

  // Actions
  onSecretCode = () => {
    this.secretUnlocked = true;
    emit('secretCode');
    emit('achievement', { id: 'secret-code', name: 'Secret Code Master' });
  };

  onTreeNodeClick = (nodeId: string) => {
    const current = this.treeNodeStatus[nodeId];
    if (current === 'available') {
      this.treeNodeStatus[nodeId] = 'completed';
      // Unlock child nodes
      const unlocks = this.treeUnlocks[nodeId] || [];
      unlocks.forEach((childId) => {
        this.treeNodeStatus[childId] = 'available';
      });
      this.treeNodeStatus = { ...this.treeNodeStatus };
    }
  };
}

export const showcaseStore = new ShowcaseStore();
