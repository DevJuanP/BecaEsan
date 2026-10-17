/**
 * Persistencia local del nombre del usuario (`02 §RF-02`, `03 §3.5`,
 * `01 §RNF-04`). Nunca rompe la app: si el almacenamiento no está disponible
 * (p. ej. Safari en modo restringido), todo falla en silencio.
 */

/** Subconjunto de `Storage` que basta para esta capa (inyectable en pruebas). */
export interface StorageLike {
  getItem(clave: string): string | null;
  setItem(clave: string, valor: string): void;
  removeItem(clave: string): void;
}

/** Clave de persistencia del nombre (`03 §3.5`). */
export const CLAVE_NOMBRE = 'beca-esan.nombre';

/** Longitud máxima del nombre (`02 §RF-01.4`). */
export const MAX_NOMBRE = 30;

/** `localStorage` si existe; `null` si no (o si acceder a él lanza). */
function almacenPorDefecto(): StorageLike | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

/**
 * Lee el nombre guardado, recortado de espacios; `null` si no hay nombre,
 * está vacío (solo espacios) o el almacenamiento no está disponible.
 */
export function leerNombre(almacen: StorageLike | null = almacenPorDefecto()): string | null {
  if (almacen === null) return null;
  try {
    const guardado = almacen.getItem(CLAVE_NOMBRE);
    if (guardado === null) return null;
    const nombre = guardado.trim();
    return nombre === '' ? null : nombre;
  } catch {
    return null;
  }
}

/**
 * Guarda el nombre con `trim` y el límite de 30 caracteres; si queda vacío,
 * borra el guardado (`02 §RF-01.4`, E-08).
 */
export function guardarNombre(nombre: string, almacen: StorageLike | null = almacenPorDefecto()): void {
  if (almacen === null) return;
  const limpio = nombre.trim().slice(0, MAX_NOMBRE);
  if (limpio === '') {
    borrarNombre(almacen);
    return;
  }
  try {
    almacen.setItem(CLAVE_NOMBRE, limpio);
  } catch {
    // Sin acceso al almacenamiento: la app sigue funcionando (RNF-04).
  }
}

/** Elimina el nombre guardado (el saludo vuelve a «Hola»). */
export function borrarNombre(almacen: StorageLike | null = almacenPorDefecto()): void {
  if (almacen === null) return;
  try {
    almacen.removeItem(CLAVE_NOMBRE);
  } catch {
    // Sin acceso al almacenamiento: nada que borrar.
  }
}
