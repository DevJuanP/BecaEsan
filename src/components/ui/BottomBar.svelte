<script lang="ts">
  import type { Snippet } from 'svelte';

  /**
   * Barra inferior fija de `07 §7.9.6` (zona del pulgar): translúcida con
   * `blur(12px)` y fallback sólido, borde + sombra solo al hacer scroll
   * (160 ms) y `env(safe-area-inset-bottom)` en el padding.
   *
   * Las variantes se resuelven por posición: el botón primario crece 2 y el
   * secundario 1 (`07 §7.9.4`). El contenido de la pantalla reserva altura
   * equivalente + 16 px para no quedar oculto.
   */
  interface Props {
    /** Línea sobre las acciones (p. ej. el motivo del CTA deshabilitado, `07 §7.9.14`). */
    note?: Snippet;
    children: Snippet;
  }

  let { note = undefined, children }: Props = $props();

  let scrolled = $state(window.scrollY > 0);
</script>

<svelte:window onscroll={() => (scrolled = window.scrollY > 0)} />

<div class="bar" class:is-scrolled={scrolled}>
  <div class="bar__inner">
    {#if note}
      <div class="bar__note">{@render note()}</div>
    {/if}
    <div class="bar__row">
      {@render children()}
    </div>
  </div>
</div>

<style>
  .bar {
    position: fixed;
    inset: auto 0 0 0;
    z-index: var(--z-chrome);
    background: rgba(255, 255, 255, 0.85);
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
    border-top: 1px solid transparent;
    transition:
      box-shadow 160ms var(--ease-out),
      border-color 160ms var(--ease-out);
  }

  /* Fallback sólido cuando no hay backdrop-filter (`07 §7.3.4`) */
  @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    .bar {
      background: var(--color-surface);
    }
  }

  /* Barras fijas con fondo sólido si el sistema pide menos transparencia (`07 §7.7.4`) */
  @media (prefers-reduced-transparency: reduce) {
    .bar {
      background: var(--color-surface);
      -webkit-backdrop-filter: none;
      backdrop-filter: none;
    }
  }

  .bar.is-scrolled {
    border-top-color: var(--color-line);
    box-shadow: var(--shadow-chrome);
  }

  .bar__inner {
    display: flex;
    flex-direction: column;
    max-width: 640px;
    margin: 0 auto;
    padding: 12px 20px calc(12px + env(safe-area-inset-bottom));
  }

  /* La línea de motivo va sobre las acciones (`07 §7.9.14`) */
  .bar__note {
    display: block;
  }

  .bar__row {
    display: flex;
    gap: 12px;
  }

  .bar__row > :global(*) {
    flex: 0 0 auto;
    min-width: 0;
  }

  .bar__row > :global([data-variant='primario']) {
    flex: 2 1 0;
  }

  .bar__row > :global([data-variant='secundario']) {
    flex: 1 1 0;
  }
</style>
