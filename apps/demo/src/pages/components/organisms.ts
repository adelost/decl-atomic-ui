import type { Section } from 'svelte-daui';
import { showcaseStore } from '../../stores/showcase.svelte';

/**
 * Organism showcases - complex components with internal state
 */
export const organismShowcases: Section[] = [
  {
    molecule: 'alert-panel',
    type: 'info',
    message: 'Organisms: Complex components with internal state (Table, Modal)',
  },

  // Card
  {
    molecule: 'showcase',
    title: 'Card',
    description: 'Content container with header and footer',
    layout: 'side-by-side',
    component: {
      organism: 'card',
      header: { atom: 'text', variant: 'heading', text: 'Card Title' },
      content: [
        { atom: 'text', text: 'Card content goes here.' },
        { atom: 'text', variant: 'muted', text: 'Add any sections inside.' },
      ],
    },
  },

  // Table
  {
    molecule: 'showcase',
    title: 'Table',
    description: 'Data table with search, sort, and custom rendering',
    layout: 'side-by-side',
    component: {
      organism: 'table',
      id: 'demo-table',
      data: () => [
        { id: '1', name: 'Product A', price: 299, stock: 50 },
        { id: '2', name: 'Product B', price: 49, stock: 15 },
      ],
      searchable: true,
      searchKeys: ['name'],
      columns: [
        { field: 'name', header: 'Name', sortable: true },
        { field: 'price', header: 'Price', render: (v) => ({ atom: 'text', text: `$${v}` }) },
        {
          field: 'stock',
          header: 'Stock',
          render: (v) => ({
            atom: 'badge',
            text: String(v),
            color: (v as number) < 20 ? 'red' : 'green',
          }),
        },
      ],
    },
  },

  // Modal
  {
    molecule: 'showcase',
    title: 'Modal',
    description: 'Dialog overlay with focus trap',
    layout: 'side-by-side',
    component: {
      atom: 'button',
      text: 'Open Modal',
      variant: 'primary',
      onClick: () => (showcaseStore.modalOpen = true),
    },
  },

  // Alert Dialog
  {
    molecule: 'showcase',
    title: 'Alert Dialog',
    description: 'Confirmation dialogs for destructive actions',
    layout: 'side-by-side',
    component: {
      atom: 'button',
      text: 'Delete Item',
      variant: 'danger',
      onClick: () => (showcaseStore.alertOpen = true),
    },
  },

  // Tree View
  {
    molecule: 'showcase',
    title: 'Tree View',
    description: 'Hierarchical node structure for skill trees, org charts',
    layout: 'stacked',
    component: {
      organism: 'tree-view',
      id: 'demo-tree',
      nodeSize: 'sm',
      nodes: [
        // Root
        { id: 'fundamentals', title: 'Fundamentals', description: 'Web basics', icon: 'globe', status: () => showcaseStore.treeNodeStatus['fundamentals'] },
        // Level 1 - Two branches
        { id: 'frontend', title: 'Frontend', description: 'UI development', icon: 'layout', parent: 'fundamentals', status: () => showcaseStore.treeNodeStatus['frontend'] },
        { id: 'backend', title: 'Backend', description: 'Server & APIs', icon: 'server', parent: 'fundamentals', status: () => showcaseStore.treeNodeStatus['backend'] },
        // Frontend branch
        { id: 'react', title: 'React', description: 'Component library', icon: 'atom', parent: 'frontend', status: () => showcaseStore.treeNodeStatus['react'] },
        { id: 'svelte', title: 'Svelte', description: 'Compiler framework', icon: 'zap', parent: 'frontend', status: () => showcaseStore.treeNodeStatus['svelte'] },
        { id: 'nextjs', title: 'Next.js', description: 'React framework', icon: 'triangle', parent: 'react', status: () => showcaseStore.treeNodeStatus['nextjs'] },
        // Backend branch
        { id: 'nodejs', title: 'Node.js', description: 'JS runtime', icon: 'hexagon', parent: 'backend', status: () => showcaseStore.treeNodeStatus['nodejs'] },
        { id: 'express', title: 'Express', description: 'Web framework', icon: 'route', parent: 'nodejs', status: () => showcaseStore.treeNodeStatus['express'] },
        { id: 'fastify', title: 'Fastify', description: 'Fast framework', icon: 'rocket', parent: 'nodejs', status: () => showcaseStore.treeNodeStatus['fastify'] },
      ],
      onNodeClick: (node: { id: string }) => showcaseStore.onTreeNodeClick(node.id),
    },
  },

  { atom: 'divider' },
  { atom: 'text', variant: 'heading', text: '💬 Chat & Celebration' },

  // Chat Panel
  {
    molecule: 'showcase',
    title: 'Chat Panel',
    description: 'Complete chat interface with header, messages, and input',
    layout: 'stacked',
    component: {
      organism: 'chat-panel',
      id: 'showcase-chat',
      title: 'Support Chat',
      avatar: { name: 'Support', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=support' },
      status: 'online',
      messages: () => [
        { id: '1', content: 'Welcome! How can I help?', author: { id: 'support', name: 'Support' }, timestamp: Date.now() - 60000, variant: 'assistant' as const },
      ],
      currentUserId: 'user',
      onSend: (msg: string) => console.log('Send:', msg),
      placeholder: 'Ask a question...',
      height: 350,
      variant: 'floating',
    },
  },

  // Slide Modal
  {
    molecule: 'showcase',
    title: 'Slide Modal',
    description: 'Multi-slide modal for achievements, onboarding, tutorials',
    layout: 'side-by-side',
    component: {
      molecule: 'stack',
      direction: 'horizontal',
      gap: 'md',
      items: [
        {
          atom: 'button',
          text: '🏆 Achievements',
          variant: 'primary',
          onClick: () => (showcaseStore.celebrationOpen = true),
        },
        {
          atom: 'button',
          text: '📚 Onboarding',
          variant: 'secondary',
          onClick: () => (showcaseStore.slideModalOpen = true),
        },
      ],
    },
  },
];

/**
 * Modal instances - rendered at page level but controlled by showcases
 */
export const organismModals: Section[] = [
  // Modal instance
  {
    organism: 'modal',
    id: 'demo-modal',
    title: 'Demo Modal',
    size: 'md',
    open: () => showcaseStore.modalOpen,
    onClose: () => (showcaseStore.modalOpen = false),
    content: [
      { atom: 'text', text: 'This is a modal dialog with focus trap.' },
      { atom: 'text', text: 'Press Escape or click outside to close.', variant: 'muted' },
      { atom: 'input', id: 'modal-input', label: 'Sample Input', placeholder: 'Type something...' },
    ],
    footer: [
      { atom: 'button', text: 'Cancel', variant: 'secondary', onClick: () => (showcaseStore.modalOpen = false) },
      { atom: 'button', text: 'Confirm', variant: 'primary', onClick: () => (showcaseStore.modalOpen = false) },
    ],
  },

  // Alert Dialog instance
  {
    organism: 'alert-dialog',
    open: () => showcaseStore.alertOpen,
    onOpenChange: (open: boolean) => (showcaseStore.alertOpen = open),
    title: 'Are you sure?',
    description: 'This action cannot be undone. This will permanently delete the item.',
    cancelLabel: 'Cancel',
    confirmLabel: 'Delete',
    variant: 'danger',
    onConfirm: () => console.log('Item deleted!'),
  },

  // Slide Modal - Celebration
  {
    organism: 'slide-modal',
    id: 'demo-celebration',
    open: () => showcaseStore.celebrationOpen,
    onClose: () => (showcaseStore.celebrationOpen = false),
    variant: 'celebration',
    nextText: 'Awesome!',
    closeText: 'Done!',
    slides: [
      { id: '1', header: 'ACHIEVEMENT!', icon: '🏆', title: 'First Steps', subtitle: 'You explored the components', badge: '+10p', theme: 'gold' },
      { id: '2', header: 'ACHIEVEMENT!', icon: '⭐', title: 'Quick Learner', subtitle: 'Viewed multiple showcases', badge: '+25p', theme: 'purple' },
      { id: '3', header: 'LEVEL UP!', icon: '2', title: 'Level 2 Explorer', subtitle: 'Level 1 › Level 2', theme: 'cyan' },
    ],
  },

  // Slide Modal - Onboarding
  {
    organism: 'slide-modal',
    id: 'demo-onboarding',
    open: () => showcaseStore.slideModalOpen,
    onClose: () => (showcaseStore.slideModalOpen = false),
    variant: 'onboarding',
    showArrows: true,
    nextText: 'Next',
    prevText: 'Back',
    closeText: 'Get Started',
    slides: [
      { id: '1', icon: '👋', title: 'Welcome to DAUI', subtitle: 'Declarative Atomic UI for Svelte' },
      { id: '2', icon: '📄', title: 'Pages are Data', subtitle: 'Define your UI as typed objects, not code' },
      { id: '3', icon: '🧩', title: 'Atomic Design', subtitle: 'Atoms → Molecules → Organisms → Pages' },
      { id: '4', icon: '🚀', title: 'Ready to Build!', subtitle: 'Check out the examples to get started' },
    ],
  },
];
