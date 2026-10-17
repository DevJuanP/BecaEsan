<script lang="ts">
  import { prefersReducedMotion } from 'svelte/motion';
  import { fade } from 'svelte/transition';
  import BottomBar from '../ui/BottomBar.svelte';
  import Button from '../ui/Button.svelte';
  import Slider from '../ui/Slider.svelte';
  import ModeSelector from './ModeSelector.svelte';
  import ScoreInputs from './ScoreInputs.svelte';
  import { resumenConfig, validarConfig } from '../../lib/config';
  import type { ConfigQuiz } from '../../lib/types';

  /**
   * Panel de configuración de Home (`05 §5.2`, `07 §7.10.1`): título de sección,
   * tarjeta de modo, tarjeta de sliders, tarjeta de puntajes, resumen en vivo
   * (RF-08) y barra fija con «Iniciar quiz» (RF-09).
   *
   * Recibe el objeto de configuración compartido (`estado.config`): los controles
   * escriben sobre él, así que **no hay copias** y el resumen se recalcula solo
   * (RF-08, RF-10).
   */
  interface Props {
    /** Configuración del intento (`03 §3.3`); se comparte con `bind:config` desde `App.svelte`. */
    config: ConfigQuiz;
    /** Genera el intento y navega al quiz (`02 §RF-09`); lo hace `App.svelte`. */
    onIniciar: () => void;
  }

  let { config = $bindable(), onIniciar }: Props = $props();

  const idTitulo = $props.id();

  /** Áreas incluidas según el modo (`02 §RF-03`). */
  const incluyeRM = $derived(config.modo !== 'solo-rv');
  const incluyeRV = $derived(config.modo !== 'solo-rm');

  /** Fade de la sección excluida: 180 ms; instantáneo con reduced-motion (`07 §7.9.2`). */
  const duracionFade = $derived(prefersReducedMotion.current ? 0 : 180);

  /** Resumen estimado en vivo (`02 §RF-08`, `07 §7.11`). */
  const resumen = $derived(resumenConfig(config));

  /** Validez de los puntajes (`02 §RF-07`); deshabilita el CTA y muestra el motivo. */
  const valida = $derived(validarConfig(config).valida);
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

  <ScoreInputs bind:config />

  <p class="panel__resumen tnum">{resumen}</p>

  <BottomBar>
    {#snippet note()}
      {#if !valida}
        <p class="cta__motivo">Corrige los puntajes marcados para iniciar</p>
      {/if}
    {/snippet}

    <Button variant="primario" size="bar" full disabled={!valida} onclick={onIniciar}>Iniciar quiz</Button>
  </BottomBar>
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

  /* Resumen en vivo (RF-08): `label` 500 `ink-2` tabular, 24 px tras la tarjeta */
  .panel__resumen {
    margin-top: 8px;
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.4;
    color: var(--color-ink-2);
  }

  /* Motivo del CTA deshabilitado (`07 §7.9.14`): `caption` `ink-3`, centrada */
  .cta__motivo {
    margin-bottom: 6px;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.4;
    color: var(--color-ink-3);
    text-align: center;
  }
</style>
