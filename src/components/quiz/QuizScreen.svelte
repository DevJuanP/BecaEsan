<script lang="ts">
  import { estado } from '../../lib/state.svelte';
  import QuestionCard from './QuestionCard.svelte';
  import QuizHeader from './QuizHeader.svelte';
  import SharedText from './SharedText.svelte';
  import type { Letra } from '../../lib/types';

  /**
   * Pantalla del quiz (`05 §5.4`, `07 §7.10.2`): monta **un bloque a la vez**
   * (`07 §7.13`) — cabecera sticky (RF-12), título del tema, texto común si
   * aplica (T-6.3) y las q preguntas del bloque actual con sus alternativas
   * A–E (RF-13, RF-14).
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
</script>

{#if intento !== null && bloque !== null}
  <!-- Cabecera sticky full-bleed (`07 §7.9.8`): fuera de la columna de 640 px -->
  <QuizHeader
    area={bloque.area}
    indice={intento.indiceActual}
    total={intento.bloques.length}
    iniciadoEn={intento.iniciadoEn}
  />

  <main class="quiz app-reserve">
    <!-- Título del tema: es el `<h1>` de la pantalla y recibe el foco al
         navegar (T-6.4) y al entrar desde Home (`07 §7.12` (11)). -->
    <h1 class="quiz__tema" data-screen-title tabindex="-1">{bloque.titulo}</h1>

    {#if bloque.textoComun !== null}
      <SharedText texto={bloque.textoComun} />
    {/if}

    <div class="quiz__bloque">
      {#each bloque.preguntas as pregunta (pregunta.id)}
        <QuestionCard
          {pregunta}
          respuesta={bloque.respuestas[pregunta.id] ?? null}
          onResponder={(letra) => responder(pregunta.id, letra)}
        />
      {/each}
    </div>
  </main>
{/if}

<style>
  .quiz {
    width: 100%;
    max-width: 640px;
    margin: 0 auto;
    padding: 0 20px;
  }

  @media (min-width: 430px) {
    .quiz {
      padding: 0 24px;
    }
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
  .quiz__bloque {
    display: flex;
    flex-direction: column;
    gap: 32px;
    margin-top: 24px;
  }
</style>
