<script lang="ts">
  import Icon from '../ui/Icon.svelte';

  /**
   * Panel de texto común (`02 §RF-13.2`, `07 §7.9.10`): el texto compartido del
   * tema (hoy solo Comprensión de lectura) se muestra **una vez**, entre el
   * título y la primera pregunta, en un `<details>` nativo **abierto por
   * defecto** — el `<summary>` es a la vez el encabezado y el toggle
   * («Ocultar texto» / «Mostrar texto»), con el estado expandido expuesto por
   * el propio elemento nativo (y reflejado en `aria-expanded`).
   *
   * E-06: se muestra igual con q < 5 (solo cambian las preguntas de debajo).
   */
  interface Props {
    /** Texto compartido del tema (`03 §3.2`); nunca `null` al montarse. */
    texto: string;
  }

  let { texto }: Props = $props();

  /** Párrafos del material (`03 §3.1`: saltos de línea internos) */
  const parrafos = $derived(
    texto
      .split(/\n{2,}/)
      .map((parrafo) => parrafo.trim())
      .filter((parrafo) => parrafo !== ''),
  );

  /** Estado del `<details>`, en sincronía con el toggle nativo. */
  let abierto = $state(true);

  function alAlternar(evento: Event & { currentTarget: HTMLDetailsElement }): void {
    abierto = evento.currentTarget.open;
  }
</script>

<details class="texto" open={abierto} ontoggle={alAlternar}>
  <summary class="texto__cabecera" aria-expanded={abierto}>
    <Icon name="text-align-left" size={20} />
    <span class="texto__titulo">Texto</span>
    <span class="texto__toggle">{abierto ? 'Ocultar texto' : 'Mostrar texto'}</span>
  </summary>

  <div class="texto__cuerpo">
    {#each parrafos as parrafo, indice (indice)}
      <p class="texto__parrafo">{parrafo}</p>
    {/each}
  </div>
</details>

<style>
  /* Contenedor de `07 §7.9.10`: `surface-2`, borde `line`, radio 16, padding 20 */
  .texto {
    margin: 24px 0;
    padding: 20px;
    border: 1px solid var(--color-line);
    border-radius: var(--radius-card);
    background: var(--color-surface-2);
  }

  /* Encabezado-toggle: fila de alto ≥44 con el icono, «Texto» y el toggle */
  .texto__cabecera {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    margin: -8px 0;
    padding: 0 8px;
    border-radius: var(--radius-control);
    color: var(--color-ink-3);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    list-style: none;
    transition: background-color var(--dur-2) var(--ease-out);
  }

  /* Sin marcador nativo del `<summary>` (el toggle visible es el texto) */
  .texto__cabecera::-webkit-details-marker {
    display: none;
  }

  .texto__titulo {
    font-size: 0.9375rem;
    font-weight: 600;
    line-height: 1.4;
    color: var(--color-ink-2);
  }

  /* Toggle fantasma (`07 §7.9.4`): sin fondo, texto `ink-2` 600 */
  .texto__toggle {
    margin-left: auto;
    font-size: 0.9375rem;
    font-weight: 600;
    line-height: 1.4;
    color: var(--color-ink-2);
  }

  /* Hover/pressed solo con puntero fino (`07 §7.5.4`): un paso más oscuro que
     el `surface-2` del panel (el token `line`), para que el cambio se vea */
  @media (hover: hover) and (pointer: fine) {
    .texto__cabecera:hover {
      background: var(--color-line);
    }
  }

  .texto__cabecera:active {
    background: var(--color-line);
  }

  /* Cuerpo: `statement` 17/400, interlineado 1.6, medida ≤75ch (`07 §7.9.10`) */
  .texto__cuerpo {
    max-width: 75ch;
    margin-top: 16px;
  }

  .texto__parrafo {
    font-size: 1.0625rem;
    font-weight: 400;
    line-height: 1.6;
    color: var(--color-ink);
    text-wrap: pretty;
  }

  .texto__parrafo + .texto__parrafo {
    margin-top: 12px;
  }
</style>
