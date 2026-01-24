<script lang="ts">
  import type { Molecule } from "../types";

  import Stack from "../molecules/Stack.svelte";
  import Grid from "../molecules/Grid.svelte";
  import Form from "../molecules/Form.svelte";
  import SearchSelect from "../molecules/SearchSelect.svelte";
  import Tabs from "../molecules/Tabs.svelte";
  import StatCard from "../molecules/StatCard.svelte";

  let { config }: { config: Molecule } = $props();

  // Visible check - default to true if not provided
  let isVisible = $derived(typeof config.visible === "function" ? config.visible() : true);
</script>

{#if isVisible}
{#if config.molecule === "stack"}
  <Stack {...config} />
{:else if config.molecule === "grid"}
  <Grid {...config} />
{:else if config.molecule === "form"}
  <Form {...config} />
{:else if config.molecule === "search-select"}
  <SearchSelect {...config} />
{:else if config.molecule === "tabs"}
  <Tabs {...config} />
{:else if config.molecule === "stat-card"}
  <StatCard {...config} />
{:else}
  <div style="color: orange; border: 1px dashed orange; padding: 0.5rem;">
    Molecule not implemented: {config.molecule}
  </div>
{/if}
{/if}
