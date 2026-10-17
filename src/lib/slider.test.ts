import { describe, expect, it } from 'vitest';
import { indiceDesdeX } from './slider';

/** Track de 340 px con 17 franjas de 20 px exactos. */
const track17 = { left: 100, width: 340 };

describe('indiceDesdeX (RF-04/05/06, 07 §7.8.4)', () => {
  it('mapea cada franja a su índice 0-based', () => {
    expect(indiceDesdeX(100, track17, 17)).toBe(0);
    expect(indiceDesdeX(119.9, track17, 17)).toBe(0);
    expect(indiceDesdeX(120, track17, 17)).toBe(1);
    expect(indiceDesdeX(219.9, track17, 17)).toBe(5);
    expect(indiceDesdeX(220, track17, 17)).toBe(6);
    expect(indiceDesdeX(439.9, track17, 17)).toBe(16);
  });

  it('hace clamping fuera del track y en el borde derecho exacto', () => {
    expect(indiceDesdeX(-500, track17, 17)).toBe(0);
    expect(indiceDesdeX(0, track17, 17)).toBe(0);
    expect(indiceDesdeX(440, track17, 17)).toBe(16);
    expect(indiceDesdeX(900, track17, 17)).toBe(16);
  });

  it('reparte franjas de 5 (q de preguntas) y de 11 (temas RV)', () => {
    const track5 = { left: 0, width: 340 }; // 68 px por franja
    expect(indiceDesdeX(0, track5, 5)).toBe(0);
    expect(indiceDesdeX(67.9, track5, 5)).toBe(0);
    expect(indiceDesdeX(68, track5, 5)).toBe(1);
    expect(indiceDesdeX(339.9, track5, 5)).toBe(4);

    const track11 = { left: 20, width: 330 }; // 30 px por franja
    expect(indiceDesdeX(20, track11, 11)).toBe(0);
    expect(indiceDesdeX(49.9, track11, 11)).toBe(0);
    expect(indiceDesdeX(50, track11, 11)).toBe(1);
    expect(indiceDesdeX(350, track11, 11)).toBe(10);
  });

  it('con un solo segmento devuelve siempre 0', () => {
    expect(indiceDesdeX(0, track17, 1)).toBe(0);
    expect(indiceDesdeX(300, track17, 1)).toBe(0);
    expect(indiceDesdeX(999, track17, 1)).toBe(0);
  });

  it('devuelve 0 con datos degenerados (ancho 0, NaN, max inválido)', () => {
    expect(indiceDesdeX(100, { left: 100, width: 0 }, 17)).toBe(0);
    expect(indiceDesdeX(Number.NaN, track17, 17)).toBe(0);
    expect(indiceDesdeX(100, { left: Number.NaN, width: 340 }, 17)).toBe(0);
    expect(indiceDesdeX(100, { left: 100, width: Number.NaN }, 17)).toBe(0);
    expect(indiceDesdeX(100, track17, 0)).toBe(0);
    expect(indiceDesdeX(100, track17, Number.NaN)).toBe(0);
  });
});
