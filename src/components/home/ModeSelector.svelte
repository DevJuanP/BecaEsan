<script lang="ts">
  import type { Modo } from '../../lib/types';

  /**
   * Selector de modo (`02 §RF-03`, `07 §7.9.2`): control segmentado dentro de su
   * tarjeta, con **radios nativos** ocultos y `labels` (las flechas del teclado
   * y la semántica de grupo salen gratis). Las etiquetas visibles son cortas
   * («Matemático» · «Verbal» · «Completo») y el `aria-label` de cada radio lleva
   * el nombre completo del deck (`07 §7.11`).
   */
  interface Props {
    /** Modo seleccionado (`bind:modo`); por defecto «Completo» (RF-03). */
    modo?: Modo;
  }

  let { modo = $bindable<Modo>('completo') }: Props = $props();

  const idTitulo = $props.id();

  const OPCIONES: readonly { valor: Modo; etiqueta: string; ariaLabel: string }[] = [
    { valor: 'solo-rm', etiqueta: 'Matemático', ariaLabel: 'Solo Razonamiento Matemático' },
    { valor: 'solo-rv', etiqueta: 'Verbal', ariaLabel: 'Solo Razonamiento Verbal' },
    { valor: 'completo', etiqueta: 'Completo', ariaLabel: 'Completo' },
  ];
</script>

<section class="tarjeta">
  <h2 class="tarjeta__titulo" id={idTitulo}>Modo del quiz</h2>

  <div class="modo" role="radiogroup" aria-labelledby={idTitulo}>
    {#each OPCIONES as opcion (opcion.valor)}
      <label class="modo__opcion" class:is-selected={modo === opcion.valor}>
        <input
          class="modo__radio"
          type="radio"
          name={idTitulo}
          bind:group={modo}
          value={opcion.valor}
          aria-label={opcion.ariaLabel}
        />
        <span class="modo__texto">{opcion.etiqueta}</span>
      </label>
    {/each}
  </div>
</section>

<style>
  .modo {
    display: flex;
    gap: 4px;
    margin-top: 12px;
    padding: 4px;
    border-radius: var(--radius-control);
    background: var(--color-surface-2);
  }

  .modo__opcion {
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    min-width: 0;
    min-height: 44px;
    padding: 4px 0;
    border-radius: 10px;
    color: var(--color-ink-2);
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.4;
    text-align: center;
    /* Con texto del sistema al 200 % la etiqueta se ajusta en vez de desbordar
       (`07 §7.12` (10)); a tamaño normal la opción mide los 44 px de `§7.9.2`. */
    overflow-wrap: break-word;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition:
      background-color var(--dur-2) var(--ease-out),
      color var(--dur-2) var(--ease-out),
      transform 100ms var(--ease-out);
  }

  /* Seleccionada: superficie + tinta plena + peso 600 + micro-sombra pop
     (`07 §7.9.2`); nunca solo color (peso y elevación acompañan). */
  .modo__opcion.is-selected {
    background: var(--color-surface);
    color: var(--color-ink);
    font-weight: 600;
    box-shadow: var(--shadow-pop);
  }

  .modo__opcion:active {
    background: var(--color-surface);
    transform: scale(0.98);
  }

  /* Radio nativo oculto: conserva foco, teclado y semántica de grupo */
  .modo__radio {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
    pointer-events: none;
  }

  .modo__opcion:has(.modo__radio:focus-visible) {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }

  /* La etiqueta puede encogerse y partirse con texto grande (`07 §7.12` (10)) */
  .modo__texto {
    min-width: 0;
    overflow-wrap: break-word;
  }

  /* `reduced-motion`: el pressed no escala (`07 §7.7.4`) */
  @media (prefers-reduced-motion: reduce) {
    .modo__opcion {
      transition:
        background-color var(--dur-2) var(--ease-out),
        color var(--dur-2) var(--ease-out);
    }

    .modo__opcion:active {
      transform: none;
    }
  }
</style>
