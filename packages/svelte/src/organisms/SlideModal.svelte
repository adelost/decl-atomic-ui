<script lang="ts">
  import { Dialog } from 'bits-ui';
  import type { SlideModalOrganism, SlideItem, SlideTheme } from '@daui/core';
  import SectionRenderer from '../renderer/SectionRenderer.svelte';
  import Icon from '../atoms/Icon.svelte';

  let {
    id,
    open,
    onClose,
    slides: slidesInput,
    currentIndex: getCurrentIndex,
    onIndexChange,
    showDots = true,
    showArrows = false,
    nextText = 'Next',
    prevText = 'Back',
    closeText = 'Close',
    allowBackdropClose = false,
    onSlideChange,
    onComplete,
    size = 'md',
    variant = 'default',
  }: Omit<SlideModalOrganism, 'organism'> = $props();

  // Internal state
  let internalIndex = $state(0);
  let isTransitioning = $state(false);
  let showContent = $state(false);

  // Resolve slides
  let slides = $derived(typeof slidesInput === 'function' ? slidesInput() : slidesInput);

  // Use external index if provided, otherwise internal
  let currentIndex = $derived(getCurrentIndex ? getCurrentIndex() : internalIndex);
  let currentSlide = $derived(slides[currentIndex] ?? null);
  let isOpen = $derived(open());
  let isFirst = $derived(currentIndex === 0);
  let isLast = $derived(currentIndex === slides.length - 1);
  let theme = $derived<SlideTheme>(currentSlide?.theme ?? 'default');

  // Theme colors
  const themeColors: Record<SlideTheme, { primary: string; glow: string; bg: string }> = {
    default: { primary: '#3b82f6', glow: 'rgba(59, 130, 246, 0.5)', bg: 'rgba(59, 130, 246, 0.1)' },
    gold: { primary: '#f59e0b', glow: 'rgba(245, 158, 11, 0.5)', bg: 'rgba(245, 158, 11, 0.1)' },
    cyan: { primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.5)', bg: 'rgba(6, 182, 212, 0.1)' },
    green: { primary: '#22c55e', glow: 'rgba(34, 197, 94, 0.5)', bg: 'rgba(34, 197, 94, 0.1)' },
    purple: { primary: '#a855f7', glow: 'rgba(168, 85, 247, 0.5)', bg: 'rgba(168, 85, 247, 0.1)' },
  };

  const themeSparkles: Record<SlideTheme, string> = {
    default: '✨',
    gold: '✨',
    cyan: '🎯',
    green: '🌟',
    purple: '💫',
  };

  // Show content with delay on open
  $effect(() => {
    if (isOpen && currentSlide && !showContent && !isTransitioning) {
      setTimeout(() => {
        showContent = true;
        onSlideChange?.(currentSlide!, currentIndex);
      }, 100);
    }
  });

  // Reset state when modal closes
  $effect(() => {
    if (!isOpen) {
      showContent = false;
      internalIndex = 0;
    }
  });

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen && allowBackdropClose) {
      handleClose();
    }
  }

  function handleClose() {
    showContent = false;
    onClose();
  }

  function goToIndex(index: number) {
    if (index < 0 || index >= slides.length || isTransitioning) return;

    isTransitioning = true;
    showContent = false;

    setTimeout(() => {
      if (onIndexChange) {
        onIndexChange(index);
      } else {
        internalIndex = index;
      }

      setTimeout(() => {
        showContent = true;
        isTransitioning = false;
        onSlideChange?.(slides[index], index);
      }, 100);
    }, 300);
  }

  function handleNext() {
    if (isLast) {
      onComplete?.();
      handleClose();
    } else {
      goToIndex(currentIndex + 1);
    }
  }

  function handlePrev() {
    if (!isFirst) {
      goToIndex(currentIndex - 1);
    }
  }

  const sizeClasses: Record<string, string> = {
    sm: 'slide-modal--sm',
    md: 'slide-modal--md',
    lg: 'slide-modal--lg',
  };

  // Check if icon is numeric (for level display)
  let isNumericIcon = $derived(currentSlide?.icon && /^\d+$/.test(currentSlide.icon));
</script>

<Dialog.Root
  open={isOpen}
  onOpenChange={handleOpenChange}
  closeOnEscapeKeyDown={true}
  closeOnOutsideClick={allowBackdropClose}
