<script lang="ts">
  import ReviewQuestion from './ReviewQuestion.svelte';
  import SharedText from '../quiz/SharedText.svelte';
  import { NOMBRE_AREA } from '../../lib/config';
  import type { Area, BloqueIntento } from '../../lib/types';

  /**
   * Revisión completa del intento (`02 §RF-22`, `05 §5.6`): agrupa los bloques
   * por área en el orden del quiz y cada tema conserva su título, su texto
   * común (si lo tiene) y sus preguntas. Todo es de solo lectura.
   */
  interface Props {
    /** Bloques del intento visualizado, en el orden en que se respondieron. */
    bloques: BloqueIntento[];
    /** Id del contenedor; el botón de resultados lo usa en `aria-controls`. */
    id: string;
  }

  let { bloques, id }: Props = $props();

  /** Agrupa por área conservando el orden de aparición (RM y luego RV). */
  const grupos = $derived.by(() => {
    const lista: Array<{ area: Area; temas: BloqueIntento[] }> = [];
    for (const bloque of bloques) {
      const grupo = lista.find((candidato) => candidato.area === bloque.area);
      if (grupo === undefined) lista.push({ area: bloque.area, temas: [bloque] });
      else grupo.temas.push(bloque);
    }
    return lista;
  });
</script>

<section class="rev" id={id} aria-labelledby={`${id}-titulo`}>
  <h2 class="rev__titulo" id={`${id}-titulo`}>Revisión de respuestas</h2>
  <p class="rev__ayuda">Consulta la alternativa correcta y la explicación de cada pregunta.</p>

  {#each grupos as grupo (grupo.area)}
    <section class="rev__area" data-area={grupo.area} aria-labelledby={`${id}-${grupo.area}`}>
      <h3 class="rev__area-nombre" id={`${id}-${grupo.area}`}>
        <span class="rev__area-punto" aria-hidden="true"></span>
        {NOMBRE_AREA[grupo.area]}
      </h3>

      <div class="rev__temas">
        {#each grupo.temas as bloque (bloque.temaId)}
          <section class="rev__tema">
            <h4 class="rev__tema-nombre">{bloque.titulo}</h4>

            {#if bloque.textoComun !== null}
              <SharedText texto={bloque.textoComun} abiertoInicial={false} />
            {/if}

            <div class="rev__preguntas">
              {#each bloque.preguntas as pregunta (pregunta.id)}
                <ReviewQuestion {pregunta} respuesta={bloque.respuestas[pregunta.id] ?? null} />
              {/each}
            </div>
          </section>
        {/each}
      </div>
    </section>
  {/each}
</section>

<style>
  .rev {
    min-width: 0;
  }

  /* Título de la revisión (`07 §7.4.2`, title-2) */
  .rev__titulo {
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: -0.01em;
    color: var(--color-ink);
    text-wrap: balance;
  }

  .rev__ayuda {
    margin-top: 4px;
    font-size: 0.9375rem;
    font-weight: 400;
    line-height: 1.5;
    color: var(--color-ink-2);
    text-wrap: pretty;
  }

  /* Cada área del intento; solo se montan las incluidas (RN-11) */
  .rev__area {
    margin-top: 28px;
  }

  .rev__area-nombre {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.4;
    color: var(--color-ink);
    overflow-wrap: break-word;
  }

  .rev__area-punto {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent, var(--color-blue-600));
  }

  .rev__temas {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-top: 12px;
  }

  .rev__tema {
    min-width: 0;
  }

  .rev__tema-nombre {
    font-size: 0.9375rem;
    font-weight: 600;
    line-height: 1.4;
    color: var(--color-ink-2);
    overflow-wrap: break-word;
  }

  .rev__preguntas {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
  }
</style>
