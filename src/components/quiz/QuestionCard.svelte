<script lang="ts">
  import OptionRow from '../ui/OptionRow.svelte';
  import type { Letra, Pregunta } from '../../lib/types';

  /**
   * Pregunta del bloque (`07 §7.10.2` #4, `07 §7.9.7`): `<fieldset>` con el
   * enunciado en `<legend>` (numeración «1.» + statement) y las cinco
   * alternativas A–E en el orden del material (RN-06), separadas 12 px.
   *
   * La selección vive en `bloque.respuestas` (la escribe la pantalla): aquí no
   * hay feedback de corrección (RF-14) y la alternativa se puede cambiar
   * cuantas veces se quiera mientras el bloque esté visible.
   */
  interface Props {
    pregunta: Pregunta;
    /** Letra seleccionada o `null` si sigue en blanco (`03 §3.3`). */
    respuesta: Letra | null;
    /** Escribe la elección en el intento (`02 §RF-14`). */
    onResponder: (letra: Letra) => void;
  }

  let { pregunta, respuesta, onResponder }: Props = $props();
</script>

<fieldset class="q">
  <legend class="q__legend">
    <span class="q__num">{pregunta.numero}.</span>
    <span class="q__enunciado">{pregunta.enunciado}</span>
  </legend>

  <div class="q__opciones">
    {#each pregunta.opciones as opcion (opcion.letra)}
      <OptionRow
        name={pregunta.id}
        value={opcion.letra}
        letter={opcion.letra}
        text={opcion.texto}
        selected={respuesta === opcion.letra}
        onselect={() => onResponder(opcion.letra)}
      />
    {/each}
  </div>
</fieldset>

<style>
  /* `fieldset` sin adornos: la semántica de grupo la aporta el navegador */
  .q {
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }

  /* Hanging indent con `text-indent` (layout inline puro, sin quiebres entre
     navegadores): el número abre la primera línea y el enunciado envuelve
     alineado a su derecha (`07 §7.10.2` #4). */
  .q__legend {
    margin: 0 0 12px;
    padding-left: 22px;
    text-indent: -22px;
  }

  .q__num {
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.4;
    color: var(--color-ink-2);
    font-variant-numeric: tabular-nums;
  }

  /* Enunciado en `statement` (17/500/1.55, `07 §7.4.2`); nunca en itálica ni
     gris claro (`05 §5.1`). */
  .q__enunciado {
    font-size: 1.0625rem;
    font-weight: 500;
    line-height: 1.55;
    color: var(--color-ink);
    text-wrap: pretty;
  }

  .q__opciones {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
</style>
