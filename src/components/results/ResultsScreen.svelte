<script lang="ts">
  import AreaCard from './AreaCard.svelte';
  import ScoreHero from './ScoreHero.svelte';
  import Button from '../ui/Button.svelte';
  import { etiquetaModo } from '../../lib/config';
  import { estado } from '../../lib/state.svelte';

  /**
   * Pantalla de resultados (`05 §5.6`, `07 §7.10.3`): cierra el ciclo del
   * producto mostrando el resultado calculado al confirmar «Ver resultados»
   * (`02 §RF-19`, `03 §3.3`).
   *
   * Composición vertical de `07 §7.10.3`: título y saludo (RF-20.5), puntaje
   * héroe (RF-20.1/RF-20.3), tarjeta por área incluida (RF-20.2, RN-11),
   * recordatorio de la configuración (RF-20.4) y botón «Home» (RF-21).
   */
  const resultado = $derived(estado.resultado);

  /**
   * Recordatorio de la configuración del intento (`02 §RF-20.4`, `07 §7.11`):
   * «{Modo} · {k} temas · {q} preguntas por tema», con la **instantánea** del
   * intento (`03 §3.3`), no la configuración actual del panel.
   */
  const recordatorio = $derived.by(() => {
    const config = estado.intento?.config ?? null;
    if (config === null) return '';
    const incluyeRM = config.modo !== 'solo-rv';
    const incluyeRV = config.modo !== 'solo-rm';
    const temas = (incluyeRM ? config.temasRM : 0) + (incluyeRV ? config.temasRV : 0);
    return `${etiquetaModo(config.modo)} · ${temas} temas · ${config.preguntasPorTema} preguntas por tema`;
  });
</script>

{#if resultado !== null}
  <main class="res">
    <!-- `<h1>` de la pantalla: recibe el foco al navegar (`07 §7.12` (11)) -->
    <h1 class="res__titulo" data-screen-title tabindex="-1">Resultados</h1>

    {#if estado.nombre !== null}
      <p class="res__saludo">¡Buen trabajo, {estado.nombre}!</p>
    {/if}

    <div class="res__heroe">
      <ScoreHero
        puntajeTotal={resultado.puntajeTotal}
        escala={resultado.escala}
        duracionMs={resultado.duracionMs}
      />
    </div>

    <!-- Solo áreas incluidas (RN-11); en ≥768 px, dos columnas (`07 §7.10.3`) -->
    <div class="res__areas">
      {#each resultado.areas as area, indice (area.area)}
        <AreaCard {area} {indice} />
      {/each}
    </div>

    <!-- Recordatorio de la configuración del intento (`02 §RF-20.4`) -->
    <p class="res__recordatorio tnum">{recordatorio}</p>

    <!-- «Home» (RF-21): vuelve al panel conservando nombre y configuración -->
    <div class="res__home">
      <Button
        variant="primario"
        size="bar"
        icon="house"
        iconPos="start"
        full
        onclick={() => void estado.cerrarResultados()}
      >
        Home
      </Button>
    </div>
  </main>
{/if}

<style>
  /* Columna de lectura de `07 §7.5.3`: 640 px centrada, padding lateral 20/24.
     Reserva final de 48 px + safe-area (`07 §7.10.3`): esta pantalla no tiene
     barra fija, así que no usa `.app-reserve`. */
  .res {
    width: 100%;
    max-width: 640px;
    margin: 0 auto;
    padding: 20px 20px calc(var(--space-12) + env(safe-area-inset-bottom));
  }

  @media (min-width: 430px) {
    .res {
      padding-inline: 24px;
    }
  }

  /* Título de pantalla (`07 §7.4.2`, title-2) */
  .res__titulo {
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: -0.01em;
    color: var(--color-ink);
    text-wrap: balance;
  }

  /* Saludo (`02 §RF-20.5`, `07 §7.10.3` #1): `body` `ink-2`, solo con nombre.
     Con nombre largo y texto del sistema grande el saludo parte de línea en
     vez de desbordar (`07 §7.14`, contenido de usuario). */
  .res__saludo {
    margin-top: 4px;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: var(--color-ink-2);
    overflow-wrap: break-word;
    text-wrap: pretty;
  }

  /* Puntaje héroe: 32 px tras el bloque de título (`07 §7.10.3` #2) */
  .res__heroe {
    margin-top: 32px;
  }

  /* Tarjetas de área: 16 px entre ellas (`07 §7.10.3` #3) */
  .res__areas {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 16px;
  }

  /* Las tarjetas pueden encogerse por debajo de su contenido: con el texto del
     sistema al 200 % el interior envuelve en vez de desbordar (`07 §7.12` (10)). */
  .res__areas > :global(*) {
    min-width: 0;
  }

  /* Escritorio: una tarjeta por área en dos columnas, gap 20 (`07 §7.10.3`) */
  @media (min-width: 768px) {
    .res__areas {
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
  }

  /* Recordatorio de configuración: 24 px tras las tarjetas (`07 §7.10.3` #4) */
  .res__recordatorio {
    margin-top: 24px;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.4;
    color: var(--color-ink-3);
    text-wrap: pretty;
  }

  /* Botón «Home»: ancho completo, al final del flujo (`07 §7.10.3` #5) */
  .res__home {
    margin-top: 20px;
  }
</style>
