<script lang="ts">
  import type { HeroMolecule } from '@daui/core';
  import SectionRenderer from '../renderer/SectionRenderer.svelte';
  import { onMount } from 'svelte';

  let {
    backgroundImage,
    backgroundColor = '#1a1a1a',
    overlayColor,
    backgroundPosition = 'center',
    parallax = false,
    parallaxSpeed = 0.3,
    height = 'md',
    align = 'left',
    verticalAlign = 'center',
    contentWidth = 'lg',
    separator,
    items = [],
  }: HeroMolecule = $props();

  let heroEl: HTMLElement;
  let parallaxY = $state(0);

  onMount(() => {
    if (!parallax) return;

    function handleScroll() {
      if (!heroEl) return;
      const rect = heroEl.getBoundingClientRect();
      const scrolled = -rect.top;
      parallaxY = scrolled * parallaxSpeed;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  });

  const heights: Record<string, string> = {
    sm: 'min-height: 300px;',
    md: 'min-height: 500px;',
    lg: 'min-height: 700px;',
    full: 'min-height: 100vh;',
  };

  const widths: Record<string, string> = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    full: '100%',
  };

  const separatorPaths: Record<string, string> = {
    wave: 'M0,50 C150,100 350,0 500,50 L500,100 L0,100 Z',
    curve: 'M0,100 Q250,0 500,100 L500,100 L0,100 Z',
    slant: 'M0,100 L500,0 L500,100 Z',
    triangle: 'M0,100 L250,0 L500,100 Z',
  };
</script>

<section
  bind:this={heroEl}
  class="hero align-{align} vertical-{verticalAlign}"
  style="{heights[height]} background-color: {backgroundColor};"
>
  {#if backgroundImage}
    <div
      class="hero-bg"
      class:parallax
      style="background-image: url({backgroundImage}); background-position: {backgroundPosition}; {parallax ? `transform: translateY(${parallaxY}px);` : ''}"
    ></div>
  {/if}

  {#if overlayColor}
    <div class="hero-overlay" style="background-color: {overlayColor};"></div>
  {/if}

  <div class="hero-content" style="max-width: {widths[contentWidth]};">
    {#each items as item}
      <SectionRenderer section={item} />
    {/each}
  </div>

  {#if separator}
    <div class="hero-separator" style:height="{separator.height || 100}px">
      <svg viewBox="0 0 500 100" preserveAspectRatio="none" aria-hidden="true">
        <path d={separatorPaths[separator.shape]} fill={separator.color || 'white'} />
      </svg>
    </div>
  {/if}
</section>

<style>
  .hero {
    position: relative;
    width: 100%;
    display: flex;
    padding: 4rem 2rem;
    overflow: hidden;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-repeat: no-repeat;
    will-change: transform;
  }

  .hero-bg.parallax {
    /* Extend background for parallax movement */
    top: -20%;
    bottom: -20%;
    height: 140%;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    width: 100%;
    margin: 0 auto;
  }

  /* Horizontal alignment */
  .align-left .hero-content { margin-left: 0; margin-right: auto; text-align: left; }
  .align-center .hero-content { margin: 0 auto; text-align: center; }
  .align-right .hero-content { margin-left: auto; margin-right: 0; text-align: right; }

  /* Vertical alignment */
  .vertical-top { align-items: flex-start; }
  .vertical-center { align-items: center; }
  .vertical-bottom { align-items: flex-end; }

  .hero-separator {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    line-height: 0;
  }

  .hero-separator svg {
    width: 100%;
    height: 100%;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .hero {
      padding: 3rem 1rem;
    }
  }
</style>
