<script lang="ts">
  import type { Snippet } from 'svelte';
  import Button from './Button.svelte';

  /**
   * Hoja modal de `07 §7.9.11`: *bottom-sheet* en móvil y diálogo centrado en
   * ≥768 px. Usa `<dialog>` nativo con `showModal()`: foco atrapado, `Escape`
   * para cancelar y restauración del foco al disparador. Añade scrim, bloqueo
   * del scroll de fondo, drag-to-dismiss desde el asa y las animaciones de
   * `07 §7.7.3` (entrada 340 ms `--ease-sheet`, cierre 240 ms).
   *
   * Las acciones se apilan en móvil (primaria al final) y en ≥768 px van en
   * fila alineadas a la derecha.
   */
  interface Props {
    /** Visibilidad (`bind:open`). */
    open?: boolean;
    /** Título visible; es el nombre accesible del diálogo. */
    title: string;
    /** X de cierre arriba a la derecha (hoja de nombre). */
    showClose?: boolean;
    children: Snippet;
    actions?: Snippet;
  }

  let {
    open = $bindable(false),
    title,
    showClose = false,
    children,
    actions = undefined,
  }: Props = $props();

  const idTitulo = $props.id();

  let dialogo = $state<HTMLDialogElement | null>(null);
  /** Desplazamiento del drag (px) mientras se arrastra el asa. */
  let desplazamiento = $state(0);
  let arrastrando = $state(false);
  let cerrando = $state(false);
  let overflowPrevio = '';
  let desdeY = 0;
  let ultimoY = 0;
  let ultimoT = 0;
  let velocidad = 0;
  let temporizadorCierre: ReturnType<typeof setTimeout> | undefined;

  const UMBRAL_PX = 96;
  const UMBRAL_VELOCIDAD = 0.5; // px/ms

  function bloquearScroll(bloquear: boolean) {
    const raiz = document.documentElement;
    if (bloquear) {
      overflowPrevio = raiz.style.overflow;
      raiz.style.overflow = 'hidden';
    } else {
      raiz.style.overflow = overflowPrevio;
    }
  }

  function salirConAnimacion() {
    const elemento = dialogo;
    if (!elemento || cerrando) return;
    cerrando = true;
    temporizadorCierre = setTimeout(() => {
      elemento.classList.remove('is-closing');
      elemento.close();
      cerrando = false;
      desplazamiento = 0;
      bloquearScroll(false);
    }, 240);
  }

  /** Pide el cierre (Escape, scrim, X, drag): el estado manda y el efecto anima. */
  function pedirCierre() {
    open = false;
  }

  /**
   * Sincroniza el estado `open` con la API imperativa de `<dialog>` (escape
   * hatch documentado de Svelte 5: efectos para hablar con el DOM externo).
   * `showModal()` aporta foco atrapado, `Escape` y restauración del foco.
   */
  $effect(() => {
    const elemento = dialogo;
    if (!elemento) return;
    if (open) {
      if (!elemento.open) {
        clearTimeout(temporizadorCierre);
        cerrando = false;
        elemento.showModal();
        bloquearScroll(true);
      }
    } else if (elemento.open && !cerrando) {
      salirConAnimacion();
    }
  });

  function alPunteroAbajo(evento: PointerEvent) {
    if (evento.button !== 0) return;
    arrastrando = true;
    desdeY = evento.clientY;
    ultimoY = evento.clientY;
    ultimoT = performance.now();
    velocidad = 0;
    try {
      (evento.currentTarget as HTMLElement).setPointerCapture(evento.pointerId);
    } catch {
      /* puntero no activo: sin captura */
    }
  }

  function alPunteroMover(evento: PointerEvent) {
    if (!arrastrando) return;
    const ahora = performance.now();
    const deltaT = ahora - ultimoT;
    if (deltaT > 0) velocidad = (evento.clientY - ultimoY) / deltaT;
    ultimoY = evento.clientY;
    ultimoT = ahora;
    const recorrido = Math.max(0, evento.clientY - desdeY);
    // Resistencia tipo rubber-band a partir del umbral
    desplazamiento =
      recorrido <= UMBRAL_PX
        ? recorrido
        : UMBRAL_PX + (recorrido - UMBRAL_PX) * 0.35;
  }

  function alPunteroSoltar() {
    if (!arrastrando) return;
    arrastrando = false;
    const recorrido = Math.max(0, ultimoY - desdeY);
    if (recorrido > UMBRAL_PX || velocidad > UMBRAL_VELOCIDAD) {
      // El cierre continúa desde donde quedó el gesto
      dialogo?.style.setProperty('--sheet-from', `${desplazamiento}px`);
      desplazamiento = 0;
      pedirCierre();
    } else {
      desplazamiento = 0;
    }
  }

  function alPunteroCancelar() {
    if (!arrastrando) return;
    arrastrando = false;
    desplazamiento = 0;
  }

  /**
   * Trampa de foco explícita: `showModal()` encierra el foco en el diálogo,
   * pero `Tab` desde el último control salta a la interfaz del navegador. Aquí
   * el recorrido se cierra sobre el propio diálogo (`07 §7.12.5`).
   */
  function alTecla(evento: KeyboardEvent) {
    if (evento.key !== 'Tab' || !dialogo) return;
    const enfocables = [
      ...dialogo.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ].filter((elemento) => !elemento.hasAttribute('disabled') && elemento.offsetParent !== null);
    if (enfocables.length === 0) return;
    const primero = enfocables[0];
    const ultimo = enfocables[enfocables.length - 1];
    const activo = document.activeElement;
    if (!evento.shiftKey && activo === ultimo) {
      evento.preventDefault();
      primero.focus();
    } else if (evento.shiftKey && activo === primero) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!dialogo.contains(activo)) {
      evento.preventDefault();
      primero.focus();
    }
  }
