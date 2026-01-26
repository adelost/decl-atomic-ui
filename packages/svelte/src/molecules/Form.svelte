<script lang="ts">
  import type { FormMolecule } from '@daui/core';
  import SectionRenderer from '../renderer/SectionRenderer.svelte';
  import { executeEffects } from '../engine/effectRegistry';

  // Destructure with rename to avoid $ prefix in local variable
  let { id, fields, onSubmit, action, $action: actionDef }: FormMolecule = $props();

  // Determine the form action URL
  let formAction = $derived(actionDef?.endpoint ?? action);

  async function handleSubmit(e: SubmitEvent) {
    // If using $action, handle declaratively
    if (actionDef) {
      e.preventDefault();

      // Run onPending effects
      if (actionDef.onPending) {
        await executeEffects(actionDef.onPending);
      }

      try {
        const formData = new FormData(e.target as HTMLFormElement);
        const response = await fetch(actionDef.endpoint, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          // Run onSuccess effects
          if (actionDef.onSuccess) {
            await executeEffects(actionDef.onSuccess);
          }
        } else {
          // Run onError effects or default error
          if (actionDef.onError) {
            await executeEffects(actionDef.onError);
          } else {
            await executeEffects([
              { $event: 'toast', text: 'Something went wrong', variant: 'error' },
            ]);
          }
        }
      } catch (error) {
        // Run onError effects or default error
        if (actionDef.onError) {
          await executeEffects(actionDef.onError);
        } else {
          await executeEffects([
            {
              $event: 'toast',
              text: error instanceof Error ? error.message : 'Request failed',
              variant: 'error',
            },
          ]);
        }
      }
      return;
    }

    // Otherwise handle with onSubmit callback
    if (!action) {
      e.preventDefault(); // Only prevent default if not a server action
    }

    if (onSubmit) {
      // Collect form data from the DOM
      const formData = new FormData(e.target as HTMLFormElement);
      const values: Record<string, unknown> = {};

      formData.forEach((value, key) => {
        values[key] = value;
      });

      // TODO: Handle Intent objects if onSubmit is not a function
      if (typeof onSubmit === 'function') {
        onSubmit(values);
      }
    }
  }
</script>

<form {id} action={formAction} method="POST" onsubmit={handleSubmit}>
  {#each fields as field}
    <SectionRenderer section={field} />
  {/each}
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
</style>
