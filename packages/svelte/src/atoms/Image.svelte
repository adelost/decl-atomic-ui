<script lang="ts">
  import type { ImageAtom } from '@daui/core';

  let {
    src,
    alt,
    width,
    height,
    fallback,
    objectFit = 'cover',
    rounded = false,
  }: Omit<ImageAtom, 'atom'> = $props();

  let resolvedSrc = $derived(typeof src === 'function' ? src() : src);
  let error = $state(false);

  function handleError() {
    error = true;
  }

  function getBorderRadius() {
    if (rounded === true) return '0.375rem';
    if (rounded === 'sm') return '0.25rem';
    if (rounded === 'md') return '0.375rem';
    if (rounded === 'lg') return '0.5rem';
    if (rounded === 'full') return '9999px';
    return '0';
  }
</script>

<img
  src={error && fallback ? fallback : resolvedSrc}
  {alt}
  width={width}
  height={height}
  onerror={handleError}
  class="image"
  style:object-fit={objectFit}
  style:border-radius={getBorderRadius()}
/>

<style>
  .image {
    display: block;
    max-width: 100%;
    height: auto;
  }
</style>
