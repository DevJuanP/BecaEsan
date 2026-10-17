<script lang="ts">
  import { prefersReducedMotion } from 'svelte/motion';
  import { cubicInOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';
  import { calcularResultado } from '../../lib/scoring';
  import { estado } from '../../lib/state.svelte';
  import ConfirmModal from './ConfirmModal.svelte';
  import QuestionCard from './QuestionCard.svelte';
  import QuizHeader from './QuizHeader.svelte';
  import QuizNav from './QuizNav.svelte';
  import SharedText from './SharedText.svelte';
  import type { Area, Letra } from '../../lib/types';

  /**
   * Pantalla del quiz (`05 §5.4`, `07 §7.10.2`): monta **un bloque a la vez**
   * (`07 §7.13`) — cabecera sticky (RF-12), título del tema, texto común si
   * aplica (T-6.3) y las q preguntas del bloque actual con sus alternativas
   * A–E (RF-13, RF-14); la botonera fija navega entre bloques (RF-15).
   *
   * El intento vive en `estado` (snapshot de `02 §RN-01`): las respuestas se
   * escriben de inmediato en `bloque.respuestas` y `indiceActual` marca el
   * bloque visible (`03 §3.3`).
   */
  const intento = $derived(estado.intento);
  const bloque = $derived(intento === null ? null : (intento.bloques[intento.indiceActual] ?? null));

  /** Selección única y cambiable, sin feedback de corrección (`02 §RF-14`). */
  function responder(preguntaId: string, letra: Letra): void {
    const actual = estado.intento;
    if (actual === null) return;
    const bloqueActual = actual.bloques[actual.indiceActual];
    if (bloqueActual === undefined) return;
    bloqueActual.respuestas[preguntaId] = letra;
  }

  /**
   * Cambio de bloque (`02 §RF-15`, `07 §7.7.3`): dirección del gesto (Continuar
   * → el bloque nuevo entra desde la derecha; Atrás → desde la izquierda),
   * scroll arriba y foco al `<h1>` del bloque nuevo.
   */
  let direccion = $state(1);
  let enfocarTitulo = false;

  // El `<h1>` se vuelve a crear con cada bloque (`{#key}`): la *attachment* del
  // título enfoca el bloque nuevo cuando el cambio viene de una navegación.
  function alMontarTitulo(nodo: HTMLElement): void {
    if (!enfocarTitulo) return;
    enfocarTitulo = false;
    nodo.focus();
  }

  function irA(destino: number): void {
    const actual = estado.intento;
    if (actual === null) return;
    if (destino < 0 || destino >= actual.bloques.length || destino === actual.indiceActual) return;
    direccion = destino > actual.indiceActual ? 1 : -1;
    enfocarTitulo = true;
    actual.indiceActual = destino;
    window.scrollTo(0, 0);
  }

  /** «Ver resultados» (`02 §RF-17`): con blancos abre la confirmación; sin
   *  blancos pasa directo a resultados. */
  function verResultados(): void {
    if (estado.intento === null) return;
    if (blancos.total > 0) {
      hojaConfirmacion = true;
      return;
    }
    confirmarResultados();
  }

  /** Cierre del intento (`02 §RF-17`, `§RF-19`): detiene el cronómetro
   *  (`terminadoEn`), calcula el resultado y navega a la pantalla de resultados. */
  function confirmarResultados(): void {
    const actual = estado.intento;
    if (actual === null) return;
    hojaConfirmacion = false;
    actual.terminadoEn = Date.now();
    estado.resultado = calcularResultado(actual);
    void estado.irA('resultados');
  }

  /** Visibilidad de la hoja de confirmación (`05 §5.5`). */
  let hojaConfirmacion = $state(false);

  /**
   * Aviso al salir a mitad del intento (`02 §RF-18`, RNF-09): mientras esta
   * pantalla está montada, recargar o cerrar la pestaña dispara el diálogo
   * nativo del navegador. El listener se retira al desmontar la pantalla (al
   * pasar a resultados o volver a Home): solo está activo durante el quiz.
   */
  function alSalir(evento: BeforeUnloadEvent): void {
    evento.preventDefault();
    // Compatibilidad con navegadores que aún exigen `returnValue` no vacío.
    evento.returnValue = '';
  }

  /** Etiquetas cortas del detalle de la confirmación (`07 §7.11`). */
  const ETIQUETA_AREA: Record<Area, string> = { matematico: 'RM', verbal: 'RV' };

  /** Blancos del intento, globales y por área (`02 §RF-17`). */
  const blancos = $derived.by(() => {
    const actual = estado.intento;
    const porArea: Record<Area, number> = { matematico: 0, verbal: 0 };
    const areas: Area[] = [];
    let total = 0;
    if (actual !== null) {
      for (const bloque of actual.bloques) {
        if (!areas.includes(bloque.area)) areas.push(bloque.area);
        for (const pregunta of bloque.preguntas) {
          if ((bloque.respuestas[pregunta.id] ?? null) !== null) continue;
          total += 1;
          porArea[bloque.area] += 1;
        }
      }
    }
    return { total, porArea, areas };
  });

  /** Detalle «RM: a · RV: b» con solo las áreas activas con blancos (`07 §7.11`). */
  const detalleBlancos = $derived(
    blancos.areas
      .map((area) => ({ etiqueta: ETIQUETA_AREA[area], cantidad: blancos.porArea[area] }))
      .filter(({ cantidad }) => cantidad > 0)
      .map(({ etiqueta, cantidad }) => `${etiqueta}: ${cantidad}`)
      .join(' · '),
  );

  /** Transición de bloque (`07 §7.7.3`): ±24 px + fade 260 ms; con
   *  `reduced-motion`, solo fade de 150 ms (`07 §7.7.4`). */
  const duracionBloque = $derived(prefersReducedMotion.current ? 150 : 260);
  const desplazamientoBloque = $derived(prefersReducedMotion.current ? 0 : 24);

  /**
   * Salida del bloque: `fly` hacia el lado opuesto y, desde el primer frame, el
   * bloque que se va deja de recibir toques (durante el cruce convive con el
   * entrante en la misma celda del escenario).
   */
  function salirBloque(
    nodo: Element,
    params: { x: number; duration: number; easing: (t: number) => number },
  ) {
    (nodo as HTMLElement).style.pointerEvents = 'none';
    return fly(nodo, params);
  }
</script>

<svelte:window onbeforeunload={alSalir} />

{#if intento !== null && bloque !== null}
  <!-- El acento contextual del quiz sigue al bloque actual (`02 §RN-03`,
       `07 §7.3.3`): azul en RM, naranja en RV, para cabecera, botonera y
       alternativas (todas consumen `--accent`). -->
  <div data-area={bloque.area}>
    <!-- Cabecera sticky full-bleed (`07 §7.9.8`): fuera de la columna de 640 px -->
    <QuizHeader
      area={bloque.area}
      indice={intento.indiceActual}
      total={intento.bloques.length}
      iniciadoEn={intento.iniciadoEn}
    />

    <main class="quiz app-reserve">
      <!-- El escenario apila el bloque saliente y el entrante en la misma celda
           para que la transición no empuje el contenido (`07 §7.7.3`). -->
      <div class="quiz__escenario">
        {#key intento.indiceActual}
          <!-- `data-area` propio: el bloque saliente conserva su acento durante
               el cruce RM→RV (el bloque nuevo entra ya con el suyo). -->
          <div
            class="quiz__bloque"
            data-area={bloque.area}
            in:fly={{
              x: desplazamientoBloque * direccion,
              duration: duracionBloque,
              easing: cubicInOut,
            }}
            out:salirBloque={{
              x: -desplazamientoBloque * direccion,
              duration: duracionBloque,
              easing: cubicInOut,
            }}
          >
            <!-- Título del tema: es el `<h1>` de la pantalla y recibe el foco al
                 navegar (`07 §7.10.2`, `§7.12` (11)). -->
            <h1 class="quiz__tema" data-screen-title tabindex="-1" {@attach alMontarTitulo}>
              {bloque.titulo}
            </h1>

            {#if bloque.textoComun !== null}
              <SharedText texto={bloque.textoComun} />
            {/if}

            <div class="quiz__preguntas">
              {#each bloque.preguntas as pregunta (pregunta.id)}
                <QuestionCard
                  {pregunta}
                  respuesta={bloque.respuestas[pregunta.id] ?? null}
                  onResponder={(letra) => responder(pregunta.id, letra)}
                />
              {/each}
            </div>
          </div>
        {/key}
      </div>
    </main>

    <QuizNav
      indice={intento.indiceActual}
      total={intento.bloques.length}
      onAtras={() => irA(intento.indiceActual - 1)}
      onContinuar={() => irA(intento.indiceActual + 1)}
      onVerResultados={verResultados}
    />

    <!-- Hoja de confirmación (`02 §RF-17`): dentro del contenedor con
         `data-area` para que su acción primaria use el acento del área actual -->
    <ConfirmModal
      bind:open={hojaConfirmacion}
      blancos={blancos.total}
      detalle={detalleBlancos}
      onConfirmar={confirmarResultados}
    />
  </div>
{/if}

<style>
  .quiz {
    width: 100%;
    max-width: 640px;
    margin: 0 auto;
    /* Solo padding lateral: el inferior lo aporta `.app-reserve`
       (reserva de la barra fija, `07 §7.5.3`) */
    padding-inline: 20px;
  }

  @media (min-width: 430px) {
    .quiz {
      padding-inline: 24px;
    }
  }

  .quiz__escenario {
    display: grid;
  }

  /* El bloque ocupa la única celda del escenario: el saliente y el entrante se
     superponen durante la transición en vez de apilarse. */
  .quiz__bloque {
    grid-area: 1 / 1;
  }

  /* Título del tema (`07 §7.10.2` #2): `title-2`, 24 px desde la cabecera */
  .quiz__tema {
    padding-top: 24px;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: -0.01em;
    color: var(--color-ink);
    text-wrap: balance;
  }

  /* Separación entre preguntas: 32 px (`07 §7.10.2` #4) */
  .quiz__preguntas {
    display: flex;
    flex-direction: column;
    gap: 32px;
    margin-top: 24px;
  }
</style>
