/**
 * Modelo normalizado del banco de preguntas (`03 §3.2`).
 *
 * Lo consume la app y sirve de referencia al parser de
 * `scripts/build-questions.mjs`. Los tipos del estado en tiempo de ejecución
 * (configuración, intento y resultados, `03 §3.3`) llegan con el Plan 03.
 */

/** Área del temario. */
export type Area = 'matematico' | 'verbal';

/** Letra de una alternativa (A–E). */
export type Letra = 'A' | 'B' | 'C' | 'D' | 'E';

/** Alternativa de una pregunta. */
export interface Opcion {
  letra: Letra;
  texto: string; // «6», «≈ 3,14 cm²», «microscopio», …
}

/** Pregunta del material. */
export interface Pregunta {
  id: string; // "{temaId}#q{n}" — estable
  numero: number; // 1..5 (orden dentro del archivo)
  enunciado: string;
  opciones: Opcion[]; // exactamente 5, en orden A..E
  correcta: Letra; // clave del material
  explicacion: string; // se extrae aunque la v1 no la muestre
}

/** Temática del banco: 1 archivo de `docs/preguntas/` = 1 tema. */
export interface Tema {
  id: string; // "razonamiento-matematico/01-razones-y-proporciones"
  area: Area;
  numero: number; // 1..17 (RM) / 1..11 (RV), según el nombre del archivo
  titulo: string; // «Razones y proporciones»
  textoComun: string | null; // texto largo compartido (solo Comprensión de lectura)
  preguntas: Pregunta[]; // exactamente 5
}
