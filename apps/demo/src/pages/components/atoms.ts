import type { Section } from 'svelte-daui';
import { showcaseStore } from '../../stores/showcase.svelte';

/**
 * Atom showcases - single UI elements
 */
export const atomShowcases: Section[] = [
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

  // Skeleton
  {
    molecule: 'showcase',
    title: 'Skeleton',
    description: 'Placeholder loading states',
    layout: 'side-by-side',
    previewAlign: 'stretch',
    variants: [
      { label: 'Text', component: { atom: 'skeleton', variant: 'text', width: '100%' } },
      { label: 'Multi-line', component: { atom: 'skeleton', variant: 'text', lines: 3 } },
      { label: 'Circular', component: { atom: 'skeleton', variant: 'circular', width: 48, height: 48 } },
      { label: 'Rectangular', component: { atom: 'skeleton', variant: 'rectangular', width: '100%', height: 120 } },
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
      value: () => showcaseStore.numberValue,
      onChange: (v: number) => (showcaseStore.numberValue = v),
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
            options: [
              { value: 'a', label: 'A' },
              { value: 'b', label: 'B' },
            ],
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
      value: () => showcaseStore.sliderValue,
      onChange: (v: number) => (showcaseStore.sliderValue = v),
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
      value: () => showcaseStore.radioValue,
      onChange: (v: string) => (showcaseStore.radioValue = v),
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

  // Separator
  {
    molecule: 'showcase',
    title: 'Separator',
    description: 'Decorative section dividers with various shapes',
    layout: 'stacked',
    previewAlign: 'stretch',
    variants: [
      { label: 'Wave', component: { atom: 'separator', shape: 'wave', color: '#0f172a', height: 80 } },
      { label: 'Curve', component: { atom: 'separator', shape: 'curve', color: '#3b82f6', height: 80 } },
      { label: 'Slant', component: { atom: 'separator', shape: 'slant', color: '#10b981', height: 60 } },
      { label: 'Triangle', component: { atom: 'separator', shape: 'triangle', color: '#f59e0b', height: 80 } },
      { label: 'Zigzag', component: { atom: 'separator', shape: 'zigzag', color: '#8b5cf6', height: 60 } },
    ],
  },

  // Link
  {
    molecule: 'showcase',
    title: 'Link',
    description: 'Styled anchor links with variants',
    layout: 'side-by-side',
    variants: [
      { label: 'Default', component: { atom: 'link', text: 'Default Link', href: '#' } },
      { label: 'Muted', component: { atom: 'link', text: 'Muted Link', href: '#', variant: 'muted' } },
      { label: 'Back', component: { atom: 'link', text: 'Go Back', href: '#', variant: 'back' } },
    ],
  },

  // TextArea
  {
    molecule: 'showcase',
    title: 'TextArea',
    description: 'Multi-line text input',
    layout: 'side-by-side',
    previewAlign: 'stretch',
    component: {
      atom: 'textarea',
      id: 'demo-textarea',
      label: 'Description',
      placeholder: 'Enter a longer description...',
      rows: 4,
    },
  },

  // SearchInput
  {
    molecule: 'showcase',
    title: 'Search Input',
    description: 'Input with search icon and clear button',
    layout: 'side-by-side',
    previewAlign: 'stretch',
    component: {
      atom: 'search-input',
      id: 'demo-search',
      placeholder: 'Search...',
    },
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

  // Upload
  {
    molecule: 'showcase',
    title: 'Upload',
    description: 'Drag & drop file upload',
    layout: 'side-by-side',
    previewAlign: 'stretch',
    variants: [
      {
        label: 'Single',
        component: {
          atom: 'upload',
          id: 'upload-single',
          label: 'Avatar',
          accept: ['image/*'],
          placeholder: 'Drop image here or click to browse',
          sublabel: 'PNG, JPG up to 10MB',
          value: () => showcaseStore.uploadedFiles,
          onChange: (v: File | File[] | null) => (showcaseStore.uploadedFiles = v),
        },
      },
      {
        label: 'Multiple',
        component: {
          atom: 'upload',
          id: 'upload-multiple',
          label: 'Documents',
          multiple: true,
          accept: ['.pdf', '.doc', '.docx'],
          placeholder: 'Drop files here or click to browse',
          sublabel: 'PDF, DOC, DOCX',
        },
      },
      {
        label: 'Disabled',
        component: {
          atom: 'upload',
          id: 'upload-disabled',
          label: 'Locked Upload',
          disabled: true,
        },
      },
    ],
  },

  // Audio Player
  {
    molecule: 'showcase',
    title: 'Audio Player',
    description: 'Audio playback with controls',
    layout: 'side-by-side',
    previewAlign: 'stretch',
    variants: [
      {
        label: 'Default',
        component: {
          atom: 'audio-player',
          src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          showDownload: true,
        },
      },
      {
        label: 'Small',
        component: {
          atom: 'audio-player',
          src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
          size: 'sm',
          showDuration: true,
        },
      },
      {
        label: 'Large',
        component: {
          atom: 'audio-player',
          src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
          size: 'lg',
          showDownload: true,
          downloadFilename: 'audio.mp3',
        },
      },
    ],
  },

  // DatePicker
  {
    molecule: 'showcase',
    title: 'Date Picker',
    description: 'Calendar date selection',
    layout: 'side-by-side',
    previewAlign: 'stretch',
    variants: [
      {
        label: 'Default',
        component: {
          atom: 'date',
          id: 'date-default',
          label: 'Birth Date',
          value: () => showcaseStore.selectedDate,
          onChange: (v: Date | string | null) => (showcaseStore.selectedDate = v as Date | null),
        },
      },
      {
        label: 'With Range',
        component: {
          atom: 'date',
          id: 'date-range',
          label: 'Booking Date',
          placeholder: 'Select date...',
          minDate: new Date(),
          maxDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        },
      },
      {
        label: 'Required',
        component: {
          atom: 'date',
          id: 'date-required',
          label: 'Event Date',
          required: true,
        },
      },
      {
        label: 'Disabled',
        component: {
          atom: 'date',
          id: 'date-disabled',
          label: 'Locked Date',
          disabled: true,
        },
      },
    ],
  },

  { atom: 'divider' },
  { atom: 'text', variant: 'heading', text: '🆕 New Atoms (shadcn/Bits UI)' },

  // PIN Input
  {
    molecule: 'showcase',
    title: 'PIN Input',
    description: 'OTP/PIN code input with individual digit fields',
    layout: 'side-by-side',
    variants: [
      {
        label: 'Default',
        component: {
          atom: 'pin-input',
          id: 'pin-default',
          length: 6,
          value: () => showcaseStore.pinValue,
          onChange: (v: string) => (showcaseStore.pinValue = v),
          onComplete: (v: string) => alert(`PIN entered: ${v}`),
        },
      },
      {
        label: 'Numeric 4-digit',
        component: {
          atom: 'pin-input',
          id: 'pin-4digit',
          length: 4,
          type: 'numeric',
          placeholder: '•',
        },
      },
      {
        label: 'Masked',
        component: {
          atom: 'pin-input',
          id: 'pin-masked',
          length: 6,
          mask: true,
          type: 'numeric',
        },
      },
      {
        label: 'Disabled',
        component: {
          atom: 'pin-input',
          id: 'pin-disabled',
          length: 4,
          disabled: true,
        },
      },
    ],
  },

  // Toggle
  {
    molecule: 'showcase',
    title: 'Toggle',
    description: 'Pressable toggle button with on/off state',
    layout: 'side-by-side',
    variants: [
      {
        label: 'Default',
        component: {
          atom: 'toggle',
          id: 'toggle-default',
          value: () => showcaseStore.toggleValue,
          onChange: (v: boolean) => (showcaseStore.toggleValue = v),
          children: [{ atom: 'icon', name: 'bold', size: 'sm' }],
        },
      },
      {
        label: 'Outline',
        component: {
          atom: 'toggle',
          id: 'toggle-outline',
          variant: 'outline',
          children: [{ atom: 'icon', name: 'italic', size: 'sm' }],
        },
      },
      {
        label: 'With Text',
        component: {
          atom: 'toggle',
          id: 'toggle-text',
          variant: 'outline',
          children: [{ atom: 'text', text: 'Preview' }],
        },
      },
      {
        label: 'Small',
        component: {
          atom: 'toggle',
          id: 'toggle-sm',
          size: 'sm',
          variant: 'outline',
          children: [{ atom: 'icon', name: 'underline', size: 'sm' }],
        },
      },
    ],
  },

  // Kbd
  {
    molecule: 'showcase',
    title: 'Kbd',
    description: 'Display keyboard shortcuts',
    layout: 'side-by-side',
    variants: [
      { label: 'Single Key', component: { atom: 'kbd', keys: 'Esc' } },
      { label: 'Combo String', component: { atom: 'kbd', keys: 'Ctrl+S' } },
      { label: 'Array', component: { atom: 'kbd', keys: ['Cmd', 'Shift', 'P'] } },
      { label: 'Small', component: { atom: 'kbd', keys: 'Enter', size: 'sm' } },
    ],
    children: [
      {
        molecule: 'stack',
        direction: 'horizontal',
        gap: 'lg',
        align: 'center',
        items: [
          { molecule: 'stack', direction: 'horizontal', gap: 'sm', align: 'center', items: [{ atom: 'text', text: 'Save:' }, { atom: 'kbd', keys: 'Ctrl+S' }] },
          { molecule: 'stack', direction: 'horizontal', gap: 'sm', align: 'center', items: [{ atom: 'text', text: 'Undo:' }, { atom: 'kbd', keys: 'Ctrl+Z' }] },
          { molecule: 'stack', direction: 'horizontal', gap: 'sm', align: 'center', items: [{ atom: 'text', text: 'Paste:' }, { atom: 'kbd', keys: ['Cmd', 'V'] }] },
        ],
      },
    ],
  },

  // Meter
  {
    molecule: 'showcase',
    title: 'Meter',
    description: 'Capacity/level indicator with semantic colors',
    layout: 'side-by-side',
    previewAlign: 'stretch',
    variants: [
      {
        label: 'Default',
        component: {
          atom: 'meter',
          value: () => showcaseStore.meterValue,
          min: 0,
          max: 100,
          label: 'Storage Used',
          showValue: true,
        },
      },
      {
        label: 'With Thresholds',
        component: {
          atom: 'meter',
          value: () => 85,
          min: 0,
          max: 100,
          low: 25,
          high: 75,
          optimum: 50,
          label: 'CPU Usage',
          showValue: true,
        },
      },
      {
        label: 'Low Optimal',
        component: {
          atom: 'meter',
          value: () => 15,
          min: 0,
          max: 100,
          low: 30,
          high: 70,
          optimum: 10,
          label: 'Memory Pressure',
          showValue: true,
        },
      },
      {
        label: 'High Optimal',
        component: {
          atom: 'meter',
          value: () => 92,
          min: 0,
          max: 100,
          low: 30,
          high: 80,
          optimum: 100,
          label: 'Battery Level',
          showValue: true,
        },
      },
    ],
  },

  // Time Field
  {
    molecule: 'showcase',
    title: 'Time Field',
    description: 'Time input with native picker',
    layout: 'side-by-side',
    previewAlign: 'stretch',
    variants: [
      {
        label: 'Default',
        component: {
          atom: 'time-field',
          id: 'time-default',
          label: 'Meeting Time',
          value: () => showcaseStore.timeValue,
          onChange: (v: string) => (showcaseStore.timeValue = v),
        },
      },
      {
        label: 'With Range',
        component: {
          atom: 'time-field',
          id: 'time-range',
          label: 'Office Hours',
          min: '09:00',
          max: '17:00',
          step: 15,
        },
      },
      {
        label: 'Required',
        component: {
          atom: 'time-field',
          id: 'time-required',
          label: 'Appointment',
          required: true,
        },
      },
      {
        label: 'Disabled',
        component: {
          atom: 'time-field',
          id: 'time-disabled',
          label: 'Locked Time',
          disabled: true,
        },
      },
    ],
  },

  // Date Range Field
  {
    molecule: 'showcase',
    title: 'Date Range Field',
    description: 'Two date inputs for selecting a range',
    layout: 'side-by-side',
    previewAlign: 'stretch',
    variants: [
      {
        label: 'Default',
        component: {
          atom: 'date-range-field',
          id: 'daterange-default',
          label: 'Trip Dates',
          value: () => showcaseStore.dateRangeValue,
          onChange: (v: { start: Date | null; end: Date | null }) => (showcaseStore.dateRangeValue = v),
        },
      },
      {
        label: 'With Limits',
        component: {
          atom: 'date-range-field',
          id: 'daterange-limits',
          label: 'Booking Period',
          minDate: new Date(),
          maxDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        },
      },
      {
        label: 'Required',
        component: {
          atom: 'date-range-field',
          id: 'daterange-required',
          label: 'Project Timeline',
          required: true,
        },
      },
    ],
  },

  { atom: 'divider' },
  { atom: 'text', variant: 'heading', text: '💬 Chat Atoms' },

  // Chat Bubble
  {
    molecule: 'showcase',
    title: 'Chat Bubble',
    description: 'Message bubbles for chat interfaces',
    layout: 'side-by-side',
    variants: [
      { label: 'User', component: { atom: 'chat-bubble', content: 'Hello! How are you?', author: { name: 'You' }, timestamp: Date.now(), variant: 'user', status: 'read' } },
      { label: 'Assistant', component: { atom: 'chat-bubble', content: 'I am doing great, thanks for asking!', author: { name: 'Bot', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=bot' }, timestamp: Date.now(), variant: 'assistant' } },
      { label: 'System', component: { atom: 'chat-bubble', content: 'User joined the chat', author: { name: 'System' }, variant: 'system' } },
    ],
  },

  // Typing Indicator
  {
    molecule: 'showcase',
    title: 'Typing Indicator',
    description: 'Animated dots when someone is typing',
    layout: 'side-by-side',
    variants: [
      { label: 'Small', component: { atom: 'typing-indicator', author: { name: 'Alice' }, size: 'sm' } },
      { label: 'Medium', component: { atom: 'typing-indicator', author: { name: 'Bob', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob' }, size: 'md' } },
      { label: 'Large', component: { atom: 'typing-indicator', size: 'lg' } },
    ],
  },
];
