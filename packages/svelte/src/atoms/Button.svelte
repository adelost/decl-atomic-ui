<script lang="ts">
  import type { ButtonAtom } from '@daui/core';
  import { tv } from 'tailwind-variants';
  import { createButtonActionHandler } from '../engine/actionHandler';

  // Destructure with rename to avoid $ prefix in local variable
  let {
    text,
    variant = 'primary',
    disabled,
    onClick,
    submit,
    $action: actionDef,
  }: Omit<ButtonAtom, 'atom'> = $props();

  let resolvedText = $derived(typeof text === 'function' ? text() : text);
  let resolvedVariant = $derived(typeof variant === 'function' ? variant() : variant);
  let isDisabled = $derived(typeof disabled === 'function' ? disabled() : !!disabled);

  // Track loading state for $action buttons
  let isLoading = $state(false);

  async function handleClick() {
    // If $action is defined, use declarative action handler
    if (actionDef) {
      isLoading = true;
      try {
        const handler = createButtonActionHandler(actionDef);
        await handler();
      } finally {
        isLoading = false;
      }
      return;
    }

    // Otherwise use traditional onClick callback
    if (typeof onClick === 'function') {
      await onClick();
    } else if (onClick) {
      console.warn('Intent execution not implemented yet', onClick);
    }
  }

  // Shadcn Button Variants using tailwind-variants
  const buttonVariants = tv({
    base: 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  });
</script>

<button
  class={buttonVariants({ variant: resolvedVariant })}
  type={submit ? 'submit' : 'button'}
  disabled={isDisabled || isLoading}
  onclick={handleClick}
>
  {#if isLoading}
    <span class="loading-spinner"></span>
  {/if}
  {resolvedText}
</button>

<style>
  .loading-spinner {
    display: inline-block;
    width: 1em;
    height: 1em;
    margin-right: 0.5em;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
