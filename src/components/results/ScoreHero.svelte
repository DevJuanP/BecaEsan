<script lang="ts">
  import Icon from '../ui/Icon.svelte';
  import { formatDuracion, formatoConSigno, formatoEntero } from '../../lib/format';

  /**
   * Puntaje héroe de resultados (`02 §RF-20.1`, `§RF-20.3`, `07 §7.9.13`):
   * etiqueta del dato, número `display` con signo en negativos (E-05, E-09) y
   * fila de metadatos con la **escala usada** (signos explícitos) y el tiempo
   * total del intento (RF-16).
   *
   * La aparición es única (`07 §7.7.3`): fade + `scale(0.98→1)` de 260 ms, una
   * sola vez al montar la pantalla; con `reduced-motion` aparece en su valor
   * final sin transformación (`07 §7.7.4`).
   */
  interface Props {
    /** Puntaje total del intento; puede ser 0 o negativo (RN-08). */
    puntajeTotal: number;
    /** Escala configurada del snapshot (`03 §3.3`): se muestra con signos explícitos. */
    escala: { correcta: number; noRespondida: number; incorrecta: number };
    /** Duración total del intento en ms (`03 §3.3`). */
    duracionMs: number;
  }

  let { puntajeTotal, escala, duracionMs }: Props = $props();

  /** «+5 · 0 · −2»: signos explícitos en los tres valores (`07 §7.9.13`). */
  const escalaTexto = $derived(
    `${formatoConSigno(escala.correcta)} · ${formatoConSigno(escala.noRespondida)} · ${formatoConSigno(escala.incorrecta)}`,
  );
</script>

<section class="heroe">
  <p class="heroe__etiqueta">Puntaje total</p>
  <p class="heroe__numero tnum">{formatoEntero(puntajeTotal)}</p>

  <div class="heroe__meta">
    <span class="heroe__escala tnum">Escala: {escalaTexto}</span>
    <span class="heroe__tiempo tnum">
      <span class="heroe__reloj"><Icon name="clock" size={16} /></span>
      Tiempo {formatDuracion(duracionMs)}
    </span>
  </div>
</section>

<style>
  /* Héroe centrado (`07 §7.10.3` #2): etiqueta + número + metadatos */
  .heroe {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    animation: heroe-aparece var(--dur-4) var(--ease-out) both;
  }

  @keyframes heroe-aparece {
    from {
      opacity: 0;
      transform: scale(0.98);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Etiqueta del dato (`07 §7.9.13`): `caption` 600 `ink-3`, no un kicker */
  .heroe__etiqueta {
    font-size: 0.8125rem;
    font-weight: 600;
    line-height: 1.4;
    color: var(--color-ink-3);
  }

  /* Número: `display` (clamp 44–56), 800, tabular (`07 §7.4.2`) */
  .heroe__numero {
    margin-top: 2px;
    font-size: clamp(2.75rem, 13vw, 3.5rem);
    font-weight: 800;
    line-height: 1.02;
    letter-spacing: -0.02em;
    color: var(--color-ink);
  }

  /* Fila de metadatos (`07 §7.9.13`): gap 16, envuelve si no cabe */
  .heroe__meta {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 4px 16px;
    margin-top: 10px;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.4;
    color: var(--color-ink-2);
  }

  .heroe__escala {
    white-space: nowrap;
  }

  .heroe__tiempo {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  /* El icono de reloj es `ink-3` (`07 §7.9.13`), decorativo (`aria-hidden`) */
  .heroe__reloj {
    display: block;
    flex: none;
    color: var(--color-ink-3);
  }

  /* `reduced-motion`: el héroe aparece en su valor final (`07 §7.7.4`) */
  @media (prefers-reduced-motion: reduce) {
    .heroe {
      animation: none;
    }
  }
</style>
