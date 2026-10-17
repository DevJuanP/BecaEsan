<script lang="ts">
  import type { Snippet } from 'svelte';
  import Icon, { type IconName } from './Icon.svelte';

  /**
   * Botón del catálogo de `07 §7.9.4`. Siempre un `<button>` real.
   *
   * El acento sigue al contexto: azul por defecto y el del área cuando el
   * contenedor declara `data-area` (`--accent` de `07 §7.19`).
   */
  interface Props {
    variant?: 'primario' | 'secundario' | 'fantasma' | 'icono';
    /** 48 en barras inferiores; 44 en contextos menores (`07 §7.9.4`). */
    size?: 'context' | 'bar';
    icon?: IconName;
    iconPos?: 'start' | 'end';
    type?: 'button' | 'submit';
    disabled?: boolean;
    /** Ancho completo (Home, resultados y barras de un solo botón). */
    full?: boolean;
    /** Obligatorio en la variante `icono` (es su único nombre accesible). */
    ariaLabel?: string;
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
  }

  let {
    variant = 'primario',
    size = 'context',
    icon = undefined,
    iconPos = 'end',
    type = 'button',
    disabled = false,
    full = false,
    ariaLabel = undefined,
    onclick = undefined,
    children = undefined,
  }: Props = $props();
</script>

<button
  {type}
  {disabled}
  class="btn"
  class:btn--full={full}
  data-variant={variant}
  data-size={size}
  aria-label={ariaLabel}
  {onclick}
>
  {#if variant === 'icono'}
    {#if icon}<Icon name={icon} size={20} />{/if}
  {:else}
    {#if icon && iconPos === 'start'}<Icon name={icon} size={20} />{/if}
    {#if children}<span class="btn__label">{@render children()}</span>{/if}
    {#if icon && iconPos === 'end'}<Icon name={icon} size={20} />{/if}
  {/if}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-width: 44px;
    border: 1px solid transparent;
    border-radius: var(--radius-control);
    font: inherit;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.25;
    text-align: center;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition:
      background-color var(--dur-2) var(--ease-out),
      border-color var(--dur-2) var(--ease-out),
      color var(--dur-2) var(--ease-out),
      transform 100ms var(--ease-out);
  }

  .btn[data-size='context'] {
    height: 44px;
    padding: 0 20px;
  }

  .btn[data-size='bar'] {
    height: 48px;
    padding: 0 20px;
  }

  .btn[data-variant='icono'] {
    width: 44px;
    padding: 0;
  }

  .btn--full {
    width: 100%;
  }

  .btn__label {
    min-width: 0;
  }

  /* Primario: acento azul global; azul/naranja del área con `data-area` */
  .btn[data-variant='primario'] {
    background: var(--accent, var(--color-blue-600));
    color: #fff;
  }

  .btn[data-variant='secundario'] {
    background: var(--color-surface);
    border-color: var(--color-line-strong);
    color: var(--color-ink);
  }

  .btn[data-variant='fantasma'],
  .btn[data-variant='icono'] {
    color: var(--color-ink-2);
  }

  /* Hover solo con puntero fino (`07 §7.5.4`); en táctil manda pressed/focus */
  @media (hover: hover) and (pointer: fine) {
    .btn[data-variant='primario']:hover:not(:disabled) {
      background: var(--accent-strong, var(--color-blue-700));
    }

    .btn[data-variant='secundario']:hover:not(:disabled),
    .btn[data-variant='fantasma']:hover:not(:disabled),
    .btn[data-variant='icono']:hover:not(:disabled) {
      background: var(--color-surface-2);
    }

    .btn[data-variant='icono']:hover:not(:disabled) {
      color: var(--color-ink);
    }
  }

  /* Respuesta en pointerdown (`07 §7.7.1`): 100 ms, transform + tono profundo */
  .btn:active:not(:disabled) {
    transform: scale(0.97);
  }

  .btn[data-variant='primario']:active:not(:disabled) {
    background: var(--accent-deep, var(--color-blue-800));
  }

  .btn[data-variant='secundario']:active:not(:disabled) {
    background: var(--color-line);
  }

  .btn[data-variant='fantasma']:active:not(:disabled),
  .btn[data-variant='icono']:active:not(:disabled) {
    background: var(--color-surface-2);
  }

  .btn:disabled {
    cursor: default;
  }

  .btn[data-variant='primario']:disabled {
    background: var(--color-line);
    color: var(--color-ink-disabled);
  }

  .btn[data-variant='secundario']:disabled,
  .btn[data-variant='fantasma']:disabled,
  .btn[data-variant='icono']:disabled {
    color: var(--color-ink-disabled);
  }

  /* `reduced-motion`: la escala del pressed pasa a cambio estático (`07 §7.7.4`) */
  @media (prefers-reduced-motion: reduce) {
    .btn {
      transition:
        background-color var(--dur-2) var(--ease-out),
        border-color var(--dur-2) var(--ease-out),
        color var(--dur-2) var(--ease-out);
    }
  }
</style>
