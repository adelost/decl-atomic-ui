<script lang="ts">
  interface Props {
    text: string | (() => string);
    color:
      | 'green'
      | 'yellow'
      | 'red'
      | 'blue'
      | 'gray'
      | 'gold'
      | (() => 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'gold');
  }

  let { text, color }: Props = $props();

  let displayText = $derived(typeof text === 'function' ? text() : text);
  let displayColor = $derived(typeof color === 'function' ? color() : color);
</script>

<span class="badge badge--{displayColor}">
  {displayText}
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.25rem;
    border-radius: 0.375rem;
    white-space: nowrap;
  }

  .badge--green {
    background-color: #dcfce7;
    color: #166534;
  }

  .badge--yellow {
    background-color: #fef9c3;
    color: #854d0e;
  }

  .badge--red {
    background-color: #fee2e2;
    color: #991b1b;
  }

  .badge--blue {
    background-color: #dbeafe;
    color: #1e40af;
  }

  .badge--gray {
    background-color: #f3f4f6;
    color: #374151;
  }

  .badge--gold {
    background-color: #fef3c7;
    color: #92400e;
  }
</style>
