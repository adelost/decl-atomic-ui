import type { Page } from 'svelte-daui';

/**
 * Declarative Actions Demo Page
 *
 * Demonstrates the $action feature for forms and buttons,
 * showing how side effects can be declared without callbacks.
 */
export const actionsPage: Page = {
  layout: 'centered',
  title: 'Declarative Actions',
  sections: [
    {
      molecule: 'page-header',
      title: 'Declarative Actions ($action)',
      subtitle: 'Eliminate callback boilerplate with declarative side effects',
    },
    {
      molecule: 'grid',
      columns: 2,
      gap: 'lg',
      padding: 'md',
      items: [
        // Form with $action
        {
          organism: 'card',
          header: { atom: 'text', variant: 'heading', text: 'Form with $action' },
          content: [
            {
              atom: 'text',
              variant: 'muted',
              text: 'This form uses declarative side effects instead of callback handlers.',
            },
            {
              molecule: 'form',
              id: 'create-user-form',
              $action: {
                endpoint: '?/createUser',
                onPending: [{ $event: 'toast', text: 'Saving...', variant: 'info' }],
                onSuccess: [
                  { $event: 'toast', text: 'User created successfully!' },
                  { $event: 'close-modal' },
                  { $event: 'invalidate' },
                ],
                onError: [{ $event: 'toast', text: 'Failed to create user', variant: 'error' }],
              },
              fields: [
                {
                  atom: 'input',
                  id: 'name',
                  label: 'Full Name',
                  placeholder: 'Enter name',
                  required: true,
                },
                {
                  atom: 'input',
                  id: 'email',
                  label: 'Email Address',
                  type: 'email',
                  placeholder: 'Enter email',
                  required: true,
                },
                {
                  atom: 'button',
                  text: 'Create User',
                  variant: 'primary',
                  submit: true,
                },
              ],
            },
          ],
        },

        // Code comparison
        {
          organism: 'card',
          header: { atom: 'text', variant: 'heading', text: 'Before vs After' },
          content: [
            {
              molecule: 'tabs',
              id: 'code-tabs',
              tabs: [
                {
                  id: 'before',
                  label: 'Before (Callbacks)',
                  content: [
                    {
                      atom: 'text',
                      variant: 'small',
                      text: `// Traditional approach with callbacks
{
  molecule: 'form',
  onSubmit: async (data) => {
    try {
      showToast('Saving...');
      await api.createUser(data);
      showToast('User created!');
      closeModal();
      invalidateAll();
    } catch (e) {
      showToast('Failed', 'error');
    }
  }
}`,
                    },
                  ],
                },
                {
                  id: 'after',
                  label: 'After ($action)',
                  content: [
                    {
                      atom: 'text',
                      variant: 'small',
                      text: `// Declarative approach
{
  molecule: 'form',
  $action: {
    endpoint: '?/createUser',
    onSuccess: [
      { $event: 'toast', text: 'Created!' },
      { $event: 'close-modal' },
      { $event: 'invalidate' }
    ]
  }
}`,
                    },
                  ],
                },
              ],
            },
          ],
        },

        // Button with $action
        {
          organism: 'card',
          header: { atom: 'text', variant: 'heading', text: 'Button with $action' },
          content: [
            {
              atom: 'text',
              variant: 'muted',
              text: 'Buttons can also use $action for direct API calls.',
            },
            {
              molecule: 'stack',
              direction: 'horizontal',
              gap: 'md',
              items: [
                {
                  atom: 'button',
                  text: 'Delete Item',
                  variant: 'danger',
                  $action: {
                    endpoint: '?/deleteItem',
                    onPending: [{ $event: 'toast', text: 'Deleting...', variant: 'info' }],
                    onSuccess: [
                      { $event: 'toast', text: 'Item deleted' },
                      { $event: 'invalidate' },
                    ],
                  },
                },
                {
                  atom: 'button',
                  text: 'Refresh Data',
                  variant: 'secondary',
                  $action: {
                    endpoint: '?/refresh',
                    onSuccess: [
                      { $event: 'toast', text: 'Data refreshed' },
                      { $event: 'invalidate' },
                    ],
                  },
                },
              ],
            },
          ],
        },

        // Escape hatch with $emit
        {
          organism: 'card',
          header: { atom: 'text', variant: 'heading', text: 'Escape Hatch: $emit' },
          content: [
            {
              atom: 'text',
              variant: 'muted',
              text: 'For complex cases, use $emit to dispatch custom events.',
            },
            {
              atom: 'button',
              text: 'Trigger Celebration',
              variant: 'primary',
              $action: {
                endpoint: '?/celebrate',
                onSuccess: [
                  { $event: 'emit', name: 'confetti', data: { color: 'gold', count: 100 } },
                  { $event: 'toast', text: 'Party time!' },
                ],
              },
            },
            {
              atom: 'text',
              variant: 'small',
              text: "Listen with: window.addEventListener('daui:confetti', handler)",
            },
          ],
        },
      ],
    },

    // Available effects
    {
      organism: 'card',
      header: { atom: 'text', variant: 'heading', text: 'Available Side Effects' },
      content: [
        {
          molecule: 'grid',
          columns: 3,
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
                { atom: 'text', variant: 'small', text: 'Custom event (escape hatch)' },
              ],
            },
          ],
        },
      ],
    },
  ],
};
