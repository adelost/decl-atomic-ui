<script lang="ts">
  import type { AvatarAtom } from '@daui/core';

  let {
    src,
    alt = '',
    fallback,
    size = 'md',
    shape = 'circle',
    status,
  }: Omit<AvatarAtom, 'atom'> = $props();

  let resolvedSrc = $derived(typeof src === 'function' ? src() : src);
  let srcError = $state(false);
  let fallbackError = $state(false);

  function handleSrcError() {
    srcError = true;
  }

  function handleFallbackError() {
    fallbackError = true;
  }

  const sizes = {
    xs: '1.5rem',
    sm: '2rem',
    md: '2.5rem',
    lg: '3rem',
    xl: '4rem',
  };

  const statusColors = {
    online: '#22c55e',
    offline: '#94a3b8',
    busy: '#ef4444',
    away: '#f59e0b',
  };

  function getDiceBearUrl(name: string, style: 'thumbs' | 'shapes' = 'thumbs'): string {
    const encoded = encodeURIComponent(name);
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encoded}`;
  }
</script>

<div
  class="avatar"
  class:circle={shape === 'circle'}
  class:square={shape === 'square'}
  style:width={sizes[size ?? 'md']}
  style:height={sizes[size ?? 'md']}
>
  {#if resolvedSrc && !srcError}
    <img
      src={resolvedSrc}
      alt={alt}
      onerror={handleSrcError}
      class="avatar-image"
    />
  {:else if fallback && !fallbackError}
    <img
      src={getDiceBearUrl(fallback, 'thumbs')}
      alt={alt || fallback}
      onerror={handleFallbackError}
      class="avatar-image"
    />
  {:else if fallback}
    <img
      src={getDiceBearUrl(fallback, 'shapes')}
      alt={alt || fallback}
      class="avatar-image"
    />
  {:else}
    <span class="avatar-fallback">?</span>
  {/if}

  {#if status}
    <span
      class="avatar-status"
      style:background-color={statusColors[status]}
    ></span>
  {/if}
</div>

<style>
  .avatar {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-color: #e2e8f0;
    flex-shrink: 0;
  }

  .avatar.circle {
    border-radius: 9999px;
  }

  .avatar.square {
    border-radius: 0.375rem;
  }

  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-fallback {
    font-size: 0.875em;
    font-weight: 500;
    color: #64748b;
  }

  .avatar-status {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 25%;
    height: 25%;
    min-width: 8px;
    min-height: 8px;
    border-radius: 9999px;
    border: 2px solid white;
  }
</style>
