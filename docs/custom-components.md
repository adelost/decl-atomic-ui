# Custom Components

DAUI kommer med alla komponenter du behöver - men ibland vill du byta ut en mot din egen implementation. Det är enkelt.

## Så här funkar det

```
┌─────────────────────────────────────────────────────────┐
│  Din page-definition                                    │
│  { atom: 'button', text: 'Click me' }                  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Registry                                               │
│  Finns override för 'button'?                          │
│  ✓ Ja → använd din komponent                           │
│  ✗ Nej → använd DAUI:s default                         │
└─────────────────────────────────────────────────────────┘
```

## Registrera en custom komponent

```typescript
// main.ts (eller var du startar appen)
import { registerComponent } from 'daui';
import MyButton from './components/MyButton.svelte';

// Ersätt DAUI:s button med din egen
registerComponent('atom', 'button', MyButton);
```

Klart. Nu renderas alla `{ atom: 'button' }` med din komponent.

## Din komponent får samma props

```svelte
<!-- MyButton.svelte -->
<script lang="ts">
  import type { ButtonAtom } from 'daui';

  // Samma props som DAUI:s Button
  let { text, variant = 'primary', disabled, onClick }: Omit<ButtonAtom, 'atom'> = $props();

  let resolvedText = $derived(typeof text === 'function' ? text() : text);
</script>

<button
  class="my-custom-button {variant}"
  disabled={disabled}
  onclick={onClick}
>
  {resolvedText}
</button>

<style>
  .my-custom-button {
    /* Din egen styling */
  }
</style>
```

## Registrera flera på en gång

```typescript
import { registerComponents } from 'daui';
import MyButton from './components/MyButton.svelte';
import MyInput from './components/MyInput.svelte';
import MyTable from './components/MyTable.svelte';

registerComponents({
  atoms: {
    'button': MyButton,
    'input': MyInput,
  },
  organisms: {
    'table': MyTable,
  },
});
```

## Skapa helt nya komponenter

Du kan också lägga till komponenter som inte finns i DAUI:

```typescript
// 1. Definiera typen
interface MyCustomAtom extends BaseAtom {
  atom: 'my-custom';
  title: string;
  items: string[];
}

// 2. Skapa komponenten
// MyCustom.svelte
<script lang="ts">
  let { title, items } = $props();
</script>
<div>
  <h3>{title}</h3>
  <ul>
    {#each items as item}
      <li>{item}</li>
    {/each}
  </ul>
</div>

// 3. Registrera
registerComponent('atom', 'my-custom', MyCustom);

// 4. Använd i page
const page = {
  sections: [
    { atom: 'my-custom', title: 'Min lista', items: ['A', 'B', 'C'] }
  ]
};
```

## Tree-shaking

Om du **inte** använder en DAUI-komponent i någon page-definition, tas den bort från produktionsbygget automatiskt. Du betalar bara för det du använder.

```typescript
// Om ingen page använder 'video-timeline'...
// → VideoTimeline.svelte, Playhead.svelte, etc. stripps bort av Vite
```

## FAQ

### Måste jag registrera innan appen startar?
Ja, registrera i `main.ts` innan du renderar första sidan.

### Kan jag använda DAUI:s komponent inuti min override?
Ja! Importera den direkt:

```svelte
<script>
  import { Button } from 'daui/atoms';
</script>

<div class="wrapper">
  <Button {...$$props} />
</div>
```

### Hur testar jag mina custom komponenter?
```typescript
import { clearRegistry, registerComponent } from 'daui';

beforeEach(() => {
  clearRegistry(); // Rensa mellan tester
});

test('my custom button', () => {
  registerComponent('atom', 'button', MyButton);
  // ...
});
```
