<script lang="ts">
  import Icon, { type IconName } from '../ui/Icon.svelte';
  import ReviewOption from './ReviewOption.svelte';
  import { opcionesRevisadas } from '../../lib/review';
  import { clasificarRespuesta, type ClasificacionRespuesta } from '../../lib/scoring';
  import type { Letra, Pregunta } from '../../lib/types';

  /**
   * Pregunta de la revisión (`02 §RF-22`): acordeón nativo que resume el estado
   * y la clave, y despliega las alternativas marcadas más la explicación. Es
   * solo lectura: no hay radios ni se puede cambiar la respuesta.
   */
  interface Props {
    pregunta: Pregunta;
    /** Letra que marcó el usuario o `null` si dejó la pregunta en blanco. */
    respuesta: Letra | null;
  }

  let { pregunta, respuesta }: Props = $props();

  const ESTADOS: Record<ClasificacionRespuesta, { etiqueta: string; icono: IconName }> = {
    correcta: { etiqueta: 'Correcta', icono: 'check' },
    incorrecta: { etiqueta: 'Incorrecta', icono: 'x' },
    noRespondida: { etiqueta: 'No respondida', icono: 'minus' },
  };

  const estado = $derived(clasificarRespuesta(pregunta, respuesta));
  const opciones = $derived(opcionesRevisadas(pregunta, respuesta));

  /** Línea de contexto visible aun con el acordeón cerrado. */
  const detalle = $derived.by(() => {
    if (estado === 'incorrecta') {
      return `Tu respuesta: ${respuesta ?? '—'} · Correcta: ${pregunta.correcta}`;
    }
    return `Correcta: ${pregunta.correcta}`;
  });
</script>

<details class="rev" data-estado={estado}>
  <summary class="rev__resumen">
    <span class="rev__estado" data-estado={estado}>
      <Icon name={ESTADOS[estado].icono} size={16} />
      {ESTADOS[estado].etiqueta}
    </span>

    <span class="rev__texto">
      <span class="rev__num">Pregunta {pregunta.numero}</span>
      <span class="rev__enunciado">{pregunta.enunciado}</span>
      <span class="rev__detalle tnum">{detalle}</span>
    </span>

    <span class="rev__chevron" aria-hidden="true">
      <Icon name="chevron-down" size={20} />
    </span>
  </summary>

  <div class="rev__cuerpo">
    <ul class="rev__opciones" role="list">
      {#each opciones as opcion (opcion.letra)}
        <ReviewOption {opcion} />
      {/each}
    </ul>

    {#if estado === 'noRespondida'}
      <p class="rev__blanco">No marcaste ninguna alternativa.</p>
    {/if}

    <div class="rev__explicacion">
      <p class="rev__explicacion-titulo">Explicación</p>
      <p class="rev__explicacion-texto">{pregunta.explicacion}</p>
    </div>
  </div>
</details>

<style>
  .rev {
    border: 1px solid var(--color-line);
    border-radius: var(--radius-card);
    background: var(--color-surface);
  }

  .rev[open] {
    border-color: var(--color-line-strong);
  }

  .rev__resumen {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-areas:
      'estado . chevron'
      'texto texto texto';
    gap: 8px 12px;
    align-items: start;
    min-height: 44px;
    padding: 14px 16px;
    border-radius: calc(var(--radius-card) - 1px);
    cursor: pointer;
    list-style: none;
    -webkit-tap-highlight-color: transparent;
    transition: background-color var(--dur-2) var(--ease-out);
  }

  /* Sin marcador nativo: el chevron comunica el estado abierto/cerrado */
  .rev__resumen::-webkit-details-marker {
    display: none;
  }

  .rev__estado {
    display: inline-flex;
    grid-area: estado;
    align-items: center;
    gap: 4px;
    width: max-content;
    max-width: 100%;
    padding: 2px 8px;
    border-radius: var(--radius-pill);
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1.35;
  }

  .rev__estado[data-estado='correcta'] {
    background: var(--color-ok-soft);
    color: var(--color-ok);
  }

  .rev__estado[data-estado='incorrecta'] {
    background: var(--color-bad-soft);
    color: var(--color-bad);
  }

  /* `ink-2` sobre `surface-2` da 6.92:1; `neutral` sobre `surface-2` se queda
     en 4.34:1 y no cumple AA para texto (`07 §7.9.16`). */
  .rev__estado[data-estado='noRespondida'] {
    background: var(--color-surface-2);
    color: var(--color-ink-2);
  }

  .rev__texto {
    display: flex;
    grid-area: texto;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .rev__num {
    font-size: 0.8125rem;
    font-weight: 600;
    line-height: 1.4;
    color: var(--color-ink-3);
  }

  .rev__enunciado {
    font-size: 1.0625rem;
    font-weight: 500;
    line-height: 1.55;
    color: var(--color-ink);
    overflow-wrap: break-word;
    text-wrap: pretty;
  }

  .rev__detalle {
    margin-top: 2px;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.4;
    color: var(--color-ink-2);
  }

  .rev__chevron {
    display: grid;
    grid-area: chevron;
    place-items: center;
    width: 24px;
    height: 24px;
    color: var(--color-ink-3);
    transition: transform var(--dur-3) var(--ease-out);
  }

  .rev[open] .rev__chevron {
    transform: rotate(180deg);
  }

  .rev__cuerpo {
    padding: 14px 16px 16px;
    border-top: 1px solid var(--color-line);
  }

  .rev__opciones {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .rev__blanco {
    margin-top: 10px;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.4;
    color: var(--color-ink-3);
  }

  .rev__explicacion {
    margin-top: 14px;
    padding: 12px 14px;
    border: 1px solid var(--color-line);
    border-radius: var(--radius-control);
    background: var(--color-surface-2);
  }

  .rev__explicacion-titulo {
    font-size: 0.8125rem;
    font-weight: 600;
    line-height: 1.4;
    color: var(--color-ink-3);
  }

  .rev__explicacion-texto {
    margin-top: 4px;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.6;
    color: var(--color-ink);
    overflow-wrap: break-word;
    text-wrap: pretty;
  }

  /* Hover solo con puntero fino (`07 §7.5.4`) */
  @media (hover: hover) and (pointer: fine) {
    .rev__resumen:hover {
      background: var(--color-surface-2);
    }
  }

  .rev__resumen:active {
    background: var(--color-surface-2);
  }

  /* El foco va al summary completo, no a elementos internos */
  .rev__resumen:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .rev__resumen,
    .rev__chevron {
      transition: none;
    }
  }
</style>
