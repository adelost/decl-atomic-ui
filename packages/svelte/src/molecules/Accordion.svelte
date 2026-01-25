<script lang="ts">
  import { Accordion } from 'bits-ui';
  import Icon from '../atoms/Icon.svelte';

  interface AccordionItem {
    id: string;
    title: string;
    content: string;
    disabled?: boolean;
  }

  interface Props {
    id?: string;
    items: AccordionItem[];
    type?: 'single' | 'multiple';
    value?: () => string | string[];
    onValueChange?: (value: string | string[]) => void;
    collapsible?: boolean;
  }

  let {
    id,
    items,
    type = 'single',
    value,
    onValueChange,
    collapsible = true,
  }: Props = $props();

  let currentValue = $derived(value?.() ?? (type === 'single' ? '' : []));
</script>

{#if type === 'single'}
  <Accordion.Root
    {id}
    type="single"
    value={currentValue as string}
    onValueChange={(v: string) => onValueChange?.(v)}
    {collapsible}
    class="accordion"
  >
    {#each items as item (item.id)}
      <Accordion.Item value={item.id} disabled={item.disabled} class="accordion-item">
        <Accordion.Header>
          <Accordion.Trigger class="accordion-trigger">
            <span>{item.title}</span>
            <Icon name="chevron-down" size="sm" class="accordion-icon" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content class="accordion-content">
          <div class="accordion-content-inner">
            {item.content}
          </div>
        </Accordion.Content>
      </Accordion.Item>
    {/each}
  </Accordion.Root>
{:else}
  <Accordion.Root
    {id}
    type="multiple"
    value={currentValue as string[]}
    onValueChange={(v: string[]) => onValueChange?.(v)}
    class="accordion"
  >
    {#each items as item (item.id)}
      <Accordion.Item value={item.id} disabled={item.disabled} class="accordion-item">
        <Accordion.Header>
          <Accordion.Trigger class="accordion-trigger">
            <span>{item.title}</span>
            <Icon name="chevron-down" size="sm" class="accordion-icon" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content class="accordion-content">
          <div class="accordion-content-inner">
            {item.content}
          </div>
        </Accordion.Content>
      </Accordion.Item>
    {/each}
  </Accordion.Root>
{/if}

<style>
  :global(.accordion) {
    width: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  :global(.accordion-item) {
    border-bottom: 1px solid #e2e8f0;
  }

  :global(.accordion-item:last-child) {
    border-bottom: none;
  }

  :global(.accordion-trigger) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 1rem;
    background: white;
    border: none;
    font-size: 0.875rem;
    font-weight: 500;
    color: #0f172a;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.15s;
  }

  :global(.accordion-trigger:hover) {
    background-color: #f8fafc;
  }

  :global(.accordion-trigger:focus-visible) {
    outline: none;
    background-color: #f1f5f9;
  }

  :global(.accordion-trigger[data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global(.accordion-icon) {
    color: #64748b;
    transition: transform 0.2s;
  }

  :global(.accordion-trigger[data-state='open'] .accordion-icon) {
    transform: rotate(180deg);
  }

  :global(.accordion-content) {
    overflow: hidden;
    background-color: #f8fafc;
  }

  :global(.accordion-content[data-state='open']) {
    animation: accordion-down 0.2s ease-out;
  }

  :global(.accordion-content[data-state='closed']) {
    animation: accordion-up 0.2s ease-out;
  }

  .accordion-content-inner {
    padding: 1rem;
    font-size: 0.875rem;
    color: #64748b;
    line-height: 1.5;
  }

  @keyframes accordion-down {
    from {
      height: 0;
    }
    to {
      height: var(--bits-accordion-content-height);
    }
  }

  @keyframes accordion-up {
    from {
      height: var(--bits-accordion-content-height);
    }
    to {
      height: 0;
    }
  }
</style>