>
  <Dialog.Portal>
    <Dialog.Overlay class="slide-modal-overlay" />
    <Dialog.Content
      {id}
      class="slide-modal {sizeClasses[size]} slide-modal--{variant}"
      style="--theme-primary: {themeColors[theme].primary}; --theme-glow: {themeColors[theme].glow}; --theme-bg: {themeColors[theme].bg};"
    >
      {#if showContent && currentSlide}
        <div class="slide-modal__content" class:slide-modal__content--visible={showContent}>
          <!-- Header -->
          {#if currentSlide.header}
            <div class="slide-modal__header">
              <span class="slide-modal__sparkle">{themeSparkles[theme]}</span>
              <span class="slide-modal__header-text">{currentSlide.header}</span>
              <span class="slide-modal__sparkle slide-modal__sparkle--delayed">{themeSparkles[theme]}</span>
            </div>
          {/if}

          <!-- Icon -->
          {#if currentSlide.icon}
            <div class="slide-modal__icon" class:slide-modal__icon--numeric={isNumericIcon}>
              {#if isNumericIcon}
                <span class="slide-modal__level">{currentSlide.icon}</span>
              {:else}
                <span class="slide-modal__emoji">{currentSlide.icon}</span>
              {/if}
            </div>
          {/if}

          <!-- Title & Subtitle -->
          <Dialog.Title class="slide-modal__title">{currentSlide.title}</Dialog.Title>
          {#if currentSlide.subtitle}
            <p class="slide-modal__subtitle">{currentSlide.subtitle}</p>
          {/if}

          <!-- Badge -->
          {#if currentSlide.badge}
            <div class="slide-modal__badge">{currentSlide.badge}</div>
          {/if}

          <!-- Custom Content -->
          {#if currentSlide.content && currentSlide.content.length > 0}
            <div class="slide-modal__custom-content">
              {#each currentSlide.content as section}
                <SectionRenderer {section} />
              {/each}
            </div>
          {/if}

          <Dialog.Description class="sr-only">
            {currentSlide.title}
          </Dialog.Description>
        </div>
      {/if}

      <!-- Dots -->
      {#if showDots && slides.length > 1}
        <div class="slide-modal__dots">
          {#each slides as _, i}
            <button
              type="button"
              class="slide-modal__dot"
              class:slide-modal__dot--active={i === currentIndex}
              onclick={() => goToIndex(i)}
              aria-label="Go to slide {i + 1}"
            ></button>
          {/each}
        </div>
      {/if}

      <!-- Navigation -->
      <div class="slide-modal__nav">
        {#if showArrows && !isFirst}
          <button type="button" class="slide-modal__btn slide-modal__btn--secondary" onclick={handlePrev}>
            {prevText}
          </button>
        {:else}
          <div></div>
        {/if}

        <button type="button" class="slide-modal__btn slide-modal__btn--primary" onclick={handleNext}>
          {isLast ? closeText : nextText}
        </button>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  :global(.slide-modal-overlay) {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    animation: fade-in 0.2s ease-out;
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  :global(.slide-modal) {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 50;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    border-radius: 1rem;
    background: white;
    box-shadow:
      0 0 0 1px var(--theme-glow),
      0 25px 50px -12px rgba(0, 0, 0, 0.4);
    animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes scale-in {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  :global(.slide-modal--sm) {
    width: 20rem;
    max-width: 90vw;
  }

  :global(.slide-modal--md) {
    width: 24rem;
    max-width: 90vw;
  }

  :global(.slide-modal--lg) {
    width: 32rem;
    max-width: 90vw;
  }

  /* Celebration variant */
  :global(.slide-modal--celebration) {
    background: linear-gradient(180deg, white 0%, var(--theme-bg) 100%);
    border: 2px solid var(--theme-primary);
  }

  /* Onboarding variant */
  :global(.slide-modal--onboarding) {
    padding: 2.5rem;
  }

  .slide-modal__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s, transform 0.3s;
  }

  .slide-modal__content--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .slide-modal__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .slide-modal__header-text {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--theme-primary);
  }

  .slide-modal__sparkle {
    font-size: 1.25rem;
    animation: sparkle 1.5s ease-in-out infinite;
  }

  .slide-modal__sparkle--delayed {
    animation-delay: 0.75s;
  }

  @keyframes sparkle {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .slide-modal__icon {
    margin-bottom: 1rem;
  }

  .slide-modal__emoji {
    font-size: 4rem;
    display: block;
    animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .slide-modal__icon--numeric {
    width: 5rem;
    height: 5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    background: linear-gradient(135deg, var(--theme-primary), color-mix(in srgb, var(--theme-primary) 70%, black));
    box-shadow: 0 4px 20px var(--theme-glow);
    animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .slide-modal__level {
    font-size: 2rem;
    font-weight: 700;
    color: white;
  }

  @keyframes bounce-in {
    0% { transform: scale(0) rotate(-10deg); }
    50% { transform: scale(1.2) rotate(5deg); }
    70% { transform: scale(0.9) rotate(-3deg); }
    100% { transform: scale(1) rotate(0); }
  }

  :global(.slide-modal__title) {
    margin: 0 0 0.5rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
  }

  .slide-modal__subtitle {
    margin: 0 0 1rem;
    font-size: 0.875rem;
    color: #64748b;
    max-width: 20rem;
  }

  .slide-modal__badge {
    display: inline-flex;
    align-items: center;
    padding: 0.375rem 0.875rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--theme-primary);
    background: var(--theme-bg);
    border: 1px solid var(--theme-primary);
    border-radius: 9999px;
    animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
  }

  .slide-modal__custom-content {
    width: 100%;
    margin-top: 1rem;
  }

  .slide-modal__dots {
    display: flex;
    gap: 0.5rem;
    margin: 1.5rem 0 1rem;
  }

  .slide-modal__dot {
    width: 0.5rem;
    height: 0.5rem;
    padding: 0;
    border: none;
    border-radius: 9999px;
    background: #e2e8f0;
    cursor: pointer;
    transition: all 0.2s;
  }

  .slide-modal__dot:hover {
    background: #cbd5e1;
  }

  .slide-modal__dot--active {
    background: var(--theme-primary);
    transform: scale(1.3);
  }

  .slide-modal__nav {
    display: flex;
    gap: 0.75rem;
    width: 100%;
    margin-top: 0.5rem;
  }

  .slide-modal__btn {
    flex: 1;
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .slide-modal__btn--primary {
    background: var(--theme-primary);
    color: white;
  }

  .slide-modal__btn--primary:hover {
    filter: brightness(1.1);
  }

  .slide-modal__btn--secondary {
    background: #f1f5f9;
    color: #475569;
  }

  .slide-modal__btn--secondary:hover {
    background: #e2e8f0;
  }

  :global(.sr-only) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
