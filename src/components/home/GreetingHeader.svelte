<script lang="ts">
  import Icon from '../ui/Icon.svelte';
  import Tooltip from '../ui/Tooltip.svelte';

  /**
   * Encabezado de Home (`07 §7.9.1`, RF-01.1 y RF-01.2): el `h1` de la pantalla
   * envuelve un botón con el saludo («Hola» / «Hola, {nombre}») y el lápiz.
   *
   * El botón es la única superficie táctil (≥44 px): sin fondo, con hover de
   * escritorio, pressed y `aria-label="Pon aquí tu nombre"`. El tooltip (Plan 04)
   * es mejora progresiva de escritorio; el toque abre la hoja de nombre (T-5.3).
   */
  interface Props {
    /** Nombre guardado (`02 §RF-01.1`); `null` → «Hola». */
    nombre?: string | null;
    /** Abre la hoja de nombre (`02 §RF-01.3`). */
    onAbrir: () => void;
  }

  let { nombre = null, onAbrir }: Props = $props();

  const saludo = $derived(nombre === null ? 'Hola' : `Hola, ${nombre}`);
</script>

<h1 class="saludo" data-screen-title tabindex="-1">
  <Tooltip label="Pon aquí tu nombre">
    <button type="button" class="saludo__btn" aria-label="Pon aquí tu nombre" onclick={onAbrir}>
      <span class="saludo__texto">{saludo}</span>
      <span class="saludo__lapiz"><Icon name="pencil" size={20} /></span>
    </button>
  </Tooltip>
</h1>

<style>
  .saludo {
    padding-top: max(20px, env(safe-area-inset-top, 0px));
    font-size: 1.375rem;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.01em;
    color: var(--color-ink);
  }

  .saludo__btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    max-width: 100%;
    min-height: 44px;
    margin-left: -12px;
    padding: 0 12px;
    border: 0;
    border-radius: var(--radius-control);
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition:
      background-color var(--dur-2) var(--ease-out),
      transform 100ms var(--ease-out);
  }

  .saludo__texto {
    min-width: 0;
    /* Nombres largos sin espacios (RF-01, hasta 30 caracteres) parten de línea
       en vez de empujar la columna (`07 §7.14`, contenido de usuario).
       `anywhere` también reduce el min-content, así el botón encoge. */
    overflow-wrap: anywhere;
    text-wrap: balance;
  }

  /* El lápiz es decorativo y de tinta secundaria (`07 §7.9.1`) */
  .saludo__lapiz {
    display: block;
    flex: none;
    color: var(--color-ink-2);
  }

  /* Hover solo con puntero fino (`07 §7.5.4`) */
  @media (hover: hover) and (pointer: fine) {
    .saludo__btn:hover {
      background: var(--color-surface-2);
    }
  }

  .saludo__btn:active {
    background: var(--color-surface-2);
    transform: scale(0.97);
  }

  /* `reduced-motion`: el pressed no escala (`07 §7.7.4`) */
  @media (prefers-reduced-motion: reduce) {
    .saludo__btn {
      transition: background-color var(--dur-2) var(--ease-out);
    }

    .saludo__btn:active {
      transform: none;
    }
  }
</style>
