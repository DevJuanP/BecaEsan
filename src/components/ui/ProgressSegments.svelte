<script lang="ts">
  /**
   * Progreso de bloques de `07 §7.9.9`: N segmentos (uno por bloque del
   * intento), alto 4, radio 2, gap 3. El bloque actual sube a 6 px.
   * `aria-hidden`: la información la comunica «Bloque X de Y» (redundancia
   * visual a propósito).
   */
  interface Props {
    /** Total de bloques del intento. */
    total: number;
    /** Bloque actual (1..total). */
    current: number;
  }

  let { total, current }: Props = $props();

  let segmentos = $derived(Array.from({ length: Math.max(0, total) }, (_, i) => i + 1));
</script>

<div class="prog" aria-hidden="true">
  {#each segmentos as n (n)}
    <span class="prog__seg" class:done={n < current} class:now={n === current}></span>
  {/each}
</div>

<style>
  .prog {
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .prog__seg {
    flex: 1;
    height: 4px;
    border-radius: 2px;
    background: var(--color-line);
    transition: background-color var(--dur-2) var(--ease-out);
  }

  .prog__seg.done,
  .prog__seg.now {
    background: var(--accent, var(--color-blue-600));
  }

  /* Bloque actual: micro-elevación (sin transición de alto: `07 §7.7.2`) */
  .prog__seg.now {
    height: 6px;
  }
</style>
