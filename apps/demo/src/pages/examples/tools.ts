import type { Page } from 'svelte-daui';

/**
 * Tools Demo Page
 *
 * Showcases DAUI's declarative tools:
 * - $action for declarative mutations
 * - Toast notifications
 * - Effects (confetti, etc.)
 * - $emit escape hatch
 */
export const toolsPage: Page = {
  layout: 'full',
  title: 'DAUI Tools',
  sections: [
    {
      molecule: 'page-header',
      title: 'DAUI Tools',
      subtitle: 'Declarative actions, effects, and notifications',
    },

    // Toast demos
    {
      molecule: 'grid',
      columns: 2,
      gap: 'lg',
      padding: 'md',
      items: [
        {
          organism: 'card',
          header: { atom: 'text', variant: 'heading', text: 'Toast Notifications' },
          content: [
            {
              atom: 'text',
              variant: 'muted',
              text: 'Click buttons to trigger different toast types.',
            },
            {
              molecule: 'stack',
              direction: 'horizontal',
              gap: 'sm',
              wrap: true,
              items: [
                {
                  atom: 'button',
                  text: 'Success Toast',
                  variant: 'primary',
                  onClick: () => {
                    window.dispatchEvent(
                      new CustomEvent('daui:toast', {
                        detail: { text: 'Operation completed successfully!', variant: 'success' },
                      })
                    );
                  },
                },
                {
                  atom: 'button',
                  text: 'Error Toast',
                  variant: 'danger',
                  onClick: () => {
                    window.dispatchEvent(
                      new CustomEvent('daui:toast', {
                        detail: { text: 'Something went wrong!', variant: 'error' },
                      })
                    );
                  },
                },
                {
                  atom: 'button',
                  text: 'Info Toast',
                  variant: 'secondary',
                  onClick: () => {
                    window.dispatchEvent(
                      new CustomEvent('daui:toast', {
                        detail: { text: 'Here is some information.', variant: 'info' },
                      })
                    );
                  },
                },
              ],
            },
          ],
        },

        // Effects demos
        {
          organism: 'card',
          header: { atom: 'text', variant: 'heading', text: 'Visual Effects' },
          content: [
            {
              atom: 'text',
              variant: 'muted',
              text: 'Trigger celebratory effects.',
            },
            {
              molecule: 'stack',
              direction: 'horizontal',
              gap: 'sm',
              wrap: true,
              items: [
                {
                  atom: 'button',
                  text: 'Confetti!',
                  variant: 'primary',
                  onClick: () => {
                    window.dispatchEvent(
                      new CustomEvent('daui:effect', {
                        detail: { type: 'confetti', count: 80 },
                      })
                    );
                  },
                },
                {
                  atom: 'button',
                  text: 'Party Emoji',
                  variant: 'secondary',
                  onClick: () => {
                    window.dispatchEvent(
                      new CustomEvent('daui:effect', {
                        detail: { type: 'emoji', emoji: '🎉', count: 15 },
                      })
                    );
                  },
                },
                {
                  atom: 'button',
                  text: 'Rocket Launch',
                  variant: 'ghost',
                  onClick: () => {
                    window.dispatchEvent(
                      new CustomEvent('daui:effect', {
                        detail: { type: 'emoji', emoji: '🚀', count: 10 },
                      })
                    );
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    // $action demo
    {
      molecule: 'grid',
      columns: 2,
      gap: 'lg',
      padding: 'md',
      items: [
        {
          organism: 'card',
          header: { atom: 'text', variant: 'heading', text: '$action Demo Form' },
          content: [
            {
              atom: 'text',
              variant: 'muted',
              text: 'This form uses declarative $action - no callback code needed!',
            },
            {
              molecule: 'form',
              id: 'demo-action-form',
              $action: {
                endpoint: '/api/demo', // Won't actually work, but shows the pattern
                onPending: [{ $event: 'toast', text: 'Submitting...', variant: 'info' }],
                onSuccess: [
                  { $event: 'toast', text: 'Form submitted!' },
                  { $event: 'emit', name: 'form-success', data: { celebration: true } },
                ],
                onError: [{ $event: 'toast', text: 'Submission failed', variant: 'error' }],
              },
              fields: [
                {
                  atom: 'input',
                  id: 'demo-name',
                  label: 'Your Name',
                  placeholder: 'Enter your name',
                },
                {
                  atom: 'input',
                  id: 'demo-email',
                  label: 'Email',
                  type: 'email',
                  placeholder: 'you@example.com',
                },
                {
                  atom: 'button',
                  text: 'Submit with $action',
                  variant: 'primary',
                  submit: true,
                },
              ],
            },
          ],
        },

        // $emit escape hatch
        {
          organism: 'card',
          header: { atom: 'text', variant: 'heading', text: '$emit Escape Hatch' },
          content: [
            {
              atom: 'text',
              variant: 'muted',
              text: 'Use $emit for custom events when built-in effects are not enough.',
            },
            {
              atom: 'button',
              text: 'Emit Custom Event',
              variant: 'primary',
              onClick: () => {
                window.dispatchEvent(
                  new CustomEvent('daui:custom-action', {
                    detail: { message: 'Hello from custom event!', timestamp: Date.now() },
                  })
                );
                window.dispatchEvent(
                  new CustomEvent('daui:toast', {
                    detail: { text: 'Custom event emitted! Check console.', variant: 'info' },
                  })
                );
                console.log('[DAUI] Custom event dispatched');
              },
            },
            {
              molecule: 'stack',
              direction: 'vertical',
              gap: 'sm',
              padding: 'sm',
              items: [
                { atom: 'text', variant: 'small', text: 'Listen with:' },
                {
                  atom: 'text',
                  variant: 'small',
                  text: "window.addEventListener('daui:custom-action', handler)",
                },
              ],
            },
          ],
        },
      ],
    },

    // Code examples
    {
      organism: 'card',
      header: { atom: 'text', variant: 'heading', text: 'How It Works' },
      content: [
        {
          molecule: 'tabs',
          id: 'code-examples',
          tabs: [
            {
              id: 'action-code',
              label: '$action',
              content: [
                {
                  molecule: 'showcase',
                  title: 'Declarative Form Action',
                  description: 'Define side effects without callbacks',
                  component: {
                    molecule: 'form',
                    id: 'example-form',
                    $action: {
                      endpoint: '?/save',
                      onSuccess: [
                        { $event: 'toast', text: 'Saved!' },
                        { $event: 'close-modal' },
                        { $event: 'invalidate' },
                      ],
                    },
                    fields: [
                      { atom: 'input', id: 'name', label: 'Name' },
                    ],
                  },
                },
              ],
            },
            {
              id: 'toast-code',
              label: 'Toast',
              content: [
                {
                  molecule: 'showcase',
                  title: 'Toast Notification',
                  description: 'Dispatched via custom events',
                  component: {
                    atom: 'button',
                    text: 'Show Toast',
                    onClick: () => {
                      window.dispatchEvent(
                        new CustomEvent('daui:toast', {
                          detail: { text: 'Hello!', variant: 'success' },
                        })
                      );
                    },
                  },
                },
              ],
            },
            {
              id: 'effects-code',
              label: 'Effects',
              content: [
                {
                  molecule: 'showcase',
                  title: 'Confetti Effect',
                  description: 'Celebratory particle effects',
                  component: {
                    atom: 'button',
                    text: 'Celebrate',
                    onClick: () => {
                      window.dispatchEvent(
                        new CustomEvent('daui:effect', {
                          detail: { type: 'confetti', count: 50 },
                        })
                      );
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    // Available side effects reference
    {
      organism: 'card',
      header: { atom: 'text', variant: 'heading', text: 'Available Side Effects' },
      content: [
        {
          molecule: 'grid',
          columns: { default: 2, md: 3, lg: 5 },
          gap: 'md',
          items: [
            {
              molecule: 'stack',
              direction: 'vertical',
              gap: 'sm',
              items: [
                { atom: 'badge', text: 'toast', color: 'blue' },
                { atom: 'text', variant: 'small', text: 'Show notification' },
              ],
            },
            {
              molecule: 'stack',
              direction: 'vertical',
              gap: 'sm',
              items: [
                { atom: 'badge', text: 'close-modal', color: 'blue' },
                { atom: 'text', variant: 'small', text: 'Close current modal' },
              ],
            },
            {
              molecule: 'stack',
              direction: 'vertical',
              gap: 'sm',
              items: [
                { atom: 'badge', text: 'invalidate', color: 'blue' },
                { atom: 'text', variant: 'small', text: 'Refresh page data' },
              ],
            },
            {
              molecule: 'stack',
              direction: 'vertical',
              gap: 'sm',
              items: [
                { atom: 'badge', text: 'redirect', color: 'blue' },
                { atom: 'text', variant: 'small', text: 'Navigate to URL' },
              ],
            },
            {
              molecule: 'stack',
              direction: 'vertical',
              gap: 'sm',
              items: [
                { atom: 'badge', text: 'emit', color: 'green' },
                { atom: 'text', variant: 'small', text: 'Custom event' },
              ],
            },
          ],
        },
      ],
    },
  ],
};
