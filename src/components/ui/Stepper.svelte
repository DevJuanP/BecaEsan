<script lang="ts">
  import Icon from './Icon.svelte';
  import { formatoEntero, LIMITE_ENTERO, parsearEntero } from '../../lib/format';

  /**
   * Stepper numérico de puntajes (`07 §7.9.3`, RF-07): etiqueta + grupo
   * `[−] [valor] [+]` con botones de 44×44 y `aria-label` completos.
   *
   * El valor admite edición manual con `inputmode="numeric"`, muestra el
   * menos tipográfico (E-09) y declara el error inline de `07 §7.9.14`.
   * Un texto inválido deja el valor en `NaN`: la pantalla lo usa para
   * deshabilitar «Iniciar quiz» (Plan 05).
   */
  interface Props {
    /** Etiqueta visible de la fila (p. ej. «Correcta»). */
    label: string;
    /** Nombre accesible completo del campo (`07 §7.11`). */
    ariaLabel: string;
    /** Valor actual; `NaN` cuando el texto escrito no es un entero válido. */
    value?: number;
    invalid?: boolean;
    /** Mensaje de error (obligatorio cuando `invalid`). */
    errorMessage?: string;
  }

  let {
    label,
    ariaLabel,
    value = $bindable(0),
    invalid = false,
    errorMessage = undefined,
  }: Props = $props();

  const id = $props.id();
  const idError = `${id}-error`;

  let inputEl = $state<HTMLInputElement | null>(null);
  /** Texto en edición: mientras el campo está enfocado manda lo que se escribe. */
  let texto = $state('');
  let enfocado = $state(false);

  const mostrado = $derived(
    enfocado || !Number.isFinite(value) ? texto : formatoEntero(value),
  );

  function alEnfocar() {
    texto = Number.isFinite(value) ? formatoEntero(value) : texto;
    enfocado = true;
    // Reemplazo rápido: al enfocar se selecciona el texto (`07 §7.9.3`)
    inputEl?.select();
  }

  function alEscribir(evento: Event) {
    const campo = evento.currentTarget as HTMLInputElement;
    texto = campo.value;
    value = parsearEntero(texto) ?? NaN;
  }

  /** Ajuste de los botones ± (paso 1, con el rango de `02 §RF-07`). */
  function ajustar(paso: number) {
    const base = Number.isFinite(value) ? value : 0;
    const nuevo = Math.max(-LIMITE_ENTERO, Math.min(LIMITE_ENTERO, base + paso));
    value = nuevo;
    if (enfocado) {
      texto = formatoEntero(nuevo);
      inputEl?.select();
    }
  }
</script>

<div class="stepper">
  <div class="stepper__row">
    <label class="stepper__label" for={id}>{label}</label>
    <div class="stepper__group">
      <button
        type="button"
        class="stepper__btn"
        aria-label={`Quitar un punto a ${label}`}
        onclick={() => ajustar(-1)}
      >
        <Icon name="minus" size={20} />
      </button>

      <input
        id={id}
        bind:this={inputEl}
        class="stepper__input"
        class:is-invalid={invalid}
        type="text"
        inputmode="numeric"
        autocomplete="off"
        aria-label={ariaLabel}
        aria-invalid={invalid ? 'true' : undefined}
        aria-describedby={invalid && errorMessage ? idError : undefined}
        value={mostrado}
        oninput={alEscribir}
        onfocus={alEnfocar}
        onblur={() => (enfocado = false)}
      />

      <button
        type="button"
        class="stepper__btn"
        aria-label={`Añadir un punto a ${label}`}
        onclick={() => ajustar(1)}
      >
        <Icon name="plus" size={20} />
      </button>
    </div>
  </div>

  {#if invalid && errorMessage}
    <p class="stepper__error" id={idError}>{errorMessage}</p>
  {/if}
</div>

<style>
  .stepper__row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .stepper__label {
    flex: 1;
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.4;
    color: var(--color-ink-2);
  }

  .stepper__group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .stepper__btn {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border: 1px solid var(--color-line-strong);
    border-radius: var(--radius-control);
    background: var(--color-surface);
    color: var(--color-ink-2);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition:
      background-color var(--dur-2) var(--ease-out),
      color var(--dur-2) var(--ease-out),
      transform 100ms var(--ease-out);
  }

  .stepper__input {
    width: 64px;
    height: 44px;
    padding: 0 4px;
    border: 1px solid var(--color-line-strong);
    border-radius: var(--radius-control);
    background: var(--color-surface);
    color: var(--color-ink);
    font: inherit;
    font-size: 1rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    text-align: center;
  }

  .stepper__input:focus-visible {
    border-color: var(--color-focus);
  }

  .stepper__input.is-invalid {
    border-color: var(--color-bad);
  }

  .stepper__error {
    margin-top: 4px;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.4;
    color: var(--color-bad);
  }

  @media (hover: hover) and (pointer: fine) {
    .stepper__btn:hover {
      background: var(--color-surface-2);
      color: var(--color-ink);
    }
  }

  .stepper__btn:active {
    background: var(--color-surface-2);
    transform: scale(0.97);
  }

  @media (prefers-reduced-motion: reduce) {
    .stepper__btn {
      transition:
        background-color var(--dur-2) var(--ease-out),
        color var(--dur-2) var(--ease-out);
    }
  }
</style>
