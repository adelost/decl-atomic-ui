<script lang="ts">
  import type { Organism } from "../types";

  import Card from "../organisms/Card.svelte";
  import List from "../organisms/List.svelte";
  import Table from "../organisms/Table.svelte";
  import Modal from "../organisms/Modal.svelte";

  let { config }: { config: Organism } = $props();

  // Visible check - default to true if not provided
  let isVisible = $derived(typeof config.visible === "function" ? config.visible() : true);
</script>

{#if isVisible}
{#if config.organism === "card"}
  <Card {...config} />
{:else if config.organism === "list"}
  <List {...config} />
{:else if config.organism === "table"}
  <Table {...config} />
{:else if config.organism === "modal"}
  <Modal {...config} />
{:else}
  <div style="color: purple; border: 1px dashed purple; padding: 0.5rem;">
    Organism not implemented: {config.organism}
  </div>
{/if}
{/if}
