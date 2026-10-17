import { describe, expect, it } from 'vitest';
import type { StorageLike } from './storage';
import { CLAVE_NOMBRE, MAX_NOMBRE, borrarNombre, guardarNombre, leerNombre } from './storage';

/** Almacén en memoria que registra las operaciones (pruebas sin navegador). */
function almacenFalso(inicial: Record<string, string> = {}): StorageLike & { datos: Map<string, string> } {
  const datos = new Map(Object.entries(inicial));
  return {
    datos,
    getItem: (clave) => datos.get(clave) ?? null,
    setItem: (clave, valor) => {
      datos.set(clave, valor);
    },
    removeItem: (clave) => {
      datos.delete(clave);
    },
  };
}

/** Almacenamiento que lanza en toda operación (Safari en modo restringido). */
const almacenRoto: StorageLike = {
  getItem() {
    throw new Error('sin acceso');
  },
  setItem() {
    throw new Error('sin acceso');
  },
  removeItem() {
    throw new Error('sin acceso');
  },
};

describe('storage: nombre en localStorage (RF-02, RNF-04, 03 §3.5)', () => {
  it('usa la clave "beca-esan.nombre" (03 §3.5)', () => {
    const almacen = almacenFalso();
    guardarNombre('Ana', almacen);
    expect(almacen.datos.get(CLAVE_NOMBRE)).toBe('Ana');
    expect(CLAVE_NOMBRE).toBe('beca-esan.nombre');
  });

  it('guarda y lee el nombre (ida y vuelta)', () => {
    const almacen = almacenFalso();
    guardarNombre('Ana', almacen);
    expect(leerNombre(almacen)).toBe('Ana');
  });

  it('recorta espacios al inicio y al final (RF-01.4)', () => {
    const almacen = almacenFalso();
    guardarNombre('  Ana Lucía  ', almacen);
    expect(leerNombre(almacen)).toBe('Ana Lucía');
  });

  it('limita a 30 caracteres al guardar (RF-01.4)', () => {
    const almacen = almacenFalso();
    guardarNombre('a'.repeat(40), almacen);
    expect(leerNombre(almacen)).toBe('a'.repeat(MAX_NOMBRE));
  });

  it('borra el nombre si queda vacío o solo con espacios (E-08)', () => {
    const almacen = almacenFalso();
    guardarNombre('Ana', almacen);
    guardarNombre('   ', almacen);
    expect(leerNombre(almacen)).toBeNull();
    expect(almacen.datos.has(CLAVE_NOMBRE)).toBe(false);
  });

  it('devuelve null si nunca se guardó nada', () => {
    expect(leerNombre(almacenFalso())).toBeNull();
  });

  it('devuelve null si el valor guardado está vacío (a mano)', () => {
    expect(leerNombre(almacenFalso({ [CLAVE_NOMBRE]: '   ' }))).toBeNull();
  });

  it('borrarNombre elimina el guardado', () => {
    const almacen = almacenFalso();
    guardarNombre('Ana', almacen);
    borrarNombre(almacen);
    expect(leerNombre(almacen)).toBeNull();
  });

  it('no lanza si el almacenamiento falla en cada operación (RNF-04)', () => {
    expect(() => guardarNombre('Ana', almacenRoto)).not.toThrow();
    expect(() => borrarNombre(almacenRoto)).not.toThrow();
    expect(leerNombre(almacenRoto)).toBeNull();
  });

  it('funciona sin almacenamiento disponible (entorno sin localStorage)', () => {
    expect(leerNombre()).toBeNull();
    expect(() => guardarNombre('Ana', null)).not.toThrow();
    expect(() => borrarNombre(null)).not.toThrow();
  });
});
