<script lang="ts">
  import type { StackMolecule } from "../types";
  import SectionRenderer from "../renderer/SectionRenderer.svelte";

  let {
    items,
    direction = "vertical",
    gap = "md",
    padding = "none",
    align = "stretch",
    justify = "start",
    wrap = false
  }: StackMolecule = $props();

  const gapMap = {
    none: "0",
    sm: "0.5rem",
    md: "1rem",
    lg: "2rem"
  };

  const paddingMap = {
    none: "0",
    sm: "0.5rem",
    md: "1rem",
    lg: "2rem"
  };
</script>

<div
  class="stack"
  style:flex-direction={direction === "vertical" ? "column" : "row"}
  style:gap={gapMap[gap]}
  style:padding={paddingMap[padding]}
  style:align-items={align}
  style:justify-content={justify === "between" ? "space-between" : justify === "around" ? "space-around" : justify}
  style:flex-wrap={wrap ? "wrap" : "nowrap"}
>
  {#each items as item}
    <div class="stack-item">
      <SectionRenderer section={item} />
    </div>
  {/each}
</div>

<style>
  .stack {
    display: flex;
    width: 100%;
  }
  
  /* Helper to ensure items don't collapse unexpectedly */
  .stack-item {
    min-width: 0; 
  }
</style>
