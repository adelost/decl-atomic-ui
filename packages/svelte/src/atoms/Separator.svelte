<script lang="ts">
  import type { SeparatorAtom } from '@daui/core';

  let {
    shape = 'wave',
    color = 'white',
    height = 100,
    flip = false,
    position = 'bottom',
  }: SeparatorAtom = $props();

  const paths: Record<string, string> = {
    wave: 'M0,50 C150,100 350,0 500,50 L500,100 L0,100 Z',
    curve: 'M0,100 Q250,0 500,100 L500,100 L0,100 Z',
    slant: 'M0,100 L500,0 L500,100 Z',
    zigzag: 'M0,100 L50,50 L100,100 L150,50 L200,100 L250,50 L300,100 L350,50 L400,100 L450,50 L500,100 Z',
    triangle: 'M0,100 L250,0 L500,100 Z',
  };
</script>

<div
  class="separator"
  class:flip
  class:position-top={position === 'top'}
  style:height="{height}px"
>
  <svg
    viewBox="0 0 500 100"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path d={paths[shape]} fill={color} />
  </svg>
</div>

<style>
  .separator {
    width: 100%;
    overflow: hidden;
    line-height: 0;
  }

  .separator svg {
    width: 100%;
    height: 100%;
  }

  .flip {
    transform: scaleY(-1);
  }

  .position-top {
    margin-bottom: -1px;
  }

  .separator:not(.position-top) {
    margin-top: -1px;
  }
</style>
