<script lang="ts">
  import type { TextAtom } from "../types";
  import { cn } from "$lib/utils";

  let { text, variant = "default" }: TextAtom = $props();

  let content = $derived(typeof text === "function" ? text() : text);
</script>

{#if variant === "heading"}
  <h3 class="text-2xl font-semibold leading-none tracking-tight">{content}</h3>
{:else if variant === "small"}
  <p class="text-sm font-medium leading-none">{content}</p>
{:else}
  <p class={cn(
    "text-sm",
    variant === "muted" ? "text-muted-foreground" : "text-foreground"
  )}>
    {content}
  </p>
{/if}