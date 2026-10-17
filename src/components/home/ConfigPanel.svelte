<script lang="ts">
  import { prefersReducedMotion } from 'svelte/motion';
  import { fade } from 'svelte/transition';
  import Slider from '../ui/Slider.svelte';
  import ModeSelector from './ModeSelector.svelte';
  import ScoreInputs from './ScoreInputs.svelte';
  import type { ConfigQuiz } from '../../lib/types';

  /**
   * Panel de configuración de Home (`05 §5.2`, `07 §7.10.1`): título de sección,
   * tarjeta de modo, tarjeta de sliders y —en las tareas siguientes— puntajes,
   * resumen y CTA (T-5.6, T-5.7).
   *
   * Recibe el objeto de configuración compartido (`estado.config`): los controles
   * escriben sobre él, así que **no hay copias** y el resumen se recalcula solo
   * (RF-08, RF-10).
   */
  interface Props {
    /** Configuración del intento (`03 §3.3`); los hijos la mutan. */
    config: ConfigQuiz;
  }

  let { config }: Props = $props();

  const idTitulo = $props.id();

  /** Áreas incluidas según el modo (`02 §RF-03`). */
  const incluyeRM = $derived(config.modo !== 'solo-rv');
  const incluyeRV = $derived(config.modo !== 'solo-rm');

  /** Fade de la sección excluida: 180 ms; instantáneo con reduced-motion (`07 §7.9.2`). */
  const duracionFade = $derived(prefersReducedMotion.current ? 0 : 180);
</script>

<section class="panel" aria-labelledby={idTitulo}>
  <h2 class="panel__titulo" id={idTitulo}>Configura tu quiz</h2>

  <ModeSelector bind:modo={config.modo} />

  <div class="tarjeta panel__sliders">
    {#if incluyeRM}
      <div transition:fade={{ duration: duracionFade }}>
        <Slider
          label="Temas de Razonamiento Matemático"
          unidad="temas"
          max={17}
          caption="Al azar, sin repetirse"
          bind:value={config.temasRM}
        />
      </div>
    {/if}

    {#if incluyeRV}
      <div transition:fade={{ duration: duracionFade }}>
        <Slider
          label="Temas de Razonamiento Verbal"
          unidad="temas"
          max={11}
          area="verbal"
          caption="Al azar, sin repetirse"
          bind:value={config.temasRV}
        />
      </div>
    {/if}

    <Slider
      label="Preguntas por tema"
      unidad="preguntas"
      max={5}
      caption="Al azar, dentro de cada tema"
      bind:value={config.preguntasPorTema}
    />
  </div>

  <ScoreInputs {config} />
</section>

<style>
  /* Composición del panel: 16 px entre bloques (`07 §7.9.5`) */
  .panel {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .panel__titulo {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: -0.01em;
    color: var(--color-ink);
    text-wrap: balance;
  }

  /* Los tres sliders, separados 24 (`07 §7.10.1`) */
  .panel__sliders {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
</style>
