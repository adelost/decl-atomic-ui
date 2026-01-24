<script lang="ts">
  import type { FormMolecule } from "../types";
  import SectionRenderer from "../renderer/SectionRenderer.svelte";

  let { 
    id, 
    fields, 
    onSubmit, 
    action 
  }: FormMolecule = $props();

  function handleSubmit(e: SubmitEvent) {
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
      if (typeof onSubmit === "function") {
        onSubmit(values);
      }
    }
  }
</script>

<form {id} {action} method="POST" onsubmit={handleSubmit}>
  {#each fields as field}
    <!-- Force inputs to have 'name' equal to 'id' for FormData collection -->
    <SectionRenderer section={field} />
  {/each}
  
  <!-- Implicit submit button if none provided in fields? 
       No, explicit buttons should be added as atoms/molecules inside or outside -->
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
</style>
