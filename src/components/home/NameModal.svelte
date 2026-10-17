<script lang="ts">
  import { tick } from 'svelte';
  import Button from '../ui/Button.svelte';
  import Sheet from '../ui/Sheet.svelte';
  import { MAX_NOMBRE } from '../../lib/storage';

  /**
   * Hoja de nombre (`02 §RF-01.3`–`§RF-01.5`, `05 §5.3`, `07 §7.9.11`): sobre la
   * hoja del Plan 04 (bottom-sheet en móvil, diálogo centrado en escritorio).
   *
   * El texto es un **borrador** que vive en el padre (`bind:value`): solo
   * «Guardar» lo aplica; «Cancelar», la X, `Escape` y el toque fuera lo
   * descartan (RF-01.4). El foco vuelve al lápiz porque `<dialog>` lo restaura.
   */
  interface Props {
    /** Visibilidad de la hoja (`bind:open`). */
    open?: boolean;
    /** Borrador en edición (`bind:value`); el padre lo reinicia al abrir. */
    value?: string;
    /** Aplica el nombre (persistencia y saludo viven en `state.svelte.ts`). */
    onGuardar: (nombre: string) => void;
  }

  let { open = $bindable(false), value = $bindable(''), onGuardar }: Props = $props();

  const idCampo = $props.id();
  const idAyuda = `${idCampo}-ayuda`;
  let campoEl = $state<HTMLInputElement | null>(null);

  /** Ayuda que pasa a error cuando el texto supera el tope (`07 §7.9.11`). */
  const excedido = $derived(value.length > MAX_NOMBRE);

  $effect(() => {
    if (!open) return;
    // Foco automático solo con puntero fino (`07 §7.16` #2): en táctil el
    // autofocus desplegaría el teclado emergente sobre la hoja.
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const campo = campoEl;
    if (campo === null) return;
    // El `Sheet` abre el `<dialog>` en su propio efecto: se espera al DOM.
    tick().then(() => campo.focus());
  });

  function guardar() {
    onGuardar(value);
    open = false;
  }
</script>

<Sheet bind:open title="¿Cómo te llamas?" showClose>
  <label class="campo" for={idCampo}>Tu nombre</label>
  <input
    id={idCampo}
    bind:this={campoEl}
    bind:value
    class="campo__input"
    class:is-invalid={excedido}
    type="text"
    placeholder="Ej. Juan"
    autocomplete="given-name"
    aria-invalid={excedido ? 'true' : undefined}
    aria-describedby={idAyuda}
  />
  <p class="campo__ayuda" class:is-error={excedido} id={idAyuda}>
    {excedido ? 'Máximo 30 caracteres.' : 'Máx. 30 caracteres'}
  </p>

  {#snippet actions()}
    <Button variant="secundario" onclick={() => (open = false)}>Cancelar</Button>
    <Button variant="primario" onclick={guardar}>Guardar</Button>
  {/snippet}
</Sheet>

<style>
  .campo {
    display: block;
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.4;
    color: var(--color-ink-2);
  }

  .campo__input {
    display: block;
    width: 100%;
    height: 48px;
    margin-top: 8px;
    padding: 0 12px;
    border: 1px solid var(--color-line-strong);
    border-radius: var(--radius-control);
    background: var(--color-surface);
    color: var(--color-ink);
    font: inherit;
    font-size: 1rem;
    font-weight: 400;
  }

  .campo__input::placeholder {
    color: var(--color-ink-3);
  }

  .campo__input:focus-visible {
    border-color: var(--color-focus);
  }

  .campo__input.is-invalid {
    border-color: var(--color-bad);
  }

  .campo__ayuda {
    margin-top: 4px;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.4;
    color: var(--color-ink-3);
  }

  .campo__ayuda.is-error {
    color: var(--color-bad);
  }
</style>
