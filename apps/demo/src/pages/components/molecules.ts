import type { Section } from 'svelte-daui';
import { showcaseStore } from '../../stores/showcase.svelte';

/**
 * Molecule showcases - grouped UI patterns
 */
export const moleculeShowcases: Section[] = [
  {
    molecule: 'alert-panel',
    type: 'info',
    message: 'Molecules: Display patterns, no internal state (Stack, Form, Card)',
  },

  // Stat Card
  {
    molecule: 'showcase',
    title: 'Stat Card',
    description: 'Metrics display with trends',
    layout: 'side-by-side',
    component: {
      molecule: 'stat-card',
      title: 'Total Users',
      value: '1,234',
      change: { value: 12, label: 'from last month' },
      icon: 'users',
    },
    children: [
      {
        molecule: 'stack',
        direction: 'horizontal',
        gap: 'md',
        items: [
          { molecule: 'stack', items: [{ molecule: 'stat-card', title: 'Revenue', value: '$45k', change: { value: 8 }, icon: 'dollar-sign' }, { atom: 'text', text: 'Positive trend', variant: 'small' }] },
          { molecule: 'stack', items: [{ molecule: 'stat-card', title: 'Active', value: '127', icon: 'activity' }, { atom: 'text', text: 'No trend', variant: 'small' }] },
          { molecule: 'stack', items: [{ molecule: 'stat-card', title: 'Errors', value: '0.12%', change: { value: -5 }, icon: 'alert-triangle' }, { atom: 'text', text: 'Negative trend', variant: 'small' }] },
        ],
      },
    ],
  },

  // Alert Panel
  {
    molecule: 'showcase',
    title: 'Alert Panel',
    description: 'Notification messages with semantic types',
    layout: 'side-by-side',
    previewAlign: 'stretch',
    variants: [
      { label: 'Info', component: { molecule: 'alert-panel', type: 'info', message: 'This is an informational message.' } },
      { label: 'Success', component: { molecule: 'alert-panel', type: 'success', message: 'Operation completed successfully!' } },
      { label: 'Warning', component: { molecule: 'alert-panel', type: 'warning', message: 'Please review before continuing.' } },
      { label: 'Error', component: { molecule: 'alert-panel', type: 'error', message: 'Something went wrong. Please try again.' } },
    ],
  },

  // Stack
  {
    molecule: 'showcase',
    title: 'Stack',
    description: 'Flex layout for arranging items',
    layout: 'side-by-side',
    component: {
      molecule: 'stack',
      direction: 'horizontal',
      gap: 'md',
      items: [
        { atom: 'badge', text: 'One', color: 'blue' },
        { atom: 'badge', text: 'Two', color: 'green' },
        { atom: 'badge', text: 'Three', color: 'yellow' },
      ],
    },
  },

  // Grid
  {
    molecule: 'showcase',
    title: 'Grid',
    description: 'Responsive grid layout with columns',
    layout: 'side-by-side',
    previewAlign: 'stretch',
    component: {
      molecule: 'grid',
      columns: { default: 2, md: 4 },
      gap: 'md',
      items: [
        { atom: 'badge', text: '1', color: 'blue' },
        { atom: 'badge', text: '2', color: 'green' },
        { atom: 'badge', text: '3', color: 'yellow' },
        { atom: 'badge', text: '4', color: 'red' },
      ],
    },
  },

  // Form
  {
    molecule: 'showcase',
    title: 'Form',
    description: 'Form container with field layout',
    layout: 'side-by-side',
    previewAlign: 'stretch',
    component: {
      molecule: 'form',
      id: 'demo-form',
      onSubmit: (data) => console.log('Form submitted:', data),
      fields: [
        { atom: 'input', id: 'name', label: 'Name', required: true },
        { atom: 'input', id: 'email', label: 'Email', type: 'email' },
        { atom: 'button', text: 'Submit', variant: 'primary', submit: true },
      ],
    },
  },

  // Accordion
  {
    molecule: 'showcase',
    title: 'Accordion',
    description: 'Collapsible content sections',
    layout: 'side-by-side',
    component: {
      molecule: 'accordion',
      id: 'demo-accordion',
      type: 'single',
      collapsible: true,
      value: () => showcaseStore.accordionValue,
      onValueChange: (v: string | string[]) => (showcaseStore.accordionValue = v as string),
      items: [
        { id: 'q1', title: 'What is DAUI?', content: 'A declarative UI framework.' },
        { id: 'q2', title: 'How does it work?', content: 'Define pages as objects.' },
      ],
    },
  },

  // Dropdown Menu
  {
    molecule: 'showcase',
    title: 'Dropdown Menu',
    description: 'Action menus with keyboard navigation',
    layout: 'side-by-side',
    component: {
      molecule: 'dropdown-menu',
      trigger: [{ atom: 'button', text: 'Actions', variant: 'secondary' }],
      items: [
        { id: 'edit', label: 'Edit', icon: 'pencil' },
        { id: 'duplicate', label: 'Duplicate', icon: 'copy' },
        { type: 'separator' },
        { id: 'delete', label: 'Delete', icon: 'trash', destructive: true },
      ],
    },
  },

  // Tabs (meta!)
  {
    molecule: 'showcase',
    title: 'Tabs',
    description: 'Tabbed content navigation',
    layout: 'side-by-side',
    component: {
      molecule: 'tabs',
      id: 'demo-tabs',
      tabs: [
        { id: 'tab1', label: 'First', content: [{ atom: 'text', text: 'First tab content' }] },
        { id: 'tab2', label: 'Second', content: [{ atom: 'text', text: 'Second tab content' }] },
      ],
    },
  },

  // List
  {
    molecule: 'showcase',
    title: 'List',
    description: 'Structured list with leading/trailing elements',
    layout: 'side-by-side',
    component: {
      molecule: 'list',
      id: 'demo-list',
      items: () => [
        {
          key: '1',
          leading: { atom: 'icon', name: 'user', size: 'md' },
          content: { atom: 'text', text: 'John Doe' },
          trailing: { atom: 'badge', text: 'Active', color: 'green' },
        },
        {
          key: '2',
          leading: { atom: 'icon', name: 'user', size: 'md' },
          content: { atom: 'text', text: 'Jane Smith' },
          trailing: { atom: 'badge', text: 'Pending', color: 'yellow' },
        },
      ],
      emptyText: 'No items',
    },
  },

  // Search Select
  {
    molecule: 'showcase',
    title: 'Search Select',
    description: 'Searchable dropdown with lazy loading',
    layout: 'side-by-side',
    previewAlign: 'stretch',
    component: {
      molecule: 'search-select',
      id: 'demo-search-select',
      label: 'Select User',
      placeholder: 'Search users...',
      value: () => showcaseStore.searchSelectValue,
      onChange: (v: string) => (showcaseStore.searchSelectValue = v),
      options: () => [
        { value: 'alice', label: 'Alice Johnson', subtitle: 'alice@example.com' },
        { value: 'bob', label: 'Bob Smith', subtitle: 'bob@example.com' },
        { value: 'carol', label: 'Carol White', subtitle: 'carol@example.com' },
        { value: 'david', label: 'David Brown', subtitle: 'david@example.com' },
        { value: 'emma', label: 'Emma Davis', subtitle: 'emma@example.com' },
      ],
    },
  },

  // Filter Bar
  {
    molecule: 'showcase',
    title: 'Filter Bar',
    description: 'Search and filter controls for data views',
    layout: 'stacked',
    previewAlign: 'stretch',
    component: {
      molecule: 'filter-bar',
      search: {
        id: 'demo-filter-search',
        placeholder: 'Search items...',
        value: () => showcaseStore.filterSearch,
        onChange: (v: string) => (showcaseStore.filterSearch = v),
      },
      filters: [
        {
          id: 'status-filter',
          label: 'Status',
          value: () => showcaseStore.filterStatus,
          onChange: (v: string) => (showcaseStore.filterStatus = v),
          options: [
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'pending', label: 'Pending' },
            { value: 'inactive', label: 'Inactive' },
          ],
        },
        {
          id: 'role-filter',
          label: 'Role',
          value: () => showcaseStore.filterRole,
          onChange: (v: string) => (showcaseStore.filterRole = v),
          options: [
            { value: 'all', label: 'All Roles' },
            { value: 'admin', label: 'Admin' },
            { value: 'editor', label: 'Editor' },
            { value: 'viewer', label: 'Viewer' },
          ],
        },
      ],
    },
  },

  // Tag Cloud
  {
    molecule: 'showcase',
    title: 'Tag Cloud',
    description: 'Interactive tag visualization with counts',
    layout: 'side-by-side',
    component: {
      molecule: 'tag-cloud',
      tags: [
        { label: 'JavaScript', count: 120, active: showcaseStore.activeTag === 'JavaScript' },
        { label: 'TypeScript', count: 95, active: showcaseStore.activeTag === 'TypeScript' },
        { label: 'React', count: 80, active: showcaseStore.activeTag === 'React' },
        { label: 'Svelte', count: 65, active: showcaseStore.activeTag === 'Svelte' },
        { label: 'Vue', count: 55, active: showcaseStore.activeTag === 'Vue' },
        { label: 'CSS', count: 45, active: showcaseStore.activeTag === 'CSS' },
        { label: 'HTML', count: 40, active: showcaseStore.activeTag === 'HTML' },
        { label: 'Node.js', count: 35, active: showcaseStore.activeTag === 'Node.js' },
      ],
      onTagClick: (label: string) => (showcaseStore.activeTag = showcaseStore.activeTag === label ? '' : label),
    },
  },

  // Breadcrumbs
  {
    molecule: 'showcase',
    title: 'Breadcrumbs',
    description: 'Navigation breadcrumb trail',
    layout: 'side-by-side',
    component: {
      molecule: 'breadcrumbs',
      items: [
        { label: 'Home', href: '#' },
        { label: 'Products', href: '#' },
        { label: 'Electronics', href: '#' },
        { label: 'Laptops' },
      ],
    },
  },

  // Pagination
  {
    molecule: 'showcase',
    title: 'Pagination',
    description: 'Page navigation controls',
    layout: 'side-by-side',
    component: {
      molecule: 'pagination',
      currentPage: () => showcaseStore.paginationPage,
      totalPages: () => 10,
      onPageChange: (page: number) => (showcaseStore.paginationPage = page),
    },
  },

  { atom: 'divider' },
  { atom: 'text', variant: 'heading', text: '💬 Chat Molecules' },

  // Chat Input
  {
    molecule: 'showcase',
    title: 'Chat Input',
    description: 'Text input with send button for messaging',
    layout: 'side-by-side',
    previewAlign: 'stretch',
    component: {
      molecule: 'chat-input',
      id: 'showcase-chat-input',
      placeholder: 'Type a message...',
      onSend: (msg: string) => alert(`Message: ${msg}`),
      maxLength: 200,
      showCharCount: true,
    },
  },

  // Chat Header
  {
    molecule: 'showcase',
    title: 'Chat Header',
    description: 'Header bar with title, status, and actions',
    layout: 'side-by-side',
    previewAlign: 'stretch',
    component: {
      molecule: 'chat-header',
      title: 'AI Assistant',
      subtitle: 'Online',
      avatar: { name: 'Bot', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=assistant' },
      status: 'online',
      onClose: () => alert('Close clicked'),
    },
  },

  // Chat Messages List
  {
    molecule: 'showcase',
    title: 'Chat Messages List',
    description: 'Scrollable message list with auto-scroll',
    layout: 'stacked',
    component: {
      molecule: 'chat-messages-list',
      id: 'showcase-messages',
      currentUserId: 'user',
      showTimestamps: true,
      messages: () => [
        { id: '1', content: 'Hello!', author: { id: 'bot', name: 'Bot' }, timestamp: Date.now() - 60000, variant: 'assistant' as const },
        { id: '2', content: 'Hi there!', author: { id: 'user', name: 'You' }, timestamp: Date.now() - 30000, variant: 'user' as const },
        { id: '3', content: 'How can I help you today?', author: { id: 'bot', name: 'Bot' }, timestamp: Date.now(), variant: 'assistant' as const },
      ],
      emptyText: 'No messages yet',
    },
  },
];
