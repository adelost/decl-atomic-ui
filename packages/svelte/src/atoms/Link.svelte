<script lang="ts">
  import type { LinkAtom } from '@daui/core';
  import { tv } from 'tailwind-variants';

  let { text, href, variant = 'default' }: Omit<LinkAtom, 'atom'> = $props();

  const linkVariants = tv({
    base: 'inline-flex items-center gap-1 transition-colors',
    variants: {
      variant: {
        default: 'text-primary underline-offset-4 hover:underline',
        muted: 'text-muted-foreground hover:text-foreground',
        back: 'text-muted-foreground hover:text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  });
</script>

<a {href} class={linkVariants({ variant })}>
  {#if variant === 'back'}
    <span class="back-arrow">←</span>
  {/if}
  {text}
</a>

<style>
  .back-arrow {
    font-size: 1.1em;
  }
</style>
