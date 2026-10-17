/**
 * Generación aleatoria del intento (`02 §RN-01`–`§RN-06`, `03 §3.3`).
 *
 * Módulo puro: sin DOM, sin estado entre llamadas (`06 §6.1`). La
 * aleatoriedad entra por un `rng` inyectable para poder probarlo de forma
 * determinista.
 */

import type { Area, BloqueIntento, ConfigQuiz, Intento, Letra, Pregunta, Tema } from './types';

/** Fuente de aleatoriedad inyectable (`Math.random` por defecto). */
export type Rng = () => number;

/** Temas disponibles por área (`02 §RN-02`). */
const LIMITES_TEMAS: Record<Area, number> = { matematico: 17, verbal: 11 };

/** Preguntas por tema del material (`03 §3.1`). */
const PREGUNTAS_POR_TEMA = 5;

/** Mezcla Fisher–Yates (`02 §RN-02`); copia, no muta la entrada. */
function barajar<T>(items: readonly T[], rng: Rng): T[] {
  const copia = [...items];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const tirada = Math.floor(rng() * (i + 1));
    const j = Math.min(i, Math.max(0, tirada));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/** Áreas que participan en el intento según el modo (`02 §RF-03`). */
function areasDeModo(modo: ConfigQuiz['modo']): Area[] {
  if (modo === 'solo-rm') return ['matematico'];
  if (modo === 'solo-rv') return ['verbal'];
  return ['matematico', 'verbal'];
}

function validarEnteroEnRango(campo: string, valor: number, min: number, max: number): void {
  if (!Number.isInteger(valor) || valor < min || valor > max) {
    throw new Error(
      `Configuración inválida: ${campo} debe ser un entero entre ${min} y ${max} (recibido: ${valor})`,
    );
  }
}

/** Defensa de entrada (`02 §RF-04`–`§RF-06`): rangos de k y q y disponibilidad del banco. */
function validar(config: ConfigQuiz, areas: Area[], banco: readonly Tema[]): void {
  validarEnteroEnRango('temasRM', config.temasRM, 1, LIMITES_TEMAS.matematico);
  validarEnteroEnRango('temasRV', config.temasRV, 1, LIMITES_TEMAS.verbal);
  validarEnteroEnRango('preguntasPorTema', config.preguntasPorTema, 1, PREGUNTAS_POR_TEMA);
  for (const area of areas) {
    const k = area === 'matematico' ? config.temasRM : config.temasRV;
    const disponibles = banco.filter((tema) => tema.area === area).length;
    if (k > disponibles) {
      throw new Error(
        `Configuración inválida: se pidieron ${k} temas de ${area} pero el banco solo tiene ${disponibles}`,
      );
    }
  }
}

/** Copia profunda de la pregunta; `numero` pasa a ser el número a mostrar (1..q). */
function copiarPregunta(pregunta: Pregunta, numero: number): Pregunta {
  return {
    id: pregunta.id,
    numero,
    enunciado: pregunta.enunciado,
    opciones: pregunta.opciones.map((opcion) => ({ ...opcion })),
    correcta: pregunta.correcta,
    explicacion: pregunta.explicacion,
  };
}

/** Bloque de un tema: subconjunto de q preguntas y respuestas en blanco (`03 §3.3`). */
function bloqueDeTema(tema: Tema, q: number, rng: Rng): BloqueIntento {
  if (tema.preguntas.length < q) {
    throw new Error(
      `Banco inválido: el tema ${tema.id} tiene ${tema.preguntas.length} preguntas y se pidieron ${q}`,
    );
  }
  // q = 5 → las 5 en orden del archivo (1→5); q < 5 → subconjunto aleatorio (RN-04).
  const elegidas =
    q === PREGUNTAS_POR_TEMA ? tema.preguntas.slice(0, PREGUNTAS_POR_TEMA) : barajar(tema.preguntas, rng).slice(0, q);
  const preguntas = elegidas.map((pregunta, indice) => copiarPregunta(pregunta, indice + 1));
  const respuestas: Record<string, Letra | null> = {};
  for (const pregunta of preguntas) {
    respuestas[pregunta.id] = null;
  }
  return {
    area: tema.area,
    temaId: tema.id,
    titulo: tema.titulo,
    textoComun: tema.textoComun,
    preguntas,
    respuestas,
  };
}

/**
 * Crea el snapshot del intento al pulsar «Iniciar quiz» (`02 §RN-01`–`§RN-06`).
 *
 * - Temas al azar sin repetición por área incluida y en orden barajado (RN-02).
 * - Bloques de RM primero y después los de RV (RN-03).
 * - Preguntas al azar por tema, renumeradas 1..q (RN-04).
 * - Sin memoria entre intentos: función pura (RN-05).
 * - Alternativas sin barajar (RN-06).
 */
export function crearIntento(
  config: ConfigQuiz,
  banco: readonly Tema[],
  rng: Rng = Math.random,
): Intento {
  const areas = areasDeModo(config.modo);
  validar(config, areas, banco);

  const iniciadoEn = Date.now();
  const bloques: BloqueIntento[] = [];
  for (const area of areas) {
    const k = area === 'matematico' ? config.temasRM : config.temasRV;
    const temasArea = barajar(
      banco.filter((tema) => tema.area === area),
      rng,
    ).slice(0, k);
    for (const tema of temasArea) {
      bloques.push(bloqueDeTema(tema, config.preguntasPorTema, rng));
    }
  }

  return {
    id: String(iniciadoEn),
    iniciadoEn,
    config: { ...config, puntos: { ...config.puntos } },
    bloques,
    indiceActual: 0,
    terminadoEn: null,
  };
}
