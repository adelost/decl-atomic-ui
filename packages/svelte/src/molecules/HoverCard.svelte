<script lang="ts">
  import type { HoverCardMolecule } from '@daui/core';
  import { LinkPreview } from 'bits-ui';
  import SectionRenderer from '../renderer/SectionRenderer.svelte';

  let {
    trigger,
    content,
    side = 'bottom',
    align = 'center',
    openDelay = 700,
    closeDelay = 300,
  }: HoverCardMolecule = $props();
</script>

<LinkPreview.Root {openDelay} {closeDelay}>
  <LinkPreview.Trigger asChild>
    {#snippet child({ props }: { props: Record<string, unknown> })}
      <span class="hover-card-trigger" {...props}>
        {#each trigger as section}
          <SectionRenderer {section} />
        {/each}
      </span>
    {/snippet}
  </LinkPreview.Trigger>
  <LinkPreview.Portal>
    <LinkPreview.Content {side} {align} sideOffset={4} class="hover-card-content">
      {#each content as section}
        <SectionRenderer {section} />
      {/each}
      <LinkPreview.Arrow class="hover-card-arrow" />
    </LinkPreview.Content>
  </LinkPreview.Portal>
</LinkPreview.Root>

<style>
  .hover-card-trigger {
    display: inline-flex;
    cursor: pointer;
  }

  :global(.hover-card-content) {
    z-index: 50;
    min-width: 16rem;
    max-width: 24rem;
    padding: 1rem;
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    animation: hover-card-in 0.2s ease-out;
  }

  :global(.hover-card-content[data-state='closed']) {
    animation: hover-card-out 0.15s ease-in;
  }

  :global(.hover-card-arrow) {
    fill: white;
    stroke: #e2e8f0;
    stroke-width: 1px;
  }

  @keyframes hover-card-in {
    from {
      opacity: 0;
      transform: translateY(4px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes hover-card-out {
    from {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateY(4px) scale(0.96);
    }
  }
</style>
