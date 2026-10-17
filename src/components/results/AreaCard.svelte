<script lang="ts">
  import MetricRow from './MetricRow.svelte';
  import { formatoEntero } from '../../lib/format';
  import type { Area, ResultadoArea } from '../../lib/types';

  /**
   * Tarjeta por área incluida (`02 §RF-20.2`, `§RN-11`, `07 §7.10.3` #3):
   * punto del acento del área + nombre, «Puntaje del área» con el puntaje,
   * barra de composición y las tres filas de métrica (`07 §7.9.12`).
   *
   * Solo se monta para las áreas del intento: las áreas no incluidas no
   * aparecen por ningún lado (RN-11).
   */
  interface Props {
    /** Resultado del área (`03 §3.3`): puntaje, conteos y porcentajes enteros. */
    area: ResultadoArea;
    /** Posición de la tarjeta: escalona la aparición de la barra 70 ms (`07 §7.7.3`). */
    indice: number;
  }

  let { area, indice }: Props = $props();

  /** Nombres del deck de microcopy (`07 §7.11`, chip de área del quiz). */
  const NOMBRE_AREA: Record<Area, string> = {
    matematico: 'Razonamiento Matemático',
    verbal: 'Razonamiento Verbal y Comunicación',
  };

  /** Retraso escalonado de la barra: 70 ms por tarjeta (`07 §7.7.3`). */
  const retraso = $derived(`${indice * 70}ms`);

  /**
   * Segmentos de la barra de composición (`07 §7.9.12`): una barra por área que
   * representa su 100 % (RN-09); los segmentos con 0 % no se renderizan.
   */
  const segmentos = $derived(
    [
      { clave: 'aciertos', pct: area.porcentajes.aciertos, color: 'var(--color-ok-fill)' },
      { clave: 'erroneas', pct: area.porcentajes.erroneas, color: 'var(--color-bad-fill)' },
      {
        clave: 'noRespondidas',
        pct: area.porcentajes.noRespondidas,
        color: 'var(--color-neutral-fill)',
      },
    ].filter((segmento) => segmento.pct > 0),
  );

  /** Filas de métrica en el orden del deck (`07 §7.9.12`, `§7.11`). */
  const metricas = $derived([
    {
      clave: 'aciertos',
      etiqueta: 'Correctas',
      color: 'var(--color-ok-fill)',
      conteo: `${area.correctas} de ${area.total}`,
      porcentaje: area.porcentajes.aciertos,
    },
    {
      clave: 'erroneas',
      etiqueta: 'Incorrectas',
      color: 'var(--color-bad-fill)',
      conteo: `${area.incorrectas} de ${area.total}`,
      porcentaje: area.porcentajes.erroneas,
    },
    {
      clave: 'noRespondidas',
      etiqueta: 'No respondidas',
      color: 'var(--color-neutral-fill)',
      conteo: `${area.noRespondidas} de ${area.total}`,
      porcentaje: area.porcentajes.noRespondidas,
    },
  ]);
</script>

<!-- `data-area` aporta el acento del área (`07 §7.3.2`): azul RM, naranja RV -->
<section class="tarjeta area" data-area={area.area}>
  <div class="area__cabecera">
    <span class="area__punto" aria-hidden="true"></span>
    <h2 class="area__nombre">{NOMBRE_AREA[area.area]}</h2>
    <p class="area__puntaje">
      <span class="area__puntaje-etiqueta">Puntaje del área</span>
      <span class="area__puntaje-num tnum">{formatoEntero(area.puntaje)}</span>
    </p>
  </div>

  <!-- Barra de composición (`07 §7.9.12`): alto 10, radio 6, gap 2 -->
  <div class="area__barra" style:--retraso={retraso}>
    {#each segmentos as segmento (segmento.clave)}
      <span
        class="area__seg"
        style:flex-grow={segmento.pct}
        style:background={segmento.color}
      ></span>
    {/each}
  </div>

  <ul class="area__metricas">
    {#each metricas as metrica (metrica.clave)}
      <MetricRow
        etiqueta={metrica.etiqueta}
        color={metrica.color}
        conteo={metrica.conteo}
        porcentaje={metrica.porcentaje}
      />
    {/each}
  </ul>
</section>

<style>
  /* Fila superior (`07 §7.10.3` #3): punto + nombre + puntaje a la derecha */
  .area__cabecera {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .area__punto {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent, var(--color-blue-600));
  }

  /* Nombre del área (`07 §7.4.2`, title-3) */
  .area__nombre {
    min-width: 0;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.4;
    color: var(--color-ink);
    overflow-wrap: break-word;
  }

  /* Bloque del puntaje del área: etiqueta + número `title-1` 700 tabular */
  .area__puntaje {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-left: auto;
    text-align: right;
  }

  .area__puntaje-etiqueta {
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.4;
    color: var(--color-ink-3);
  }

  .area__puntaje-num {
    font-size: 1.375rem;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.01em;
    color: var(--color-ink);
  }

  /* Barra de composición (`07 §7.9.12`): 12 px tras la fila superior */
  .area__barra {
    display: flex;
    gap: 2px;
    height: 10px;
    margin-top: 12px;
    border-radius: 6px;
    overflow: hidden;
    transform-origin: left center;
    animation: barra-crece 500ms var(--ease-out) var(--retraso, 0ms) both;
  }

  @keyframes barra-crece {
    from {
      transform: scaleX(0);
    }

    to {
      transform: scaleX(1);
    }
  }

  .area__seg {
    flex: 0 1 0;
    min-width: 0;
    background: var(--color-neutral-fill);
  }

  /* Tres filas de métrica, separadas 8 (`07 §7.9.12`) */
  .area__metricas {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
    padding: 0;
    list-style: none;
  }

  /* `reduced-motion`: las barras aparecen en su valor final (`07 §7.7.4`) */
  @media (prefers-reduced-motion: reduce) {
    .area__barra {
      animation: none;
    }
  }
</style>
