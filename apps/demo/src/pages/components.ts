import type { Page } from 'svelte-daui';
import { emit } from 'svelte-daui';

/**
 * Components Catalog
 * Unified view with Preview + Code + Variants for each component
 */
let demoModalOpen = false;
let demoAlertOpen = false;
let sliderValue = 50;
let radioValue = 'option1';
let accordionValue = '';
let secretUnlocked = false;

// Video demo state
let videoTime = 0;
let videoPlaying = false;
let timelineZoom = 1;
let selectedSegments = new Set<string>();

// Number input demo state
let numberValue = 5;

// SearchSelect demo state
let searchSelectValue = '';

// FilterBar demo state
let filterSearch = '';
let filterStatus = 'all';
let filterRole = 'all';

// TagCloud demo state
let activeTag = '';

// TreeView demo state
let treeNodeStatus: Record<string, 'locked' | 'available' | 'completed'> = {
  'intro': 'completed',
  'basics': 'completed',
  'advanced': 'available',
  'expert': 'locked',
  'master': 'locked',
};

function onSecretCode() {
  secretUnlocked = true;
  emit('secretCode');
  emit('achievement', { id: 'secret-code', name: 'Secret Code Master' });
}

export const componentsPage = {
  layout: 'full',
  title: '',
  shortcuts: [
    {
      keys: '↑↑↓↓←→←→',
      action: onSecretCode,
      description: 'Secret Code',
      once: true,
    },
  ],
  sections: [
    // Header
    {
      molecule: 'stack',
      direction: 'horizontal',
      justify: 'between',
      align: 'center',
      padding: 'md',
      items: [
        {
          molecule: 'stack',
          direction: 'vertical',
          gap: 'none',
          items: [
            { atom: 'text', variant: 'heading', text: 'DAUI Components' },
            {
              molecule: 'stack',
              direction: 'horizontal',
              gap: 'sm',
              align: 'center',
              items: [
                { atom: 'text', variant: 'muted', text: 'Preview + Code for each component' },
                {
                  atom: 'badge',
                  text: '🎮 Secret Code!',
                  color: 'gold',
                  visible: () => secretUnlocked,
                },
              ],
            },
          ],
        },
      ],
    },

    // Tabs
    {
      molecule: 'tabs',
      id: 'component-tabs',
      tabs: [
        // =====================================================
        // ATOMS TAB
        // =====================================================
        {
          id: 'atoms',
          label: 'Atoms',
          content: [
            {
              molecule: 'stack',
              direction: 'vertical',
              gap: 'lg',
              padding: 'md',
              items: [
                {
                  molecule: 'alert-panel',
                  type: 'info',
                  message: 'Atoms: Single elements (Button, Icon, Input)',
                },

                // === ACTIONS ===
                {
                  molecule: 'showcase',
                  title: 'Button',
                  description: 'Interactive buttons with variants',
                  layout: 'side-by-side',
                  variants: [
                    { label: 'Primary', component: { atom: 'button', text: 'Primary Action', variant: 'primary', onClick: () => alert('Clicked!') } },
                    { label: 'Secondary', component: { atom: 'button', text: 'Secondary', variant: 'secondary' } },
                    { label: 'Danger', component: { atom: 'button', text: 'Danger', variant: 'danger' } },
                    { label: 'Ghost', component: { atom: 'button', text: 'Ghost', variant: 'ghost' } },
                    { label: 'Disabled', component: { atom: 'button', text: 'Disabled', variant: 'primary', disabled: true } },
                  ],
                },

                // === DISPLAY ===
                {
                  molecule: 'showcase',
                  title: 'Badge',
                  description: 'Status indicators with color variants',
                  layout: 'side-by-side',
                  variants: [
                    { label: 'Green', component: { atom: 'badge', text: 'Active', color: 'green' } },
                    { label: 'Yellow', component: { atom: 'badge', text: 'Warning', color: 'yellow' } },
                    { label: 'Red', component: { atom: 'badge', text: 'Error', color: 'red' } },
                    { label: 'Blue', component: { atom: 'badge', text: 'Info', color: 'blue' } },
                    { label: 'Gray', component: { atom: 'badge', text: 'Draft', color: 'gray' } },
                    { label: 'Gold', component: { atom: 'badge', text: 'Premium', color: 'gold' } },
                  ],
                },
                {
                  molecule: 'showcase',
                  title: 'Text',
                  description: 'Typography variants',
                  layout: 'side-by-side',
                  variants: [
                    { label: 'Heading', component: { atom: 'text', text: 'Heading Text', variant: 'heading' } },
                    { label: 'Default', component: { atom: 'text', text: 'Default body text', variant: 'default' } },
                    { label: 'Muted', component: { atom: 'text', text: 'Muted helper text', variant: 'muted' } },
                    { label: 'Small', component: { atom: 'text', text: 'Small caption text', variant: 'small' } },
                  ],
                },

                // Spinner
                {
                  molecule: 'showcase',
                  title: 'Spinner',
                  description: 'Loading indicators',
                  layout: 'side-by-side',
                  variants: [
                    { label: 'xs', component: { atom: 'spinner', size: 'xs' } },
                    { label: 'sm', component: { atom: 'spinner', size: 'sm' } },
                    { label: 'md', component: { atom: 'spinner', size: 'md' } },
                    { label: 'lg', component: { atom: 'spinner', size: 'lg' } },
                    { label: 'xl', component: { atom: 'spinner', size: 'xl' } },
                  ],
                },

                // Input
                {
                  molecule: 'showcase',
                  title: 'Input',
                  description: 'Text input fields with labels and validation',
                  layout: 'side-by-side',
                  previewAlign: 'stretch',
                  component: {
                    atom: 'input',
                    id: 'email',
                    label: 'Email',
                    type: 'email',
                    placeholder: 'you@example.com',
                  },
                  children: [
                    {
                      molecule: 'stack',
                      direction: 'horizontal',
                      gap: 'lg',
                      items: [
                        { molecule: 'stack', items: [{ atom: 'input', id: 'demo-text', label: 'Text' }, { atom: 'text', text: 'Default', variant: 'small' }] },
                        { molecule: 'stack', items: [{ atom: 'input', id: 'demo-pw', label: 'Password', type: 'password', placeholder: '••••••••' }, { atom: 'text', text: 'type: "password"', variant: 'small' }] },
                        { molecule: 'stack', items: [{ atom: 'input', id: 'demo-req', label: 'Required', required: true }, { atom: 'text', text: 'required: true', variant: 'small' }] },
                      ],
                    },
                  ],
                },

                // Number Input
                {
                  molecule: 'showcase',
                  title: 'Number Input',
                  description: 'Numeric input with min/max/step validation',
                  layout: 'side-by-side',
                  previewAlign: 'stretch',
                  component: {
                    atom: 'number-input',
                    id: 'quantity',
                    label: 'Quantity',
                    min: 0,
                    max: 100,
                    step: 1,
                    value: () => numberValue,
                    onChange: (v: number) => (numberValue = v),
                  },
                  children: [
                    {
                      molecule: 'stack',
                      direction: 'horizontal',
                      gap: 'lg',
                      items: [
                        { molecule: 'stack', items: [{ atom: 'number-input', id: 'demo-decimal', label: 'Decimal', step: 0.1, min: 0, max: 10 }, { atom: 'text', text: 'step: 0.1', variant: 'small' }] },
                        { molecule: 'stack', items: [{ atom: 'number-input', id: 'demo-range', label: 'Limited Range', min: 1, max: 5 }, { atom: 'text', text: 'min: 1, max: 5', variant: 'small' }] },
                      ],
                    },
                  ],
                },

                // Select
                {
                  molecule: 'showcase',
                  title: 'Select',
                  description: 'Dropdown selection with search',
                  layout: 'side-by-side',
                  previewAlign: 'stretch',
                  component: {
                    atom: 'select',
                    id: 'role',
                    label: 'Role',
                    placeholder: 'Select role...',
                    options: [
                      { value: 'user', label: 'User' },
                      { value: 'admin', label: 'Admin' },
                      { value: 'moderator', label: 'Moderator' },
                    ],
                  },
                  children: [
                    {
                      molecule: 'stack',
                      items: [
                        {
                          atom: 'select',
                          id: 'demo-placeholder',
                          label: 'With Placeholder',
                          placeholder: 'Select an item...',
                          options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }],
                        },
                        { atom: 'text', text: 'placeholder: "Select..."', variant: 'small' },
                      ],
                    },
                  ],
                },

                // Slider
                {
                  molecule: 'showcase',
                  title: 'Slider',
                  description: 'Range input with drag interaction',
                  layout: 'side-by-side',
                  previewAlign: 'stretch',
                  component: {
                    atom: 'slider',
                    id: 'volume',
                    label: 'Volume',
                    value: () => sliderValue,
                    onChange: (v: number) => (sliderValue = v),
                    min: 0,
                    max: 100,
                    showValue: true,
                  },
                },

                // Radio Group
                {
                  molecule: 'showcase',
                  title: 'Radio Group',
                  description: 'Single selection from options',
                  layout: 'side-by-side',
                  component: {
                    atom: 'radio-group',
                    id: 'plan',
                    label: 'Plan',
                    value: () => radioValue,
                    onChange: (v: string) => (radioValue = v),
                    options: [
                      { value: 'free', label: 'Free' },
                      { value: 'pro', label: 'Pro' },
                      { value: 'enterprise', label: 'Enterprise' },
                    ],
                  },
                },

                // Switch
                {
                  molecule: 'showcase',
                  title: 'Switch',
                  description: 'Toggle control for boolean values',
                  layout: 'side-by-side',
                  component: {
                    atom: 'switch',
                    id: 'notifications',
                    label: 'Enable notifications',
                  },
                },

                // Checkbox
                {
                  molecule: 'showcase',
                  title: 'Checkbox',
                  description: 'Boolean selection with label',
                  layout: 'side-by-side',
                  component: {
                    atom: 'checkbox',
                    id: 'terms',
                    label: 'I agree to the terms and conditions',
                  },
                },

                // Progress
                {
                  molecule: 'showcase',
                  title: 'Progress',
                  description: 'Progress bars with color variants',
                  layout: 'side-by-side',
                  previewAlign: 'stretch',
                  variants: [
                    { label: 'Primary', component: { atom: 'progress', label: 'Uploading...', value: () => 75, max: 100, color: 'primary', showValue: true } },
                    { label: 'Success', component: { atom: 'progress', label: 'Complete!', value: () => 100, max: 100, color: 'success', showValue: true } },
                    { label: 'Warning', component: { atom: 'progress', label: 'Storage used', value: () => 45, max: 100, color: 'warning', showValue: true } },
                    { label: 'Danger', component: { atom: 'progress', label: 'Disk full', value: () => 90, max: 100, color: 'danger', showValue: true } },
                  ],
                },

                // Icon
                {
                  molecule: 'showcase',
                  title: 'Icon',
                  description: 'Lucide icons in various sizes',
                  layout: 'side-by-side',
                  variants: [
                    { label: 'xs', component: { atom: 'icon', name: 'heart', size: 'xs' } },
                    { label: 'sm', component: { atom: 'icon', name: 'heart', size: 'sm' } },
                    { label: 'md', component: { atom: 'icon', name: 'heart', size: 'md' } },
                    { label: 'lg', component: { atom: 'icon', name: 'heart', size: 'lg' } },
                    { label: 'xl', component: { atom: 'icon', name: 'heart', size: 'xl' } },
                  ],
                },

                // Icon Button
                {
                  molecule: 'showcase',
                  title: 'Icon Button',
                  description: 'Clickable icons with variants',
                  layout: 'side-by-side',
                  variants: [
                    { label: 'Default', component: { atom: 'icon-button', icon: 'edit', label: 'Edit', variant: 'default' } },
                    { label: 'Danger', component: { atom: 'icon-button', icon: 'trash', label: 'Delete', variant: 'danger' } },
                    { label: 'Ghost', component: { atom: 'icon-button', icon: 'more-vertical', label: 'More', variant: 'ghost' } },
                  ],
                },

                // Tooltip
                {
                  molecule: 'showcase',
                  title: 'Tooltip',
                  description: 'Hover hints for additional information',
                  layout: 'side-by-side',
                  component: {
                    atom: 'tooltip',
                    content: 'This is a helpful tooltip!',
                    side: 'top',
                    children: [{ atom: 'button', text: 'Hover me', variant: 'secondary' }],
                  },
                },

                // Popover
                {
                  molecule: 'showcase',
                  title: 'Popover',
                  description: 'Rich content in a floating panel',
                  layout: 'side-by-side',
                  component: {
                    atom: 'popover',
                    trigger: [{ atom: 'button', text: 'Open Popover', variant: 'secondary' }],
                    children: [
                      { atom: 'text', variant: 'heading', text: 'Popover Title' },
                      { atom: 'text', variant: 'muted', text: 'Rich content goes here.' },
                    ],
                  },
                },

                // Divider
                {
                  molecule: 'showcase',
                  title: 'Divider',
                  description: 'Visual separator between content',
                  layout: 'side-by-side',
                  component: { atom: 'divider' },
                },

                // Image
                {
                  molecule: 'showcase',
                  title: 'Image',
                  description: 'Responsive images with fallback',
                  layout: 'side-by-side',
                  variants: [
                    { label: 'Default', component: { atom: 'image', src: 'https://picsum.photos/200/150', alt: 'Sample image' } },
                    { label: 'Rounded', component: { atom: 'image', src: 'https://picsum.photos/200/150', alt: 'Sample image', rounded: 'md' } },
                    { label: 'Circle', component: { atom: 'image', src: 'https://picsum.photos/150/150', alt: 'Sample image', rounded: 'full' } },
                  ],
                },

                // Avatar
                {
                  molecule: 'showcase',
                  title: 'Avatar',
                  description: 'User profile pictures with status',
                  layout: 'side-by-side',
                  variants: [
                    { label: 'Small', component: { atom: 'avatar', fallback: 'Alice', size: 'sm' } },
                    { label: 'Medium', component: { atom: 'avatar', fallback: 'Bob', size: 'md' } },
                    { label: 'Large', component: { atom: 'avatar', fallback: 'Charlie', size: 'lg' } },
                    { label: 'Online', component: { atom: 'avatar', fallback: 'Diana', size: 'lg', status: 'online' } },
                    { label: 'Busy', component: { atom: 'avatar', fallback: 'Erik', size: 'lg', status: 'busy' } },
                    { label: 'Square', component: { atom: 'avatar', fallback: 'Frank', size: 'lg', shape: 'square' } },
                    { label: 'No name', component: { atom: 'avatar', size: 'lg' } },
                  ],
                },

              ],
            },
          ],
        },

        // =====================================================
        // MOLECULES TAB
        // =====================================================
        {
          id: 'molecules',
          label: 'Molecules',
          content: [
            {
              molecule: 'stack',
              direction: 'vertical',
              gap: 'lg',
              padding: 'md',
              items: [
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
                  description: 'Grid layout with columns',
                  layout: 'side-by-side',
                  component: {
                    molecule: 'stack',
                      direction: 'horizontal',
                    gap: 'sm',
                    items: [
                      { atom: 'badge', text: '1', color: 'gray' },
                      { atom: 'badge', text: '2', color: 'gray' },
                      { atom: 'badge', text: '3', color: 'gray' },
                      { atom: 'badge', text: '4', color: 'gray' },
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
                    value: () => accordionValue,
                    onValueChange: (v: string | string[]) => (accordionValue = v as string),
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
                    value: () => searchSelectValue,
                    onChange: (v: string) => (searchSelectValue = v),
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
                      value: () => filterSearch,
                      onChange: (v: string) => (filterSearch = v),
                    },
                    filters: [
                      {
                        id: 'status-filter',
                        label: 'Status',
                        value: () => filterStatus,
                        onChange: (v: string) => (filterStatus = v),
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
                        value: () => filterRole,
                        onChange: (v: string) => (filterRole = v),
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
                      { label: 'JavaScript', count: 120, active: activeTag === 'JavaScript' },
                      { label: 'TypeScript', count: 95, active: activeTag === 'TypeScript' },
                      { label: 'React', count: 80, active: activeTag === 'React' },
                      { label: 'Svelte', count: 65, active: activeTag === 'Svelte' },
                      { label: 'Vue', count: 55, active: activeTag === 'Vue' },
                      { label: 'CSS', count: 45, active: activeTag === 'CSS' },
                      { label: 'HTML', count: 40, active: activeTag === 'HTML' },
                      { label: 'Node.js', count: 35, active: activeTag === 'Node.js' },
                    ],
                    onTagClick: (label: string) => (activeTag = activeTag === label ? '' : label),
                  },
                },
              ],
            },
          ],
        },

        // =====================================================
        // ORGANISMS TAB
        // =====================================================
        {
          id: 'organisms',
          label: 'Organisms',
          content: [
            {
              molecule: 'stack',
              direction: 'vertical',
              gap: 'lg',
              padding: 'md',
              items: [
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
                    onClick: () => (demoModalOpen = true),
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
                    onClick: () => (demoAlertOpen = true),
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
                    nodeSize: 'md',
                    nodes: [
                      { id: 'intro', title: 'Introduction', description: 'Get started', icon: 'play', status: () => treeNodeStatus['intro'] },
                      { id: 'basics', title: 'Basics', description: 'Core concepts', icon: 'book', parent: 'intro', status: () => treeNodeStatus['basics'] },
                      { id: 'advanced', title: 'Advanced', description: 'Deep dive', icon: 'rocket', parent: 'basics', status: () => treeNodeStatus['advanced'] },
                      { id: 'expert', title: 'Expert', description: 'Master level', icon: 'award', parent: 'advanced', status: () => treeNodeStatus['expert'] },
                      { id: 'master', title: 'Master', description: 'Complete mastery', icon: 'crown', parent: 'expert', status: () => treeNodeStatus['master'] },
                    ],
                    onNodeClick: (node: { id: string }) => {
                      const current = treeNodeStatus[node.id];
                      if (current === 'available') {
                        treeNodeStatus[node.id] = 'completed';
                        // Unlock next node
                        const order = ['intro', 'basics', 'advanced', 'expert', 'master'];
                        const idx = order.indexOf(node.id);
                        if (idx < order.length - 1) {
                          treeNodeStatus[order[idx + 1]] = 'available';
                        }
                        treeNodeStatus = { ...treeNodeStatus };
                      }
                    },
                  },
                },
              ],
            },
          ],
        },

        // =====================================================
        // EXTENSIONS TAB
        // =====================================================
        {
          id: 'extensions',
          label: 'Extensions',
          content: [
            {
              molecule: 'stack',
              direction: 'vertical',
              gap: 'lg',
              padding: 'md',
              items: [
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
                    { label: 'Line', component: { atom: 'chart', type: 'line', data: [{ label: 'Mon', value: 20 }, { label: 'Tue', value: 35 }, { label: 'Wed', value: 25 }, { label: 'Thu', value: 45 }, { label: 'Fri', value: 30 }], height: 150, showGrid: true } },
                    { label: 'Area', component: { atom: 'chart', type: 'area', data: [{ label: 'Mon', value: 20 }, { label: 'Tue', value: 35 }, { label: 'Wed', value: 25 }, { label: 'Thu', value: 45 }, { label: 'Fri', value: 30 }], height: 150, showGrid: true } },
                    { label: 'Bar', component: { atom: 'chart', type: 'bar', data: [{ label: 'Mon', value: 20 }, { label: 'Tue', value: 35 }, { label: 'Wed', value: 25 }, { label: 'Thu', value: 45 }, { label: 'Fri', value: 30 }], height: 150, showGrid: true } },
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
                    currentTime: () => videoTime,
                    onTimeUpdate: (t: number) => (videoTime = t),
                    playing: () => videoPlaying,
                    onPlayPause: (p: boolean) => (videoPlaying = p),
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
                    currentTime: () => videoTime,
                    onSeek: (t: number) => (videoTime = t),
                    zoom: () => timelineZoom,
                    onZoomChange: (z: number) => (timelineZoom = z),
                    selectedIds: () => selectedSegments,
                    onSelectionChange: (ids: Set<string>) => (selectedSegments = ids),
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
                        data: () => [
                          { id: 'a1', start: 0, end: 60, label: 'Background Music' },
                        ],
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
              ],
            },
          ],
        },
      ],
    },

    // Modal instance
    {
      organism: 'modal',
      id: 'demo-modal',
      title: 'Demo Modal',
      size: 'md',
      open: () => demoModalOpen,
      onClose: () => (demoModalOpen = false),
      content: [
        { atom: 'text', text: 'This is a modal dialog with focus trap.' },
        { atom: 'text', text: 'Press Escape or click outside to close.', variant: 'muted' },
        { atom: 'input', id: 'modal-input', label: 'Sample Input', placeholder: 'Type something...' },
      ],
      footer: [
        { atom: 'button', text: 'Cancel', variant: 'secondary', onClick: () => (demoModalOpen = false) },
        { atom: 'button', text: 'Confirm', variant: 'primary', onClick: () => (demoModalOpen = false) },
      ],
    },

    // Alert Dialog instance
    {
      organism: 'alert-dialog',
      open: () => demoAlertOpen,
      onOpenChange: (open: boolean) => (demoAlertOpen = open),
      title: 'Are you sure?',
      description: 'This action cannot be undone. This will permanently delete the item.',
      cancelLabel: 'Cancel',
      confirmLabel: 'Delete',
      variant: 'danger',
      onConfirm: () => console.log('Item deleted!'),
    },
  ],
} satisfies Page;
