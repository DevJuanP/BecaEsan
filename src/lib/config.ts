/**
 * Configuración del panel Home: defaults, validación de puntajes y resumen
 * estimado (`02 §RF-07`, `§RF-08`, `03 §3.3`).
 */

import type { ConfigQuiz, Modo } from './types';

/** Congela en profundidad para que el default compartido nunca se mute. */
function congelarProfundo<T extends object>(valor: T): T {
  for (const hijo of Object.values(valor)) {
    if (hijo !== null && typeof hijo === 'object') congelarProfundo(hijo as object);
  }
  return Object.freeze(valor);
}

/** Valores iniciales de la primera apertura (`03 §3.3`, `02 §RF-04`–`§RF-07`). */
export const CONFIG_INICIAL: ConfigQuiz = congelarProfundo<ConfigQuiz>({
  modo: 'completo',
  temasRM: 8,
  temasRV: 5,
  preguntasPorTema: 2,
  puntos: { correcta: 5, noRespondida: 0, incorrecta: -2 },
});

/** Campos de puntaje configurables (`02 §RF-07`). */
export type CampoPuntaje = 'correcta' | 'noRespondida' | 'incorrecta';

/** Campos en el orden en que se muestran en el panel. */
const CAMPOS_PUNTAJE: readonly CampoPuntaje[] = ['correcta', 'noRespondida', 'incorrecta'];

/** Rango permitido de puntajes (`02 §RF-07`). */
const LIMITE_PUNTAJE = 999;

/** Resultado de `validarConfig`. */
export interface ValidacionConfig {
  /** true si la configuración permite iniciar el quiz. */
  valida: boolean;
  /** Campos de puntaje con valor inválido, como identificadores (la UI pone el mensaje de `07 §7.11`). */
  camposEnError: CampoPuntaje[];
}

/**
 * Valida los puntajes (`02 §RF-07`): enteros dentro de −999…999. Un valor
 * `NaN` (campo vacío o no numérico en la UI) también es inválido.
 */
export function validarConfig(config: ConfigQuiz): ValidacionConfig {
  const camposEnError = CAMPOS_PUNTAJE.filter((campo) => {
    const valor = config.puntos[campo];
    return !Number.isInteger(valor) || valor < -LIMITE_PUNTAJE || valor > LIMITE_PUNTAJE;
  });
  return { valida: camposEnError.length === 0, camposEnError };
}

/** Nombres de modo del deck de microcopy (`07 §7.11`). */
const NOMBRES_MODO: Record<Modo, string> = {
  'solo-rm': 'Solo Matemático',
  'solo-rv': 'Solo Verbal',
  completo: 'Completo',
};

/** Nombre visible del modo (`07 §7.11`): «Solo Matemático», «Solo Verbal» o «Completo». */
export function etiquetaModo(modo: Modo): string {
  return NOMBRES_MODO[modo];
}

/**
 * Resumen estimado en vivo (`02 §RF-08`, `07 §7.11`):
 * «{Modo} · {k} temas · {q} preguntas», con k = temas de las áreas incluidas
 * y q = k × preguntasPorTema.
 */
export function resumenConfig(config: ConfigQuiz): string {
  const incluyeRM = config.modo !== 'solo-rv';
  const incluyeRV = config.modo !== 'solo-rm';
  const temas = (incluyeRM ? config.temasRM : 0) + (incluyeRV ? config.temasRV : 0);
  const preguntas = temas * config.preguntasPorTema;
  return `${etiquetaModo(config.modo)} · ${temas} temas · ${preguntas} preguntas`;
}
