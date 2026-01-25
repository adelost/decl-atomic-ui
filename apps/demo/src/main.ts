import { mount } from 'svelte';
import App from './App.svelte';

// Demo uses all presets and integrations
import { register } from 'svelte-daui';
import { full } from 'svelte-daui/presets';
import { three, matter, shiki, codemirror } from 'svelte-daui/integrations';

// Register everything for demo
register(full, three, matter, shiki, codemirror);

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
