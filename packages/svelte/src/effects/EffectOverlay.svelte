<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface EffectParticle {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    rotation: number;
    velocityX: number;
    velocityY: number;
    gravity: number;
    decay: number;
    opacity: number;
  }

  let particles = $state<EffectParticle[]>([]);
  let nextId = 0;
  let animationFrame: number;

  const COLORS = ['#f43f5e', '#8b5cf6', '#3b82f6', '#22c55e', '#eab308', '#f97316'];

  function spawnConfetti(detail?: { count?: number; x?: number; y?: number; spread?: number }) {
    const count = detail?.count ?? 50;
    const centerX = detail?.x ?? window.innerWidth / 2;
    const centerY = detail?.y ?? window.innerHeight * 0.3;
    const spread = detail?.spread ?? 360;

    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * spread - spread / 2) * (Math.PI / 180);
      const velocity = 8 + Math.random() * 8;

      particles.push({
        id: nextId++,
        x: centerX,
        y: centerY,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 6,
        rotation: Math.random() * 360,
        velocityX: Math.cos(angle - Math.PI / 2) * velocity,
        velocityY: Math.sin(angle - Math.PI / 2) * velocity,
        gravity: 0.3,
        decay: 0.97,
        opacity: 1,
      });
    }

    if (!animationFrame) {
      animate();
    }
  }

  function spawnEmoji(detail?: { emoji?: string; count?: number }) {
    const emoji = detail?.emoji ?? '🎉';
    const count = detail?.count ?? 10;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 5 + Math.random() * 10;

      particles.push({
        id: nextId++,
        x: centerX + (Math.random() - 0.5) * 200,
        y: centerY + (Math.random() - 0.5) * 200,
        color: emoji,
        size: 24 + Math.random() * 16,
        rotation: Math.random() * 360,
        velocityX: Math.cos(angle) * velocity,
        velocityY: Math.sin(angle) * velocity - 5,
        gravity: 0.2,
        decay: 0.98,
        opacity: 1,
      });
    }

    if (!animationFrame) {
      animate();
    }
  }

  function animate() {
    particles = particles
      .map((p) => ({
        ...p,
        x: p.x + p.velocityX,
        y: p.y + p.velocityY,
        velocityX: p.velocityX * p.decay,
        velocityY: p.velocityY * p.decay + p.gravity,
        rotation: p.rotation + p.velocityX * 2,
        opacity: p.opacity - 0.01,
      }))
      .filter((p) => p.opacity > 0 && p.y < window.innerHeight + 100);

    if (particles.length > 0) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      animationFrame = 0;
    }
  }

  function handleEffect(e: CustomEvent) {
    const detail = e.detail as Record<string, unknown> | undefined;
    const type = (detail?.type as string) ?? 'confetti';

    switch (type) {
      case 'confetti':
        spawnConfetti(detail as { count?: number; x?: number; y?: number; spread?: number });
        break;
      case 'emoji':
        spawnEmoji(detail as { emoji?: string; count?: number });
        break;
    }
  }

  function handleSecretCode() {
    spawnConfetti({ count: 100 });
    spawnEmoji({ emoji: '🎮', count: 5 });
  }

  onMount(() => {
    window.addEventListener('daui:effect', handleEffect as EventListener);
    window.addEventListener('daui:secretCode', handleSecretCode as EventListener);
  });

  onDestroy(() => {
    window.removeEventListener('daui:effect', handleEffect as EventListener);
    window.removeEventListener('daui:secretCode', handleSecretCode as EventListener);
    if (animationFrame) cancelAnimationFrame(animationFrame);
  });
</script>

{#if particles.length > 0}
  <div class="effect-overlay">
    {#each particles as p (p.id)}
      <div
        class="particle"
        class:emoji={p.color.length > 2}
        style="
          left: {p.x}px;
          top: {p.y}px;
          opacity: {p.opacity};
          transform: rotate({p.rotation}deg);
          font-size: {p.size}px;
          {p.color.length <= 7 ? `background: ${p.color}; width: ${p.size}px; height: ${p.size * 0.6}px;` : ''}
        "
      >
        {#if p.color.length > 2}{p.color}{/if}
      </div>
    {/each}
  </div>
{/if}

<style>
  .effect-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
  }

  .particle {
    position: absolute;
    border-radius: 2px;
  }

  .particle.emoji {
    background: none !important;
    width: auto !important;
    height: auto !important;
    line-height: 1;
  }
</style>
