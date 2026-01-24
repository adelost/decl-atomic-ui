<script lang="ts">
  import type { StatCardMolecule } from "../types";
  import Icon from "../atoms/Icon.svelte";

  let {
    title,
    value,
    change,
    icon
  }: StatCardMolecule = $props();

  // Handle reactive value
  let displayValue = $derived(
    typeof value === "function" ? value() : value
  );

  // Format change percentage
  let changeText = $derived(
    change
      ? `${change.value >= 0 ? "+" : ""}${change.value}%${change.label ? ` ${change.label}` : ""}`
      : null
  );

  let isPositive = $derived(change ? change.value >= 0 : true);

  // Check if icon is an emoji (starts with emoji character) or a Lucide icon name
  let isEmoji = $derived(icon ? /^[\p{Emoji}]/u.test(icon) : false);
</script>

<div class="stat-card">
  <div class="stat-header">
    <span class="stat-title">{title}</span>
    {#if icon}
      <span class="stat-icon">
        {#if isEmoji}
          {icon}
        {:else}
          <Icon name={icon} size="md" class="text-muted-foreground" />
        {/if}
      </span>
    {/if}
  </div>

  <div class="stat-value">{displayValue}</div>

  {#if changeText}
    <div class="stat-change" class:positive={isPositive} class:negative={!isPositive}>
      <Icon name={isPositive ? "arrow-up" : "arrow-down"} size="xs" />
      {changeText}
    </div>
  {/if}
</div>

<style>
  .stat-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.5rem;
    background: hsl(var(--card, 0 0% 100%));
    border: 1px solid hsl(var(--border, 240 5.9% 90%));
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .stat-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(var(--muted-foreground, 240 3.8% 46.1%));
  }

  .stat-icon {
    font-size: 1.25rem;
    opacity: 0.7;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: hsl(var(--foreground, 240 10% 3.9%));
    line-height: 1.1;
    letter-spacing: -0.025em;
  }

  .stat-change {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .stat-change.positive {
    color: hsl(142 76% 36%);
  }

  .stat-change.negative {
    color: hsl(0 84% 60%);
  }
</style>
