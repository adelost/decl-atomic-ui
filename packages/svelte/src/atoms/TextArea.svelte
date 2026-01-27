<script lang="ts">
  import type { TextAreaAtom } from '@daui/core';

  let {
    id,
    label,
    placeholder,
    rows = 4,
    required,
    value,
    onChange,
  }: Omit<TextAreaAtom, 'atom'> = $props();

  let currentValue = $derived(typeof value === 'function' ? value() : (value ?? ''));

  function handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    if (onChange) {
      onChange(target.value);
    }
  }
</script>

<div class="textarea-field">
  {#if label}
    <label for={id} class="textarea-label">
      {label}
      {#if required}<span class="required">*</span>{/if}
    </label>
  {/if}
  <textarea
    {id}
    name={id}
    class="textarea-input"
    {placeholder}
    {rows}
    {required}
    value={currentValue}
    oninput={handleInput}
  ></textarea>
</div>

<style>
  .textarea-field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    width: 100%;
  }

  .textarea-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(var(--foreground));
  }

  .required {
    color: hsl(var(--destructive));
    margin-left: 0.25rem;
  }

  .textarea-input {
    display: block;
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    line-height: 1.5;
    color: hsl(var(--foreground));
    background-color: hsl(var(--background));
    border: 1px solid hsl(var(--input));
    border-radius: calc(var(--radius) - 2px);
    resize: vertical;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .textarea-input::placeholder {
    color: hsl(var(--muted-foreground));
  }

  .textarea-input:focus {
    outline: none;
    border-color: hsl(var(--ring));
    box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
  }

  .textarea-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
