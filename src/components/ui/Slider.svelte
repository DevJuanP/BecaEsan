<script lang="ts">
  import { indiceDesdeX } from '../../lib/slider';

  /**
   * Slider segmentado — el componente firma (`07 §7.8` + Anexo B `§7.18`).
   * Cada valor posible es una marca de la regla; el control real es un
   * `<input type="range">` invisible (teclado, lector de pantalla y semántica
   * nativa gratis) y el gesto se resuelve con Pointer Events: arrastre 1:1,
   * tap para saltar y captura de puntero. Sin GSAP ni dependencias.
   */
  interface Props {
    /** Etiqueta visible; es también el nombre accesible del control. */
    label: string;
    /** Valor actual, entero dentro de 1..max (`bind:value`). */
    value?: number;
    /** Número de segmentos (máximo del rango). */
    max: number;
    /** Unidad de `aria-valuetext` (`07 §7.8.6`): «temas» / «preguntas». */
    unidad: string;
    /** Acento del relleno (`07 §7.8.1`): azul por defecto, naranja en RV. */
    area?: 'matematico' | 'verbal';
    /** Nota bajo los extremos (p. ej. «Al azar, sin repetirse»). */
    caption?: string;
    disabled?: boolean;
  }

  let {
    label,
    value = $bindable(1),
    max,
    unidad,
    area = undefined,
    caption = undefined,
    disabled = false,
  }: Props = $props();

  let trackEl = $state<HTMLDivElement | null>(null);
  let arrastrando = $state(false);
  let burbujaVisible = $state(false);
  let enfocado = $state(false);
  let valorPrevio = 1;
  let temporizador: ReturnType<typeof setTimeout> | undefined;

  /** Valor efectivo: entero y dentro de 1..max. */
  const valor = $derived(
    Math.min(max, Math.max(1, Math.round(Number.isFinite(value) ? value : 1))),
  );
  /** Separación entre segmentos: 4 px con ≥12, 6 px con ≤11 (`07 §7.8.2`). */
  const denso = $derived(max >= 12);
  /** Centro del segmento activo, en % del ancho del track. */
  const burbujaX = $derived(`${((valor - 0.5) / max) * 100}%`);

  function mostrarBurbuja() {
    clearTimeout(temporizador);
    burbujaVisible = true;
  }

  /** La burbuja se desvanece 400 ms después de soltar o al salir del foco (`07 §7.8.5`). */
  function ocultarBurbuja(ms = 400) {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => {
      if (!arrastrando && !enfocado) burbujaVisible = false;
    }, ms);
  }

  function actualizarDesdeX(x: number) {
    const rect = trackEl?.getBoundingClientRect();
    if (!rect) return;
    value = indiceDesdeX(x, rect, max) + 1;
  }

  function alPunteroAbajo(evento: PointerEvent) {
    if (disabled || evento.button !== 0) return;
    arrastrando = true;
    valorPrevio = valor;
    mostrarBurbuja();
    // Manipulación directa (`07 §7.7.1`): el track se queda con el puntero
    // aunque el gesto salga de su caja. Si el navegador ya soltó el puntero,
    // el gesto sigue funcionando (sin captura).
    try {
      (evento.currentTarget as HTMLElement).setPointerCapture(evento.pointerId);
    } catch {
      /* puntero no activo: sin captura */
    }
    actualizarDesdeX(evento.clientX);
  }

  function alPunteroMover(evento: PointerEvent) {
    if (!arrastrando) return;
    actualizarDesdeX(evento.clientX);
  }

  function alPunteroSoltar() {
    if (!arrastrando) return;
    arrastrando = false;
    ocultarBurbuja();
  }

  /** `pointercancel` o `Escape` a mitad de gesto: revierte al valor previo (`07 §7.8.4`). */
  function cancelarGesto() {
    if (!arrastrando) return;
    value = valorPrevio;
    arrastrando = false;
    ocultarBurbuja();
  }

  function alTeclaGlobal(evento: KeyboardEvent) {
    if (evento.key === 'Escape' && arrastrando) {
      evento.preventDefault();
      cancelarGesto();
    }
  }

  function alEnfocar() {
    enfocado = true;
    mostrarBurbuja();
  }

  function alPerderFoco() {
    enfocado = false;
    ocultarBurbuja();
  }
</script>

<svelte:window onkeydown={alTeclaGlobal} />

