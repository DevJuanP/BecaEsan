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
