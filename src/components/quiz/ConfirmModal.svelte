<script lang="ts">
  import Button from '../ui/Button.svelte';
  import Sheet from '../ui/Sheet.svelte';

  /**
   * Hoja de confirmación por preguntas en blanco (`02 §RF-17`, `05 §5.5`,
   * `07 §7.9.11`): solo se abre desde «Ver resultados» cuando hay blancos.
   * Título con singular/plural correcto, detalle «RM: a · RV: b» (solo áreas
   * activas) y dos acciones: «Volver a revisar» (secundaria, cierra la hoja) y
   * «Ver resultados igualmente» (primaria con el acento del área en curso, que
   * hereda del contenedor del quiz).
   */
  interface Props {
    /** Visibilidad de la hoja (`bind:open`). */
    open?: boolean;
    /** Preguntas sin responder en todo el intento (`02 §RF-17`). */
    blancos: number;
    /** Detalle por área activa, p. ej. «RM: 2 · RV: 1» (`07 §7.11`). */
    detalle: string;
    /** Confirma y pasa a resultados (`02 §RF-17`, `§RF-19`). */
    onConfirmar: () => void;
  }

  let { open = $bindable(false), blancos, detalle, onConfirmar }: Props = $props();

  const titulo = $derived(
    blancos === 1 ? 'Tienes 1 pregunta sin responder' : `Tienes ${blancos} preguntas sin responder`,
  );
</script>

<Sheet bind:open title={titulo}>
  <p class="detalle tnum">{detalle}</p>

  {#snippet actions()}
    <Button variant="secundario" onclick={() => (open = false)}>Volver a revisar</Button>
    <Button variant="primario" onclick={onConfirmar}>Ver resultados igualmente</Button>
  {/snippet}
</Sheet>

<style>
  /* Detalle `body` `ink-2` (`07 §7.9.11`) */
  .detalle {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: var(--color-ink-2);
  }
</style>
