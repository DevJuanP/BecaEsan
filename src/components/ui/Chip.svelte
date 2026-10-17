<script lang="ts">
  import Icon from './Icon.svelte';

  /**
   * Chip de `07 §7.9.8`: pastilla de metadatos del quiz.
   * - `area`: punto del acento + texto del área (`accent-50` / borde `accent-100`).
   * - `time`: icono `clock` 16 + tiempo tabular en un ancho estable (`ch`).
   */
  interface Props {
    variant?: 'area' | 'time';
    label: string;
    /** Acento del chip de área: azul RM, naranja RV (`07 §7.9.8`). */
    area?: 'matematico' | 'verbal';
    /** Nombre accesible cuando el texto visible no basta (p. ej. «Tiempo transcurrido»). */
    ariaLabel?: string;
  }

  let { variant = 'area', label, area = undefined, ariaLabel = undefined }: Props = $props();
</script>

<span class="chip" data-variant={variant} data-area={area} aria-label={ariaLabel}>
  {#if variant === 'area'}
    <span class="chip__dot" aria-hidden="true"></span>
  {/if}
  {#if variant === 'time'}
    <Icon name="clock" size={16} />
  {/if}
  <span class="chip__text" class:tnum={variant === 'time'}>{label}</span>
</span>

<style>
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 28px;
    padding: 0 10px;
    border-radius: var(--radius-pill);
    font-size: 0.8125rem;
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
  }

  .chip[data-variant='area'] {
    background: var(--accent-soft, var(--color-blue-50));
    border: 1px solid var(--accent-line, var(--color-blue-100));
    color: var(--accent-ink, var(--color-blue-800));
  }

  .chip[data-variant='area'][data-area='verbal'] {
    --accent-ink: var(--color-orange-800);
  }

  .chip__dot {
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent, var(--color-blue-600));
  }

  .chip[data-variant='time'] {
    background: var(--color-surface-2);
    color: var(--color-ink-2);
  }

  .chip[data-variant='time'] :global(svg) {
    color: var(--color-ink-3);
  }

  /* Ancho estable para que el cronómetro no reflowee al cambiar de dígito
     (`07 §7.9.8`): cubre «mm:ss» (5 caracteres). */
  .chip__text.tnum {
    min-width: 5ch;
    text-align: right;
  }
</style>
