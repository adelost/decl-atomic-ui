<script lang="ts">
  import type { SpeedControlMolecule } from '@daui/core';

  let {
    speed,
    onChange,
    options = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2],
  }: Omit<SpeedControlMolecule, 'molecule'> = $props();

  let currentSpeed = $derived(speed());

  let isOpen = $state(false);
  let menuRef = $state<HTMLDivElement | null>(null);

  function selectSpeed(newSpeed: number) {
    onChange(newSpeed);
    isOpen = false;
  }

  function toggleMenu() {
    isOpen = !isOpen;
  }

  function handleClickOutside(e: MouseEvent) {
    if (menuRef && !menuRef.contains(e.target as Node)) {
      isOpen = false;
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      isOpen = false;
    }
  }

  function formatSpeed(s: number): string {
    return s === 1 ? '1x' : `${s}x`;
  }
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeyDown} />

<div class="speed-control" bind:this={menuRef}>
  <button
    class="speed-button"
    onclick={toggleMenu}
    aria-haspopup="listbox"
    aria-expanded={isOpen}
  >
    {formatSpeed(currentSpeed)}
  </button>

  {#if isOpen}
    <div class="speed-menu" role="listbox">
      {#each options as option}
        <button
          class="speed-option"
          class:active={option === currentSpeed}
          onclick={() => selectSpeed(option)}
          role="option"
          aria-selected={option === currentSpeed}
        >
          {formatSpeed(option)}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .speed-control {
    position: relative;
  }

  .speed-button {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 48px;
    height: 28px;
    padding: 0 8px;
    background-color: transparent;
    border: 1px solid hsl(var(--border));
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 500;
    color: hsl(var(--foreground));
    transition: background-color 0.15s ease;
  }

  .speed-button:hover {
    background-color: hsl(var(--muted));
  }

  .speed-menu {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 4px;
    background-color: hsl(var(--popover));
    border: 1px solid hsl(var(--border));
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 4px;
    z-index: 50;
    min-width: 60px;
  }

  .speed-option {
    display: block;
    width: 100%;
    padding: 6px 12px;
    background: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    text-align: center;
    color: hsl(var(--foreground));
    transition: background-color 0.1s ease;
  }

  .speed-option:hover {
    background-color: hsl(var(--muted));
  }

  .speed-option.active {
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
  }
</style>
