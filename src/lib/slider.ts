/**
 * Geometría del slider segmentado (`07 §7.8`, Anexo B `§7.18`).
 * Funciones puras, sin DOM: las usa `Slider.svelte` y las prueba Vitest.
 */

/** Rectángulo del track en coordenadas de viewport (lo que devuelve `getBoundingClientRect`). */
export interface RectTrack {
  left: number;
  width: number;
}

/**
 * Índice (0-based) del segmento que corresponde a la coordenada X del puntero,
 * con las franjas repartidas uniformemente sobre el ancho del track (Anexo B:
 * `floor((x − left) / width · max)`) y *clamping* a [0, max−1] en los bordes.
 * Devuelve 0 cuando el track no tiene ancho o los números no son finitos
 * (evita índices `NaN` durante el primer frame).
 */
export function indiceDesdeX(x: number, rect: RectTrack, max: number): number {
  if (!Number.isFinite(x) || !Number.isFinite(rect.left) || !Number.isFinite(rect.width)) {
    return 0;
  }
  if (!Number.isInteger(max) || max < 1 || rect.width <= 0) return 0;
  const indice = Math.floor(((x - rect.left) / rect.width) * max);
  return Math.min(max - 1, Math.max(0, indice));
}
