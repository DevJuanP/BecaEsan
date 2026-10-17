<script lang="ts">
  import AreaCard from './AreaCard.svelte';
  import ScoreHero from './ScoreHero.svelte';
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

  /* Saludo (`02 §RF-20.5`, `07 §7.10.3` #1): `body` `ink-2`, solo con nombre */
  .res__saludo {
    margin-top: 4px;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: var(--color-ink-2);
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

  /* Escritorio: una tarjeta por área en dos columnas, gap 20 (`07 §7.10.3`) */
  @media (min-width: 768px) {
    .res__areas {
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
  }
</style>
