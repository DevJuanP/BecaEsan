<script lang="ts">
  import Chip from '../ui/Chip.svelte';
  import ProgressSegments from '../ui/ProgressSegments.svelte';
  import { formatDuracion } from '../../lib/format';
  import type { Area } from '../../lib/types';

  /**
   * Cabecera sticky del quiz (`02 §RF-12`, `07 §7.9.8` + `§7.9.9`): chip del
   * área actual, «Bloque X de Y», cronómetro informativo y barra de progreso.
   *
   * La fila se envuelve con `flex-wrap` cuando no cabe (a 360 px el chip de
   * área y «Bloque X de Y» ocupan la primera línea y el cronómetro pasa a la
   * segunda, como en el wireframe de `05 §5.4`); en anchos cómodos va en una
   * sola línea con el separador flexible antes del cronómetro.
   */
  interface Props {
    /** Área del bloque visible (`02 §RN-03`): tiñe chip y progreso. */
    area: Area;
    /** Bloque visible, 0-based (`03 §3.3`). */
    indice: number;
    /** Total de bloques del intento. */
    total: number;
    /** Marca de inicio del intento (`03 §3.3`); el reloj se deriva de ella. */
    iniciadoEn: number;
  }

  let { area, indice, total, iniciadoEn }: Props = $props();

  /** Texto completo del área (`07 §7.11`, deck de microcopy). */
  const TEXTO_AREA: Record<Area, string> = {
    matematico: 'Razonamiento Matemático',
    verbal: 'Razonamiento Verbal y Comunicación',
  };

  /** Borde + sombra de la cabecera al hacer scroll (`07 §7.9.8`). */
  let conScroll = $state(false);

  /**
   * Reloj **derivado** de `iniciadoEn` (`02 §RF-16`): cada tic recalcula
   * `Date.now()`, así que no acumula deriva. El intervalo vive mientras la
   * cabecera está montada (solo durante el quiz) y se limpia al desmontarla
   * (al entrar a resultados, T-6.6).
   */
  let ahora = $state(Date.now());

  $effect(() => {
    const intervalo = setInterval(() => {
      ahora = Date.now();
    }, 1000);
    return () => clearInterval(intervalo);
  });

  const transcurrido = $derived(Math.max(0, ahora - iniciadoEn));
</script>

<svelte:window onscroll={() => (conScroll = window.scrollY > 0)} />

<header class="cab" class:is-scrolled={conScroll}>
  <div class="cab__inner">
    <div class="cab__fila">
      <Chip label={TEXTO_AREA[area]} {area} />
      <p class="cab__bloque tnum">Bloque {indice + 1} de {total}</p>
      <!-- El «separador flexible» de `07 §7.9.8` es este margen automático:
           fija el cronómetro al extremo derecho de su línea, también cuando la
           fila se envuelve a 360 px. -->
      <span class="cab__cronometro">
        <!-- Sin `aria-live`: el cronómetro no debe interrumpir a lectores (`07 §7.9.8`) -->
        <Chip variant="time" label={formatDuracion(transcurrido)} ariaLabel="Tiempo transcurrido" />
      </span>
    </div>

    <div class="cab__progreso">
      <ProgressSegments {total} current={indice + 1} />
    </div>
  </div>
</header>

<style>
  /* Sticky arriba (`07 §7.9.8`): translúcida + blur, con fallback sólido */
  .cab {
    position: sticky;
    top: 0;
    z-index: var(--z-chrome);
    background: rgba(255, 255, 255, 0.85);
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid transparent;
    transition:
      box-shadow 160ms var(--ease-out),
      border-color 160ms var(--ease-out);
  }

  @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    .cab {
      background: var(--color-surface);
    }
  }

  /* Superficies fijas con fondo sólido si el sistema pide menos transparencia (`07 §7.7.4`) */
  @media (prefers-reduced-transparency: reduce) {
    .cab {
      background: var(--color-surface);
      -webkit-backdrop-filter: none;
      backdrop-filter: none;
    }
  }

  .cab.is-scrolled {
    border-bottom-color: var(--color-line);
    box-shadow: var(--shadow-chrome-down);
  }

  .cab__inner {
    max-width: 640px;
    margin: 0 auto;
    padding: max(8px, env(safe-area-inset-top)) 20px 10px;
  }

  @media (min-width: 430px) {
    .cab__inner {
      padding-inline: 24px;
    }
  }

  /* Fila de `07 §7.9.8`: chip de área · «Bloque X de Y» · separador · cronómetro */
  .cab__fila {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px 8px;
  }

  .cab__bloque {
    font-size: 0.8125rem;
    font-weight: 600;
    line-height: 1.4;
    color: var(--color-ink-2);
  }

  /* Separador flexible: empuja el cronómetro al extremo de su línea */
  .cab__cronometro {
    display: flex;
    margin-inline-start: auto;
  }

  .cab__progreso {
    margin-top: 8px;
  }
</style>
