/** Utilidades de formato (Plan 01 · T-1.6). Las usan los Planes 06–07. */

/** Signo menos tipográfico U+2212 (el del material, 07 §7.4.3). */
const MENOS = '−';

/**
 * Formatea una duración en ms como `m:ss` (RF-16).
 * Si supera 1 hora, usa `h:mm:ss`.
 */
export function formatDuracion(ms: number): string {
  const totalSeg = Math.max(0, Math.floor(ms / 1000));
  const seg = totalSeg % 60;
  const minTotal = Math.floor(totalSeg / 60);
  const dos = (n: number): string => String(n).padStart(2, '0');
  if (minTotal >= 60) {
    return `${Math.floor(minTotal / 60)}:${dos(minTotal % 60)}:${dos(seg)}`;
  }
  return `${minTotal}:${dos(seg)}`;
}

/**
 * Formatea un entero; los negativos usan el signo menos
 * tipográfico U+2212 (E-09, 07 §7.4.3).
 */
export function formatoEntero(n: number): string {
  const entero = Math.trunc(n);
  return entero < 0 ? `${MENOS}${Math.abs(entero)}` : String(entero);
}

/**
 * Formatea un entero con **signo explícito** para la escala visible de
 * resultados (`02 §RF-20.1`, `07 §7.9.13`, `§7.4.3`): «+5», «0», «−2».
 * El cero nunca lleva signo (E-09).
 */
export function formatoConSigno(n: number): string {
  const entero = Math.trunc(n);
  return entero > 0 ? `+${entero}` : formatoEntero(entero);
}

/** Formato numérico es-PE (`07 §7.4.3`): separador de millares del locale. */
const FORMATO_ES_PE = new Intl.NumberFormat('es-PE');

/**
 * Formatea un **puntaje** con el formato numérico es-PE (`07 §7.4.3`): enteros
 * sin decimales, con el separador de millares del locale (los puntajes de
 * resultados pueden superar 999 con configuraciones extremas) y el signo menos
 * tipográfico U+2212 en los negativos (E-09; `Intl` emite el guion ASCII).
 */
export function formatoPuntaje(n: number): string {
  return FORMATO_ES_PE.format(Math.trunc(n)).replace('-', MENOS);
}

/** Rango permitido de los puntajes configurables (`02 §RF-07`): −999…999. */
export const LIMITE_ENTERO = 999;

/**
 * Interpreta el texto de un campo de puntaje (`02 §RF-07`, `07 §7.9.3`).
 * Acepta un signo inicial (`-` ASCII o el menos tipográfico `−`, U+2212) y
 * dígitos, con espacios externos recortados; rechaza vacío, no numérico
 * (decimales, notación científica, comas, signos repetidos) y valores fuera
 * de −999…999. Devuelve `null` cuando el texto no es un entero válido.
 */
export function parsearEntero(texto: string): number | null {
  const coincidencia = /^([-−]?)(\d+)$/.exec(texto.trim());
  if (!coincidencia) return null;
  const magnitud = Number(coincidencia[2]);
  if (magnitud > LIMITE_ENTERO) return null;
  const valor = coincidencia[1] ? -magnitud : magnitud;
  // Normaliza `-0` a `0` (E-09: el cero no lleva signo).
  return valor === 0 ? 0 : valor;
}
