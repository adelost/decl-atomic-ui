<script lang="ts">
  import type { SwitchAtom } from "../types";
  import { untrack } from "svelte";

  let {
    id,
    label,
    value,
    onChange
  }: SwitchAtom = $props();

  // Initialize from value getter, then manage locally
  let checked = $state(untrack(() => value?.() ?? false));

  // Sync when external value changes
  $effect(() => {
    if (value) {
      checked = value();
    }
  });

  function handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    checked = target.checked;
    onChange?.(checked);
  }
</script>

<label class="switch-container">
  <input
    type="checkbox"
    {id}
    name={id}
    bind:checked
    onchange={handleChange}
    class="switch-input"
  />
  <span class="switch-track">
    <span class="switch-thumb"></span>
  </span>
  {#if label}
    <span class="switch-label">{label}</span>
  {/if}
</label>

<style>
  .switch-container {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .switch-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .switch-track {
    position: relative;
    width: 2.5rem;
    height: 1.5rem;
    background-color: #d1d5db;
    border-radius: 9999px;
    transition: background-color 0.2s;
  }

  .switch-input:checked + .switch-track {
    background-color: #3b82f6;
  }

  .switch-input:focus-visible + .switch-track {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .switch-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 1.25rem;
    height: 1.25rem;
    background-color: white;
    border-radius: 9999px;
    transition: transform 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .switch-input:checked + .switch-track .switch-thumb {
    transform: translateX(1rem);
  }

  .switch-label {
    color: #374151;
    font-size: 0.875rem;
  }
</style>
