<script lang="ts">
  import Icon from '../ui/Icon.svelte';
  import type { OpcionRevisada } from '../../lib/review';

  /**
   * Alternativa A–E en modo lectura (`02 §RF-22`): burbuja con la letra, texto
   * y marcas visibles (icono + palabra) para la clave y para lo que marcó el
   * usuario. No es un control: la revisión no permite cambiar la respuesta.
   */
  interface Props {
    opcion: OpcionRevisada;
  }

  let { opcion }: Props = $props();
</script>

<li
  class="opt"
  class:is-correcta={opcion.esCorrecta}
  class:is-seleccionada={opcion.esSeleccionada && !opcion.esCorrecta}
>
  <span class="opt__burbuja" aria-hidden="true">{opcion.letra}</span>
  <span class="opt__texto">{opcion.texto}</span>

  <span class="opt__marcas">
    {#if opcion.esCorrecta}
      <span class="marca marca--ok">
        <Icon name="check" size={16} />
        Correcta
      </span>
    {/if}
    {#if opcion.esSeleccionada}
      <span class="marca marca--tu">Tu respuesta</span>
    {/if}
  </span>
</li>

<style>
  .opt {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 4px 10px;
    min-width: 0;
    padding: 10px 12px;
    border: 1px solid var(--color-line);
    border-radius: var(--radius-control);
    background: var(--color-surface);
  }

  /* La clave: tinte y borde verdes, pero el significado también va en texto */
  .opt.is-correcta {
    border-color: var(--color-ok);
    background: var(--color-ok-soft);
  }

  /* Alternativa marcada que no era la clave: tinte y borde rojos */
  .opt.is-seleccionada {
    border-color: var(--color-bad);
    background: var(--color-bad-soft);
  }

  .opt__burbuja {
    display: grid;
    place-items: center;
    flex: none;
    width: 26px;
    height: 26px;
    margin-top: 1px;
    border: 1.5px solid var(--color-line-strong);
    border-radius: 50%;
    color: var(--color-ink-2);
    font-size: 0.8125rem;
    font-weight: 600;
    line-height: 1;
  }

  .opt.is-correcta .opt__burbuja {
    border-color: var(--color-ok);
    background: var(--color-ok);
    color: #fff;
  }

  .opt.is-seleccionada .opt__burbuja {
    border-color: var(--color-bad);
    background: var(--color-bad);
    color: #fff;
  }

  .opt__texto {
    flex: 1 1 180px;
    min-width: 0;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: var(--color-ink);
    overflow-wrap: break-word;
  }

  /* Las marcas caben a la derecha o bajan a una línea propia sin desbordar */
  .opt__marcas {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 6px;
    margin-left: auto;
  }

  .marca {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 2px 8px;
    border-radius: var(--radius-pill);
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1.35;
    white-space: nowrap;
  }

  .marca--ok {
    background: var(--color-surface);
    color: var(--color-ok);
  }

  .marca--tu {
    background: var(--color-surface);
    color: var(--color-bad);
  }

  /* Si acertó, «Tu respuesta» no debe leerse como error */
  .opt.is-correcta .marca--tu {
    color: var(--color-ink-2);
  }
</style>
