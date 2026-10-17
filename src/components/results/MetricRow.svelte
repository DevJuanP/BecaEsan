<script lang="ts">
  /**
   * Fila de métrica de resultados (`07 §7.9.12`): punto de 8 px del color del
   * relleno de esa métrica + etiqueta + conteo de apoyo + porcentaje entero.
   *
   * El punto es decorativo (el texto ya nombra la métrica, `07 §7.12` (2): el
   * color nunca es el único portador), y el porcentaje va en columna alineada
   * con dígitos tabulares (`07 §7.13`).
   */
  interface Props {
    /** «Correctas» · «Incorrectas» · «No respondidas» (`07 §7.11`). */
    etiqueta: string;
    /** Color del relleno de la métrica (`07 §7.9.12`): `ok-fill`/`bad-fill`/`neutral-fill`. */
    color: string;
    /** Conteo de apoyo, p. ej. «12 de 15» (`07 §7.11`). */
    conteo: string;
    /** Porcentaje entero de esa métrica (suman 100, `02 §RN-09`). */
    porcentaje: number;
  }

  let { etiqueta, color, conteo, porcentaje }: Props = $props();
</script>

<li class="fila">
  <span class="fila__punto" style:background={color} aria-hidden="true"></span>
  <span class="fila__etiqueta">{etiqueta}</span>
  <span class="fila__conteo tnum">{conteo}</span>
  <span class="fila__pct tnum">{porcentaje} %</span>
</li>

<style>
  /* Alto de fila 24 y separación 8 (`07 §7.9.12`); `min-height` para tolerar
     el crecimiento del texto del sistema (`07 §7.12` (10)). */
  .fila {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 24px;
    font-size: 0.9375rem;
    line-height: 1.4;
  }

  .fila__punto {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .fila__etiqueta {
    min-width: 0;
    font-weight: 400;
    color: var(--color-ink-2);
    overflow-wrap: break-word;
  }

  .fila__conteo {
    flex: none;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--color-ink-3);
  }

  /* Porcentaje: `label` 700 tabular `ink`, en columna alineada a la derecha */
  .fila__pct {
    flex: none;
    min-width: 48px;
    margin-left: auto;
    font-weight: 700;
    color: var(--color-ink);
    text-align: right;
  }
</style>