<div class="slider" data-area={area} class:is-disabled={disabled}>
  <div class="slider__head">
    <span class="slider__label">{label}</span>
    <span class="slider__value tnum">{valor} de {max}</span>
  </div>

  <div
    class="slider__track"
    class:is-dense={denso}
    class:is-dragging={arrastrando}
    style:--bubble-x={burbujaX}
    bind:this={trackEl}
    role="presentation"
    onpointerdown={alPunteroAbajo}
    onpointermove={alPunteroMover}
    onpointerup={alPunteroSoltar}
    onpointercancel={cancelarGesto}
  >
    <span class="bubble tnum" class:show={burbujaVisible} aria-hidden="true">{valor}</span>

    {#each Array.from({ length: max }, (_, i) => i + 1) as n (n)}
      <span class="seg" class:on={n <= valor}></span>
    {/each}

    <!-- Control real (`07 §7.8.6`): invisible, sin puntero propio (el gesto lo
         resuelve el track) y con toda la semántica nativa. Rueda del ratón
         ignorada: no hay listener y el rango nativo no responde a la rueda. -->
    <input
      class="slider__input"
      type="range"
      min="1"
      {max}
      step="1"
      bind:value
      aria-label={label}
      aria-valuetext={`${valor} de ${max} ${unidad}`}
      aria-disabled={disabled ? 'true' : undefined}
      tabindex={disabled ? -1 : undefined}
      onfocus={alEnfocar}
      onblur={alPerderFoco}
    />
  </div>

  <div class="slider__ends" aria-hidden="true">
    <span>1</span>
    <span>{max}</span>
  </div>

  {#if caption}
    <p class="slider__caption">{caption}</p>
  {/if}
</div>

<style>
  /* Acento del relleno (`07 §7.8.1`, Anexo B) */
  .slider {
    --accent: var(--color-blue-600);
    --accent-strong: var(--color-blue-700);
  }

  .slider[data-area='verbal'] {
    --accent: var(--color-orange-600);
    --accent-strong: var(--color-orange-700);
  }

  .slider__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
    font-size: 0.9375rem;
    line-height: 1.4;
  }

  .slider__label {
    color: var(--color-ink-2);
    font-weight: 500;
  }

  .slider__value {
    color: var(--color-ink);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  /* Zona táctil completa = 44 px. El margen superior reserva la burbuja
     (28 px) por encima del track: así nunca tapa la etiqueta y el aire
     restante es el de `07 §7.8.2` (8 px hasta el borde de esa zona). */
  .slider__track {
    position: relative;
    display: flex;
    align-items: center;
    gap: 6px;
    height: 44px;
    margin-top: 18px;
    touch-action: pan-y;
  }

  /* El arrastre no debe seleccionar texto (web-interface-guidelines) */
  .slider {
    -webkit-user-select: none;
    user-select: none;
  }

  .slider__track.is-dense {
    gap: 4px;
  }

  .seg {
    flex: 1;
    height: 22px;
    border-radius: var(--radius-segment);
    background: var(--color-segment-empty);
    transition: background-color var(--dur-1) var(--ease-out);
  }

  .seg.on {
    background: var(--accent);
  }

  /* Durante el gesto no hay transición: el relleno sigue al dedo 1:1 */
  .slider__track.is-dragging .seg {
    transition: none;
  }

  @media (hover: hover) and (pointer: fine) {
    .slider__track:not(.is-dragging) {
      cursor: pointer;
    }

    .slider__track:not(.is-dragging):hover .seg:not(.on) {
      background: var(--color-line-strong);
    }

    .slider__track:not(.is-dragging):hover .seg.on {
      background: var(--accent-strong);
    }

    .slider__track.is-dragging {
      cursor: grabbing;
    }
  }

  /* Control accesible real: invisible y superpuesto a todo el track */
  .slider__input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 44px;
    margin: 0;
    opacity: 0;
    pointer-events: none;
  }

  .slider__track:has(input:focus-visible) {
    outline: 2px solid var(--color-focus);
    outline-offset: 4px;
    border-radius: 10px;
  }

  .bubble {
    position: absolute;
    bottom: 34px;
    left: clamp(20px, var(--bubble-x), calc(100% - 20px));
    transform: translateX(-50%);
    display: grid;
    place-items: center;
    height: 28px;
    padding: 0 10px;
    border-radius: var(--radius-pill);
    background: var(--accent-strong);
    color: #fff;
    font-size: 0.8125rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    opacity: 0;
    transition: opacity var(--dur-2) var(--ease-out);
    pointer-events: none;
  }

  .bubble.show {
    opacity: 1;
  }

  .slider__track.is-dragging .bubble {
    transition: none;
  }

  .slider__ends {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
    font-size: 0.75rem;
    line-height: 1.35;
    letter-spacing: 0.01em;
    color: var(--color-ink-3);
  }

  .slider__caption {
    margin-top: 6px;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.4;
    color: var(--color-ink-3);
  }

  .slider.is-disabled .slider__track {
    opacity: 0.45;
    pointer-events: none;
  }
</style>
