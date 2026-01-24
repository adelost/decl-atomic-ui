<script lang="ts">
  import type { Atom } from "../types";
  
  // Import Atoms
  import Button from "../atoms/Button.svelte";
  import Input from "../atoms/Input.svelte";
  import Text from "../atoms/Text.svelte";
  import Divider from "../atoms/Divider.svelte";
  import Switch from "../atoms/Switch.svelte";
  import IconButton from "../atoms/IconButton.svelte";
  import Chart from "../atoms/Chart.svelte";
  import Icon from "../atoms/Icon.svelte";

  let { config }: { config: Atom } = $props();

  // Visible check - default to true if not provided
  let isVisible = $derived(typeof config.visible === "function" ? config.visible() : true);
</script>

{#if isVisible}
  {#if config.atom === "button"}
    <Button {...config} />
  {:else if config.atom === "input"}
    <Input {...config} />
  {:else if config.atom === "text"}
    <Text {...config} />
  {:else if config.atom === "divider"}
    <Divider {...config} />
  {:else if config.atom === "switch"}
    <Switch {...config} />
  {:else if config.atom === "icon-button"}
    <IconButton {...config} />
  {:else if config.atom === "chart"}
    <Chart {...config} />
  {:else if config.atom === "icon"}
    <Icon {...config} />
  {:else}
    <div style="color: red; border: 1px solid red; padding: 0.5rem;">
      Unknown atom: {config.atom}
    </div>
  {/if}
{/if}
