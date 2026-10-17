<script lang="ts">
  /**
   * Fila de alternativa A–E (`07 §7.9.7`, RF-14): radio nativo oculto + burbuja
   * con la letra + texto. La selección se marca con forma + color + peso (nunca
   * solo color) y **sin** feedback de corrección. El `<fieldset>`/`<legend>` del
   * grupo los aporta la pantalla (`05 §5.4`, Plan 06).
   */
  interface Props {
    /** `name` del grupo de radios (la pregunta, `pregunta.id`). */
    name: string;
    /** Valor de la alternativa (su identificador). */
    value: string;
    /** Letra visible de la burbuja: A–E. */
    letter: string;
    text: string;
    selected?: boolean;
    onselect?: () => void;
  }

  let {
    name,
    value,
    letter,
    text,
    selected = false,
    onselect = undefined,
  }: Props = $props();
</script>

<label class="opt" class:is-selected={selected}>
  <input
    class="opt__radio"
    type="radio"
    {name}
    {value}
    checked={selected}
    onchange={() => onselect?.()}
  />
  <span class="opt__bubble" aria-hidden="true">{letter}</span>
  <span class="opt__text">{text}</span>
</label>

<style>
  .opt {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 56px;
    padding: 12px 14px;
    border: 1px solid var(--color-line);
    border-radius: var(--radius-control);
    background: var(--color-surface);
    font-size: 1rem;
    line-height: 1.5;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition:
      background-color var(--dur-2) var(--ease-out),
      border-color var(--dur-2) var(--ease-out),
      box-shadow var(--dur-2) var(--ease-out);
  }

  /* Radio nativo oculto pero presente: foco, teclado y lectores gratis */
  .opt__radio {
    position: absolute;
    top: 50%;
    left: 14px;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
    pointer-events: none;
    /* Al enfocar con teclado, la fila no queda bajo la cabecera sticky del
       quiz (hasta 95 px) ni bajo otras barras fijas (`07 §7.14`). Solo afecta
       al desplazamiento automático del foco, no al scroll manual. */
    scroll-margin-top: 104px;
  }

  .opt__bubble {
    display: grid;
    place-items: center;
    flex: none;
    width: 28px;
    height: 28px;
    border: 1.5px solid var(--color-line-strong);
    border-radius: 50%;
    color: var(--color-ink-2);
    font-size: 0.8125rem;
    font-weight: 600;
    line-height: 1;
    transition:
      background-color var(--dur-2) var(--ease-out),
      border-color var(--dur-2) var(--ease-out),
      color var(--dur-2) var(--ease-out);
  }

  .opt__text {
    min-width: 0;
  }

  /* Selección: relleno + anillo interior (sin cambio de grosor de borde, `07 §7.5.2`) */
  .opt.is-selected {
    border-color: var(--accent, var(--color-blue-600));
    background: var(--accent-soft, var(--color-blue-50));
    box-shadow: inset 0 0 0 1px var(--accent, var(--color-blue-600));
  }

  .opt.is-selected .opt__text {
    font-weight: 600;
  }

  .opt.is-selected .opt__bubble {
    border-color: var(--accent, var(--color-blue-600));
    background: var(--accent, var(--color-blue-600));
    color: #fff;
    animation: burbuja var(--dur-2) var(--ease-out);
  }

  @keyframes burbuja {
    from {
      transform: scale(0.92);
    }

    to {
      transform: scale(1);
    }
  }

  .opt:active {
    background: var(--color-surface-2);
  }

  .opt:has(input:focus-visible) {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }

  /* El anillo va en la fila, nunca en el radio oculto (`07 §7.12.2`) */
  .opt__radio:focus-visible {
    outline: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .opt.is-selected .opt__bubble {
      animation: none;
    }
  }
</style>
