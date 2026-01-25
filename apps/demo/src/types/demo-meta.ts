// Demo metadata for example pages

export interface DemoMeta {
  title: string;
  subtitle: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  components: string[];
  patterns: string[];
}

// Metadata for all example pages
export const demoMetas: Record<string, DemoMeta> = {
  dashboard: {
    title: 'SaaS Dashboard',
    subtitle: 'Enterprise admin interface with CRUD, charts, and data tables',
    complexity: 'intermediate',
    components: ['Table', 'Chart', 'StatCard', 'Modal', 'Form', 'Tabs'],
    patterns: ['CRUD Actions', 'Data Filtering', 'Tab Navigation', 'Responsive Grid'],
  },
  cryptodex: {
    title: 'Crypto-Dex',
    subtitle: 'Creature database with filtering, search, and detail modals',
    complexity: 'beginner',
    components: ['Card', 'Modal', 'Input', 'Select', 'Badge', 'Progress'],
    patterns: ['Async Search', 'List Filtering', 'Detail View', 'Stat Visualization'],
  },
  skydive: {
    title: 'Skydive Logger',
    subtitle: 'Jump logbook with forms, checklists, and statistics',
    complexity: 'intermediate',
    components: ['Table', 'Form', 'Checkbox', 'Progress', 'StatCard', 'Tabs'],
    patterns: ['Multi-step Forms', 'Checklist Logic', 'Data Entry', 'Validation'],
  },
  synthesizer: {
    title: 'Synthesizer Lab',
    subtitle: 'Audio workstation with real-time controls and presets',
    complexity: 'advanced',
    components: ['Slider', 'Switch', 'Select', 'NumberInput', 'Table', 'Modal'],
    patterns: ['Real-time State', 'Complex Forms', 'Preset Management', 'Parameter Control'],
  },
  occult: {
    title: 'Occult Archive',
    subtitle: 'Dark-themed library with warnings, sanity tracking, and confirmations',
    complexity: 'intermediate',
    components: ['List', 'Progress', 'Alert', 'Modal', 'Badge', 'Button'],
    patterns: ['Confirmation Dialogs', 'Global State', 'Destructive Actions', 'Status Tracking'],
  },
  mission: {
    title: 'Mission Control',
    subtitle: 'Live monitoring dashboard with polling and real-time updates',
    complexity: 'advanced',
    components: ['Chart', 'StatCard', 'Badge', 'List', 'Button'],
    patterns: ['Polling', 'Live Updates', 'Status Indicators', 'Alert Management'],
  },
};
