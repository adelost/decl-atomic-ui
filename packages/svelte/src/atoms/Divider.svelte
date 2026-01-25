<script lang="ts">
  import type { DividerAtom } from '@daui/core';
  import { cn } from '@daui/core';

  let { spacing = 'md' }: DividerAtom = $props();

  const spacingClass = {
    sm: 'my-2',
    md: 'my-4',
    lg: 'my-8',
  };
</script>

<div class={cn('h-[1px] w-full bg-border', spacingClass[spacing])}></div>
