/**
 * Tipos de `03-modelo-de-datos.md`:
 * - modelo normalizado del banco de preguntas (§3.2), que consume la app y
 *   sirve de referencia al parser de `scripts/build-questions.mjs`;
 * - estado en tiempo de ejecución (§3.3): configuración, intento y resultados.
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

/* -------------------------------------------------------------------------- */
/* Estado en tiempo de ejecución (`03 §3.3`)                                   */
/* -------------------------------------------------------------------------- */

/** Modo del quiz (`02 §RF-03`). */
export type Modo = 'solo-rm' | 'solo-rv' | 'completo';

/** Configuración del panel Home (`03 §3.3`). */
export interface ConfigQuiz {
  modo: Modo;
  temasRM: number; // 1..17
  temasRV: number; // 1..11
  preguntasPorTema: number; // 1..5 (única para ambas áreas)
  puntos: {
    correcta: number; // default 5
    noRespondida: number; // default 0
    incorrecta: number; // default -2
  };
}

/** Bloque del intento: una temática con sus preguntas elegidas (`03 §3.3`). */
export interface BloqueIntento {
  area: Area;
  temaId: string;
  titulo: string;
  textoComun: string | null; // copiado del tema si aplica
  preguntas: Pregunta[]; // subconjunto elegido (q), en el orden a mostrar
  respuestas: Record<string, Letra | null>; // clave: pregunta.id
}

/** Intento en ejecución: snapshot creado al pulsar «Iniciar quiz». */
export interface Intento {
  id: string; // generado al iniciar (p. ej. timestamp)
  iniciadoEn: number; // epoch ms
  config: ConfigQuiz; // copia (snapshot) de la configuración
  bloques: BloqueIntento[]; // orden final: RM barajado y luego RV barajado
  indiceActual: number; // bloque visible (0-based)
  terminadoEn: number | null; // epoch ms al ver resultados (para el tiempo total)
}

/** Resultado por área incluida (`03 §3.3`, derivado y no persistido). */
export interface ResultadoArea {
  area: Area;
  total: number;
  correctas: number;
  incorrectas: number;
  noRespondidas: number;
  puntaje: number; // fórmula RN-08
  porcentajes: {
    aciertos: number; // enteros, suman 100 (RN-09)
    erroneas: number;
    noRespondidas: number;
  };
}

/** Resultado del intento (`03 §3.3`). */
export interface Resultado {
  puntajeTotal: number;
  areas: ResultadoArea[]; // solo áreas incluidas en el intento
  duracionMs: number; // terminadoEn - iniciadoEn
  escala: { correcta: number; noRespondida: number; incorrecta: number };
}
