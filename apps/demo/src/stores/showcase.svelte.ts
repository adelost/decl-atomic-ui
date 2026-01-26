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

  // Secret code state
  secretUnlocked = $state(false);

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
