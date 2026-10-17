<script lang="ts">
  import BottomBar from '../ui/BottomBar.svelte';
  import Button from '../ui/Button.svelte';

  /**
   * Botonera fija del quiz (`02 §RF-15`, `05 §5.4`, `07 §7.9.6`, `§7.10.2`):
   * primer bloque → solo [Continuar] (ancho disponible); intermedios →
   * [Atrás] [Continuar]; último → [Atrás] [Ver resultados].
   *
   * Las acciones viven en la barra inferior (zona del pulgar) y el primario
   * crece 2 frente al secundario (`07 §7.9.4`).
   */
  interface Props {
    /** Bloque visible, 0-based (`03 §3.3`). */
    indice: number;
    /** Total de bloques del intento. */
    total: number;
    onAtras: () => void;
    onContinuar: () => void;
    onVerResultados: () => void;
  }

  let { indice, total, onAtras, onContinuar, onVerResultados }: Props = $props();

  const esPrimero = $derived(indice === 0);
  const esUltimo = $derived(indice === total - 1);
</script>

<BottomBar>
  {#if !esPrimero}
    <Button variant="secundario" size="bar" icon="chevron-left" iconPos="start" onclick={onAtras}>
      Atrás
    </Button>
  {/if}

  {#if esUltimo}
    <Button size="bar" icon="arrow-right" onclick={onVerResultados}>Ver resultados</Button>
  {:else}
    <Button size="bar" icon="arrow-right" onclick={onContinuar}>Continuar</Button>
  {/if}
</BottomBar>
