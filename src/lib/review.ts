/**
 * Derivaciones de la revisión de respuestas (`02 §RF-22`): marcan cada
 * alternativa del material como correcta y/o elegida por el usuario. Módulo
 * puro: no conoce el DOM ni el estado de la app.
 */

import type { Letra, Pregunta } from './types';

/** Alternativa preparada para la revisión de resultados. */
export interface OpcionRevisada {
  letra: Letra;
  texto: string;
  /** Coincide con la clave de la pregunta. */
  esCorrecta: boolean;
  /** Fue la alternativa marcada por el usuario (`false` si quedó en blanco). */
  esSeleccionada: boolean;
}

/** Marca las alternativas de una pregunta según su clave y la respuesta dada. */
export function opcionesRevisadas(pregunta: Pregunta, respuesta: Letra | null): OpcionRevisada[] {
  return pregunta.opciones.map((opcion) => ({
    ...opcion,
    esCorrecta: opcion.letra === pregunta.correcta,
    esSeleccionada: opcion.letra === respuesta,
  }));
}
