<script lang="ts">
  import type { Snippet } from 'svelte';

  /**
   * Tooltip de `07 §7.9.15`: mejora progresiva **solo** de escritorio.
   * Aparece a los 300 ms de hover o de foco (`(hover: hover) and (pointer: fine)`),
   * se va con un fundido de 120 ms y es `aria-hidden`: el nombre accesible vive
   * en el disparador (su `aria-label`). En táctil no existe y **nada depende de
   * él** (`07 §7.5.4`, RNF-01).
   */
  interface Props {
    label: string;
    children: Snippet;
  }

  let { label, children }: Props = $props();

  let visible = $state(false);
  let temporizador: ReturnType<typeof setTimeout> | undefined;

  function puedeHover(): boolean {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }

  function mostrar() {
    if (!puedeHover()) return;
    clearTimeout(temporizador);
    temporizador = setTimeout(() => (visible = true), 300);
  }

  function ocultar() {
    clearTimeout(temporizador);
    visible = false;
  }
</script>

<span
  class="tt"
  role="presentation"
  onpointerenter={mostrar}
  onpointerleave={ocultar}
  onfocusin={mostrar}
  onfocusout={ocultar}
>
  {@render children()}
  <span class="tt__chip" class:show={visible} aria-hidden="true">{label}</span>
</span>

<style>
  .tt {
    position: relative;
    display: inline-flex;
  }

  .tt__chip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    z-index: var(--z-tooltip);
    max-width: 240px;
    padding: 6px 10px;
    border-radius: 8px;
    background: var(--color-ink);
    color: #fff;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.4;
    white-space: nowrap;
    opacity: 0;
    transition: opacity var(--dur-2) var(--ease-out);
    pointer-events: none;
  }

  .tt__chip.show {
    opacity: 1;
  }

  /* En táctil no existe la superficie del tooltip (`07 §7.9.15`) */
  @media not ((hover: hover) and (pointer: fine)) {
    .tt__chip {
      display: none;
    }
  }
</style>