</script>

<dialog
  class="dialogo"
  class:is-dragging={arrastrando}
  class:is-closing={cerrando}
  style:--sheet-drag="{desplazamiento}px"
  bind:this={dialogo}
  aria-modal="true"
  aria-labelledby={idTitulo}
  onkeydown={alTecla}
  oncancel={(evento) => {
    evento.preventDefault();
    pedirCierre();
  }}
  onclose={() => {
    open = false;
    bloquearScroll(false);
  }}
  onclick={(evento) => {
    // Clic en el scrim: el objetivo es el propio diálogo
    if (evento.target === dialogo) pedirCierre();
  }}
>
  <div
    class="asa"
    role="presentation"
    onpointerdown={alPunteroAbajo}
    onpointermove={alPunteroMover}
    onpointerup={alPunteroSoltar}
    onpointercancel={alPunteroCancelar}
  >
    <span class="asa__barra"></span>
  </div>

  <div class="contenido">
    <header class="cabecera">
      <h2 class="titulo" id={idTitulo}>{title}</h2>
      {#if showClose}
        <Button variant="icono" icon="x" ariaLabel="Cerrar" onclick={pedirCierre} />
      {/if}
    </header>

    <div class="cuerpo">
      {@render children()}
    </div>

    {#if actions}
      <div class="acciones">
        {@render actions()}
      </div>
    {/if}
  </div>
</dialog>

<style>
  .dialogo {
    position: fixed;
    inset: auto 0 0 0;
    width: 100%;
    max-width: none;
    max-height: 90dvh;
    margin: 0;
    padding: 0;
    border: 0;
    overflow: auto;
    overscroll-behavior: contain;
    border-radius: var(--radius-sheet-top) var(--radius-sheet-top) 0 0;
    background: var(--color-surface);
    color: var(--color-ink);
    box-shadow: var(--shadow-sheet);
    z-index: var(--z-sheet);
    transform: translateY(var(--sheet-drag, 0px));
    animation: hoja-entrar var(--dur-5) var(--ease-sheet);
  }

  /* Snap-back del drag (nunca durante el gesto) */
  .dialogo:not(.is-dragging) {
    transition: transform var(--dur-4) var(--ease-out);
  }

  .dialogo.is-dragging {
    transition: none;
  }

  .dialogo.is-closing {
    animation: hoja-salir 240ms var(--ease-out) forwards;
  }

  .dialogo::backdrop {
    background: var(--color-scrim);
    animation: scrim-entrar var(--dur-5) var(--ease-out);
  }

  .dialogo.is-closing::backdrop {
    animation: scrim-salir 240ms var(--ease-out) forwards;
  }

  .asa {
    display: grid;
    place-items: center;
    padding: 10px 0 6px;
    touch-action: none;
    cursor: grab;
  }

  .asa__barra {
    width: 36px;
    height: 4px;
    border-radius: 2px;
    background: var(--color-line-strong);
  }

  .contenido {
    padding: 8px 20px calc(20px + env(safe-area-inset-bottom));
  }

  .cabecera {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .titulo {
    padding-top: 6px;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  .cuerpo {
    margin-top: 16px;
  }

  .acciones {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 24px;
  }

  /* Escritorio (≥768 px): diálogo centrado de 400 px y acciones en fila */
  @media (min-width: 768px) {
    .dialogo {
      inset: 0;
      width: 400px;
      max-height: 80dvh;
      margin: auto;
      border-radius: var(--radius-card);
      animation-name: dialogo-entrar;
    }

    .dialogo.is-closing {
      animation-name: dialogo-salir;
    }

    .asa {
      display: none;
    }

    .contenido {
      padding: 24px;
    }

    .acciones {
      flex-direction: row;
      justify-content: flex-end;
    }
  }

  @keyframes hoja-entrar {
    from {
      transform: translateY(100%);
    }

    to {
      transform: translateY(0);
    }
  }

  @keyframes hoja-salir {
    from {
      transform: translateY(var(--sheet-from, 100%));
    }

    to {
      transform: translateY(100%);
    }
  }

  @keyframes scrim-entrar {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes scrim-salir {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }

  @keyframes dialogo-entrar {
    from {
      opacity: 0;
      transform: scale(0.98);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes dialogo-salir {
    from {
      opacity: 1;
      transform: scale(1);
    }

    to {
      opacity: 0;
      transform: scale(0.98);
    }
  }

  /* reduced-motion: la hoja aparece y desaparece con un fundido (`07 §7.7.4`) */
  @media (prefers-reduced-motion: reduce) {
    .dialogo {
      animation: fundido-entrar 150ms var(--ease-out);
    }

    .dialogo.is-closing {
      animation: fundido-salir 240ms var(--ease-out) forwards;
    }

    .dialogo:not(.is-dragging) {
      transition: none;
    }
  }

  @keyframes fundido-entrar {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes fundido-salir {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }
</style>
