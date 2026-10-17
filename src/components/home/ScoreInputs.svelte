<script lang="ts">
  import Stepper from '../ui/Stepper.svelte';
  import { validarConfig, type CampoPuntaje } from '../../lib/config';
  import type { ConfigQuiz } from '../../lib/types';

  /**
   * Puntajes del panel (`02 §RF-07`, `07 §7.9.3`, `§7.9.14`): tres steppers con
   * las etiquetas cortas del deck y los `aria-label` completos. La validación es
   * en vivo con `validarConfig` (Plan 03): el campo inválido se marca con su
   * mensaje y el CTA se deshabilita (T-5.7).
   */
  interface Props {
    /** Configuración compartida (`03 §3.3`); los steppers escriben en `puntos` (`bind:config`). */
    config: ConfigQuiz;
  }

  let { config = $bindable() }: Props = $props();

  /** Mensaje del deck (`07 §7.11`), con el menos tipográfico (E-09). */
  const MENSAJE_ERROR = 'Escribe un número entre −999 y 999.';

  const FILAS: readonly { campo: CampoPuntaje; etiqueta: string; ariaLabel: string }[] = [
    { campo: 'correcta', etiqueta: 'Correcta', ariaLabel: 'Puntos por respuesta correcta' },
    { campo: 'noRespondida', etiqueta: 'No respondida', ariaLabel: 'Puntos por pregunta no respondida' },
    { campo: 'incorrecta', etiqueta: 'Incorrecta', ariaLabel: 'Puntos por respuesta incorrecta' },
  ];

  const validacion = $derived(validarConfig(config));
  const enError = (campo: CampoPuntaje) => validacion.camposEnError.includes(campo);
</script>

<section class="tarjeta">
  <h2 class="tarjeta__titulo">Puntajes</h2>
  <p class="puntajes__caption">Puntos que suma cada tipo de respuesta</p>

  <div class="puntajes__filas">
    {#each FILAS as fila (fila.campo)}
      <Stepper
        label={fila.etiqueta}
        ariaLabel={fila.ariaLabel}
        bind:value={config.puntos[fila.campo]}
        invalid={enError(fila.campo)}
        errorMessage={MENSAJE_ERROR}
      />
    {/each}
  </div>
</section>

<style>
  .puntajes__caption {
    margin-top: 16px;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.4;
    color: var(--color-ink-3);
  }

  /* Los tres steppers, separados 20 (`07 §7.9.3`, `§7.10.1`) */
  .puntajes__filas {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 16px;
  }
</style>
