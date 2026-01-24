<script lang="ts">
  import type { InputAtom } from "../types";
  import { untrack } from "svelte";
  import { cn } from "$lib/utils";

  let { 
    id, 
    label, 
    type = "text", 
    placeholder, 
    required, 
    value: getValue, 
    onChange 
  }: InputAtom = $props();

  let inputValue = $state(untrack(() => getValue?.() ?? ""));

  $effect(() => {
    if (getValue) {
      inputValue = getValue();
    }
  });

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    inputValue = target.value;
    onChange?.(inputValue);
  }
</script>

<div class="grid w-full max-w-sm items-center gap-1.5">
  {#if label}
    <label 
      for={id} 
      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {label}
      {#if required}<span class="text-destructive ms-1">*</span>{/if}
    </label>
  {/if}
  
  <input
    {id}
    name={id}
    {type}
    {placeholder}
    {required}
    value={inputValue}
    oninput={handleInput}
    class={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    )}
  />
</div>