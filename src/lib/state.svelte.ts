/**
 * Estado de la aplicación (`06 §6.2`, `03 §3.3`): **única fuente de verdad** del
 * flujo `home | quiz | resultados` (`04 §4.1`, `05 §5.7`) y de las reglas de
 * foco y título entre pantallas (`07 §7.12` (11)).
 *
 * Vive en un módulo `.svelte.ts`: una clase con campos `$state` compartida por
 * toda la app (práctica recomendada de Svelte 5 frente a los stores).
 */

import { tick } from 'svelte';
import { CONFIG_INICIAL } from './config';
import { guardarNombre, leerNombre, MAX_NOMBRE } from './storage';
import type { ConfigQuiz, Intento, Resultado } from './types';

/** Pantallas de la aplicación (`06 §6.2`). */
export type Pantalla = 'home' | 'quiz' | 'resultados';

/** Título del documento por pantalla (`07 §7.12` (11)). */
export const TITULOS: Record<Pantalla, string> = {
  home: 'Simulador · Home',
  quiz: 'Simulador · Quiz',
  resultados: 'Simulador · Resultados',
};

/**
 * Copia mutable de los valores iniciales: `CONFIG_INICIAL` (Plan 03) está
 * congelado en profundidad y el panel necesita editar sus campos (`02 §RF-10`).
 */
export function configInicial(): ConfigQuiz {
  return { ...CONFIG_INICIAL, puntos: { ...CONFIG_INICIAL.puntos } };
}

export class EstadoApp {
  /** Pantalla visible. */
  pantalla = $state<Pantalla>('home');

  /** Configuración del panel; se conserva al volver de resultados (RF-10). */
  config = $state<ConfigQuiz>(configInicial());

  /** Nombre guardado (`02 §RF-01.1`, `§RF-02`); `null` → saludo «Hola». */
  nombre = $state<string | null>(leerNombre());

  /** Intento generado o visualizado; `null` antes del primer «Iniciar quiz» (RF-09). */
  intento = $state<Intento | null>(null);

  /** Resultados del último intento (Plan 07). */
  resultado = $state<Resultado | null>(null);

  constructor() {
    // Título inicial (el que queda tras la primera carga, sin navegación).
    if (typeof document !== 'undefined') this.sincronizarTitulo();
  }

  private sincronizarTitulo(): void {
    document.title = TITULOS[this.pantalla];
  }

  /**
   * Cambia de pantalla (`07 §7.12` (11)): scroll al inicio, `document.title`
   * acorde y foco al `<h1>` de la pantalla nueva (`tabindex="-1"`, sin anillo
   * visible para este movimiento programático).
   */
  async irA(destino: Pantalla): Promise<void> {
    this.pantalla = destino;
    this.sincronizarTitulo();
    window.scrollTo(0, 0);
    await tick();
    document.querySelector<HTMLElement>('[data-screen-title]')?.focus();
  }

  /**
   * Persiste y aplica el nombre (`02 §RF-01.4`, `§RF-02`, E-08): `trim`, tope
   * de 30 caracteres y vacío → sin nombre («Hola»).
   */
  aplicarNombre(texto: string): void {
    guardarNombre(texto);
    const limpio = texto.trim();
    this.nombre = limpio === '' ? null : limpio.slice(0, MAX_NOMBRE);
  }

  /**
   * «Home» de resultados (`02 §RF-21`, `§RF-10`, `§RN-05`): descarta el intento
   * visualizado y su resultado —el próximo «Iniciar quiz» genera uno nuevo— y
   * vuelve al panel **conservando** nombre y configuración.
   */
  async cerrarResultados(): Promise<void> {
    this.intento = null;
    this.resultado = null;
    await this.irA('home');
  }
}

/** Instancia única que comparten todas las pantallas. */
export const estado = new EstadoApp();
