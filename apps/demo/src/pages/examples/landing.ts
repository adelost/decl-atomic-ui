import type { Page } from 'svelte-daui';

/**
 * Landing Page Example - Demonstrates Hero, Separator, and Parallax effects
 */
export const landingPage: Page = {
  layout: 'full',
  title: 'Landing Page',
  sections: [
    // Hero section with parallax
    {
      molecule: 'hero',
      backgroundImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600',
      overlayColor: 'rgba(15, 23, 42, 0.7)',
      parallax: true,
      parallaxSpeed: 0.4,
      height: 'lg',
      align: 'center',
      separator: { shape: 'curve', color: 'white', height: 120 },
      items: [
        { atom: 'text', variant: 'heading', text: 'Build Amazing Experiences' },
        { atom: 'text', variant: 'muted', text: 'The declarative way to create beautiful UIs' },
        { atom: 'divider', spacing: 'lg' },
        {
          molecule: 'stack',
          direction: 'horizontal',
          gap: 'md',
          justify: 'center',
          items: [
            { atom: 'button', text: 'Get Started', variant: 'primary' },
            { atom: 'button', text: 'View Docs', variant: 'ghost' },
          ],
        },
      ],
    },

    // Features section
    {
      molecule: 'container',
      maxWidth: 'lg',
      padding: 'lg',
      items: [
        {
          molecule: 'stack',
          direction: 'vertical',
          gap: 'lg',
          align: 'center',
          items: [
            { atom: 'text', variant: 'heading', text: 'Features' },
            { atom: 'divider', spacing: 'md' },
            {
              molecule: 'grid',
              columns: 3,
              gap: 'lg',
              items: [
                {
                  organism: 'card',
                  content: [
                    {
                      molecule: 'stack',
                      direction: 'vertical',
                      gap: 'md',
                      align: 'center',
                      items: [
                        { atom: 'icon', name: 'zap', size: 'xl' },
                        { atom: 'text', variant: 'heading', text: 'Fast' },
                        { atom: 'text', variant: 'muted', text: 'Lightning quick rendering with Svelte 5' },
                      ],
                    },
                  ],
                },
                {
                  organism: 'card',
                  content: [
                    {
                      molecule: 'stack',
                      direction: 'vertical',
                      gap: 'md',
                      align: 'center',
                      items: [
                        { atom: 'icon', name: 'code', size: 'xl' },
                        { atom: 'text', variant: 'heading', text: 'Declarative' },
                        { atom: 'text', variant: 'muted', text: 'Pages are data, not code' },
                      ],
                    },
                  ],
                },
                {
                  organism: 'card',
                  content: [
                    {
                      molecule: 'stack',
                      direction: 'vertical',
                      gap: 'md',
                      align: 'center',
                      items: [
                        { atom: 'icon', name: 'palette', size: 'xl' },
                        { atom: 'text', variant: 'heading', text: 'Beautiful' },
                        { atom: 'text', variant: 'muted', text: 'Pre-built components that look great' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // CTA section with separator
    { atom: 'separator', shape: 'wave', color: '#0f172a', height: 100, flip: true },
    {
      molecule: 'hero',
      backgroundColor: '#0f172a',
      height: 'sm',
      align: 'center',
      items: [
        { atom: 'text', variant: 'heading', text: 'Ready to get started?' },
        { atom: 'text', variant: 'muted', text: 'Join thousands of developers building with DAUI' },
        { atom: 'divider', spacing: 'md' },
        { atom: 'button', text: 'Start Free Trial', variant: 'primary' },
      ],
    },
  ],
};
