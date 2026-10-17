import { describe, expect, it } from 'vitest';
import { CONFIG_INICIAL, etiquetaModo, resumenConfig, validarConfig } from './config';
import type { ConfigQuiz } from './types';

/** Copia mutable del default para las pruebas. */
function conPuntajes(puntos: Partial<ConfigQuiz['puntos']>): ConfigQuiz {
  return {
    modo: 'completo',
    temasRM: 8,
    temasRV: 5,
    preguntasPorTema: 2,
    puntos: { ...CONFIG_INICIAL.puntos, ...puntos },
  };
}

describe('CONFIG_INICIAL (03 §3.3, RF-04–RF-07)', () => {
  it('usa los valores iniciales del modelo', () => {
    expect(CONFIG_INICIAL).toEqual({
      modo: 'completo',
      temasRM: 8,
      temasRV: 5,
      preguntasPorTema: 2,
      puntos: { correcta: 5, noRespondida: 0, incorrecta: -2 },
    });
  });

  it('está congelado en profundidad (nadie muta el default)', () => {
    expect(Object.isFrozen(CONFIG_INICIAL)).toBe(true);
    expect(Object.isFrozen(CONFIG_INICIAL.puntos)).toBe(true);
  });
});

describe('validarConfig (RF-07)', () => {
  it('acepta el default', () => {
    expect(validarConfig(CONFIG_INICIAL)).toEqual({ valida: true, camposEnError: [] });
  });

  it('acepta los bordes −999 y 999', () => {
    expect(validarConfig(conPuntajes({ correcta: 999, noRespondida: -999 })).valida).toBe(true);
  });

  it('rechaza 1000 y −1000 con el campo en error', () => {
    expect(validarConfig(conPuntajes({ correcta: 1000 })).camposEnError).toEqual(['correcta']);
    expect(validarConfig(conPuntajes({ incorrecta: -1000 })).camposEnError).toEqual(['incorrecta']);
  });

  it('rechaza valores no enteros o vacíos (NaN)', () => {
    expect(validarConfig(conPuntajes({ correcta: 2.5 })).camposEnError).toEqual(['correcta']);
    expect(validarConfig(conPuntajes({ noRespondida: Number.NaN })).camposEnError).toEqual([
      'noRespondida',
    ]);
  });

  it('reporta todos los campos en error en orden fijo', () => {
    const config = conPuntajes({ correcta: Number.NaN, noRespondida: 1000, incorrecta: -1000 });
    expect(validarConfig(config)).toEqual({
      valida: false,
      camposEnError: ['correcta', 'noRespondida', 'incorrecta'],
    });
  });
});

describe('resumenConfig (RF-08, 07 §7.11)', () => {
  it('completo por defecto: «Completo · 13 temas · 26 preguntas»', () => {
    expect(resumenConfig(CONFIG_INICIAL)).toBe('Completo · 13 temas · 26 preguntas');
  });

  it('solo RM excluye los temas de RV del resumen', () => {
    expect(resumenConfig({ ...CONFIG_INICIAL, modo: 'solo-rm' })).toBe(
      'Solo Matemático · 8 temas · 16 preguntas',
    );
  });

  it('solo RV excluye los temas de RM del resumen', () => {
    expect(resumenConfig({ ...CONFIG_INICIAL, modo: 'solo-rv' })).toBe(
      'Solo Verbal · 5 temas · 10 preguntas',
    );
  });

  it('recalcula con sliders cambiados: 17 temas × 5 preguntas', () => {
    expect(
      resumenConfig({ ...CONFIG_INICIAL, modo: 'solo-rm', temasRM: 17, preguntasPorTema: 5 }),
    ).toBe('Solo Matemático · 17 temas · 85 preguntas');
  });

  it('con k = 1 y q = 1 usa la plantilla literal del deck (07 §7.11)', () => {
    // El deck no define variante singular («1 tema»); se mantiene la plantilla exacta.
    expect(resumenConfig({ ...CONFIG_INICIAL, modo: 'solo-rm', temasRM: 1, preguntasPorTema: 1 })).toBe(
      'Solo Matemático · 1 temas · 1 preguntas',
    );
  });
});

describe('etiquetaModo (07 §7.11)', () => {
  it('nombra los tres modos del deck', () => {
    expect(etiquetaModo('solo-rm')).toBe('Solo Matemático');
    expect(etiquetaModo('solo-rv')).toBe('Solo Verbal');
    expect(etiquetaModo('completo')).toBe('Completo');
  });
});
