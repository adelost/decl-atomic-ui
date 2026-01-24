<script lang="ts">
  import type { DividerAtom } from "../types";
  import { cn } from "$lib/utils";

  let { spacing = "md" }: DividerAtom = $props();

  const spacingClass = {
    sm: "my-2",
    md: "my-4",
    lg: "my-8"
  };
</script>

<div class={cn("h-[1px] w-full bg-border", spacingClass[spacing])}></div>