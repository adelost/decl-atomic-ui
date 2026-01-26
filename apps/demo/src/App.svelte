<script lang="ts">
  import { PageRenderer, EffectOverlay, SectionRenderer, type DropdownMenuMolecule, type StackMolecule } from 'svelte-daui';
  import MotionCanvasTest from './MotionCanvasTest.svelte';
  import DemoHeader from './DemoHeader.svelte';
  import { componentsPage } from './pages/components';
  import { dashboardPage } from './pages/examples/dashboard';
  import { synthesizerPage } from './pages/examples/synthesizer';
  import { cryptodexPage } from './pages/examples/cryptodex';
  import { skydivePage } from './pages/examples/skydive';
  import { occultPage } from './pages/examples/occult';
  import { missionPage } from './pages/examples/mission';
  import { codePage } from './pages/examples/code.svelte';
  import { chatPage } from './pages/examples/chat';
  import { demoMetas } from './types/demo-meta';
  import './app.css';

  type PageType = 'components' | 'dashboard' | 'cryptodex' | 'skydive' | 'synthesizer' | 'occult' | 'mission' | 'code' | 'chat' | 'motion';

  let currentPage = $state<PageType>('components');

  const pages = {
    components: componentsPage,
    dashboard: dashboardPage,
    cryptodex: cryptodexPage,
    skydive: skydivePage,
    synthesizer: synthesizerPage,
    occult: occultPage,
    mission: missionPage,
    code: codePage,
    chat: chatPage,
  };

  const examples: { id: PageType; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'cryptodex', label: 'Crypto-Dex' },
    { id: 'skydive', label: 'Skydive Logger' },
    { id: 'synthesizer', label: 'Synthesizer' },
    { id: 'occult', label: 'Occult Archive' },
    { id: 'mission', label: 'Mission Control' },
    { id: 'code', label: 'Code Components' },
    { id: 'chat', label: 'Chat' },
  ];

  function isExample(page: PageType): boolean {
    return examples.some(e => e.id === page);
  }

  function getCurrentMeta() {
    if (isExample(currentPage) && currentPage in demoMetas) {
      return demoMetas[currentPage];
    }
    return null;
  }

  const examplesDropdown: DropdownMenuMolecule = {
    molecule: 'dropdown-menu',
    trigger: [{ atom: 'button', text: 'Examples ▼', variant: () => isExample(currentPage) ? 'primary' : 'ghost' }],
    items: examples.map(ex => ({
      id: ex.id,
      label: ex.label,
      onSelect: () => { currentPage = ex.id; },
    })),
    side: 'bottom',
    align: 'start',
  };

  const navBar: StackMolecule = $derived({
    molecule: 'stack',
    direction: 'horizontal',
    justify: 'between',
    align: 'center',
    padding: 'md',
    items: [
      { atom: 'text', text: 'DAUI', variant: 'heading' },
      {
        molecule: 'stack',
        direction: 'horizontal',
        gap: 'sm',
        items: [
          {
            atom: 'button',
            text: 'Components',
            variant: () => currentPage === 'components' ? 'primary' : 'ghost',
            onClick: () => { currentPage = 'components'; },
          },
          examplesDropdown,
          {
            atom: 'button',
            text: 'Motion',
            variant: () => currentPage === 'motion' ? 'primary' : 'ghost',
            onClick: () => { currentPage = 'motion'; },
          },
        ],
      },
    ],
  });
</script>

<nav class="page-nav">
  <SectionRenderer section={navBar} />
</nav>

<!-- Global effect overlay for confetti, achievements, etc. -->
<EffectOverlay />

{#if currentPage === 'motion'}
  <MotionCanvasTest />
{:else}
  {#if getCurrentMeta()}
    <DemoHeader meta={getCurrentMeta()!} />
  {/if}
  <PageRenderer page={pages[currentPage]} />
{/if}

<style>
  .page-nav {
    border-bottom: 1px solid hsl(var(--border, 240 5.9% 90%));
  }

  /* Reset section-wrapper margins in nav context */
  .page-nav :global(.section-wrapper) {
    margin-bottom: 0;
  }
</style>
