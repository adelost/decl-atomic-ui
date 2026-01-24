<script lang="ts">
  import type { Page } from "../types";
  import SectionRenderer from "./SectionRenderer.svelte";
  import { cn } from "$lib/utils";

  let { page }: { page: Page } = $props();
</script>

<div class="min-h-screen bg-background text-foreground font-sans antialiased">
  <div class={cn(
    "container mx-auto py-10",
    page.layout === "centered" && "max-w-md",
    page.layout === "full" && "max-w-7xl",
    page.layout === "sidebar" && "grid grid-cols-[250px_1fr] gap-6"
  )}>
    {#if page.title}
      <header class="mb-8">
        <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {page.title}
        </h1>
      </header>
    {/if}

    <main class="space-y-6">
      {#each page.sections as section}
        <SectionRenderer {section} />
      {/each}
    </main>
  </div>
</div>