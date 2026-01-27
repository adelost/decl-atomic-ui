import type { Page } from 'svelte-daui';

/**
 * Async Resources Demo Page
 *
 * Demonstrates the $async feature for declarative data fetching
 * with loading states, polling, and caching.
 */
export const asyncPage: Page = {
  layout: 'centered',
  title: 'Async Resources',
  sections: [
    {
      molecule: 'page-header',
      title: 'Async Resources ($async)',
      subtitle: 'Declarative data fetching with loading states and polling',
    },
    {
      molecule: 'grid',
      columns: 2,
      gap: 'lg',
      padding: 'md',
      items: [
        // Simple async fetch
        {
          organism: 'card',
          header: { atom: 'text', variant: 'heading', text: 'Simple Fetch' },
          content: [
            {
              atom: 'text',
              variant: 'muted',
              text: 'Basic async data fetching with automatic loading state.',
            },
            {
              atom: 'text',
              variant: 'small',
              text: `{
  molecule: 'list',
  items: {
    $async: '/api/users'
  }
}`,
            },
          ],
        },

        // Polling example
        {
          organism: 'card',
          header: { atom: 'text', variant: 'heading', text: 'With Polling' },
          content: [
            {
              atom: 'text',
              variant: 'muted',
              text: 'Auto-refresh data at specified intervals.',
            },
            {
              atom: 'text',
              variant: 'small',
              text: `{
  molecule: 'list',
  items: {
    $async: {
      url: '/api/orders',
      poll: 5000  // Refresh every 5s
    }
  }
}`,
            },
          ],
        },

        // Path extraction
        {
          organism: 'card',
          header: { atom: 'text', variant: 'heading', text: 'Path Extraction' },
          content: [
            {
              atom: 'text',
              variant: 'muted',
              text: 'Extract nested data from API responses.',
            },
            {
              atom: 'text',
              variant: 'small',
              text: `// API returns: { data: { users: [...] } }
{
  molecule: 'list',
  items: {
    $async: '/api/response',
    $path: 'data.users'
  }
}`,
            },
          ],
        },

        // Field mapping
        {
          organism: 'card',
          header: { atom: 'text', variant: 'heading', text: 'Field Mapping' },
          content: [
            {
              atom: 'text',
              variant: 'muted',
              text: 'Transform API fields to component expectations.',
            },
            {
              atom: 'text',
              variant: 'small',
              text: `// API: { userName, userId }
// Component wants: { label, value }
{
  molecule: 'select',
  options: {
    $async: '/api/users',
    $map: {
      label: 'userName',
      value: 'userId'
    }
  }
}`,
            },
          ],
        },

        // Caching
        {
          organism: 'card',
          header: { atom: 'text', variant: 'heading', text: 'With Caching' },
          content: [
            {
              atom: 'text',
              variant: 'muted',
              text: 'Cache responses for improved performance.',
            },
            {
              atom: 'text',
              variant: 'small',
              text: `{
  molecule: 'list',
  items: {
    $async: {
      url: '/api/categories',
      cache: 60000  // Cache for 1 minute
    }
  }
}`,
            },
          ],
        },

        // Custom loading/error states
        {
          organism: 'card',
          header: { atom: 'text', variant: 'heading', text: 'Custom States' },
          content: [
            {
              atom: 'text',
              variant: 'muted',
              text: 'Provide custom loading and error UI.',
            },
            {
              atom: 'text',
              variant: 'small',
              text: `{
  molecule: 'list',
  items: {
    $async: '/api/data'
  },
  $loading: {
    atom: 'skeleton',
    lines: 5
  },
  $error: {
    molecule: 'alert-panel',
    type: 'error',
    message: 'Failed to load'
  }
}`,
            },
          ],
        },
      ],
    },

    // Full example
    {
      organism: 'card',
      header: { atom: 'text', variant: 'heading', text: 'Complete Example' },
      content: [
        {
          atom: 'text',
          variant: 'muted',
          text: 'Combining all features for a real-world use case.',
        },
        {
          atom: 'text',
          variant: 'small',
          text: `{
  molecule: 'list',
  items: {
    $async: {
      url: '/api/notifications',
      poll: 10000,    // Check every 10s
      cache: 5000     // Cache for 5s
    },
    $path: 'data.items',
    $map: {
      label: 'title',
      value: 'id'
    }
  },
  $loading: {
    atom: 'skeleton',
    variant: 'text',
    lines: 3
  },
  $error: {
    molecule: 'alert-panel',
    type: 'error',
    message: 'Could not load notifications',
    dismissible: true
  }
}`,
        },
      ],
    },

    // API for programmatic use
    {
      organism: 'card',
      header: { atom: 'text', variant: 'heading', text: 'Programmatic API' },
      content: [
        {
          atom: 'text',
          variant: 'muted',
          text: 'For advanced use cases, use the async handler directly.',
        },
        {
          atom: 'text',
          variant: 'small',
          text: `import { createAsyncResource, clearAsyncCache } from 'svelte-daui/engine';

// Create a reactive async resource
const users = createAsyncResource('/api/users', {
  $path: 'data'
});

// Use in component
{#if $users.loading}
  <Loading />
{:else if $users.error}
  <Error message={$users.error} />
{:else}
  {#each $users.data as user}
    <UserCard {user} />
  {/each}
{/if}

// Clear cache when needed
clearAsyncCache('/api/users');`,
        },
      ],
    },
  ],
};
