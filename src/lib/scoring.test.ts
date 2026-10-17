import { describe, expect, it } from 'vitest';
import { calcularResultado, clasificarRespuesta } from './scoring';
import type { Area, BloqueIntento, ConfigQuiz, Intento, Letra, Pregunta, Tema } from './types';

const LETRAS: Letra[] = ['A', 'B', 'C', 'D', 'E'];

const ESCALA: ConfigQuiz['puntos'] = { correcta: 5, noRespondida: 0, incorrecta: -2 };

function rngSembrado(semilla: number): () => number {
  let estado = semilla >>> 0;
  return () => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function crearPregunta(id: string, numero: number, correcta: Letra = 'A'): Pregunta {
  return {
    id,
    numero,
    enunciado: `Enunciado ${id}`,
    opciones: LETRAS.map((letra) => ({ letra, texto: `Opción ${letra}` })),
    correcta,
    explicacion: `Explicación ${id}`,
  };
}

/** Bloque sintético de `cantidad` preguntas, todas con la misma clave. */
function bloquePrueba(area: Area, cantidad: number, correcta: Letra = 'A'): BloqueIntento {
  const temaId = `tema/${area}-${cantidad}`;
  const preguntas = Array.from({ length: cantidad }, (_, i) => crearPregunta(`${temaId}#q${i + 1}`, i + 1, correcta));
  const respuestas: Record<string, Letra | null> = {};
  for (const pregunta of preguntas) respuestas[pregunta.id] = null;
  return { area, temaId, titulo: 'Tema de prueba', textoComun: null, preguntas, respuestas };
}

function intentoPrueba(
  bloques: BloqueIntento[],
  opciones: { puntos?: ConfigQuiz['puntos']; terminadoEn?: number | null } = {},
): Intento {
  return {
    id: 'intento-de-prueba',
    iniciadoEn: 1_000,
    config: { modo: 'completo', temasRM: 1, temasRV: 1, preguntasPorTema: 1, puntos: opciones.puntos ?? { ...ESCALA } },
    bloques,
    indiceActual: 0,
    terminadoEn: opciones.terminadoEn === undefined ? 61_000 : opciones.terminadoEn,
  };
}

/** Responde el bloque en orden; `null` deja la pregunta en blanco. */
function responder(bloque: BloqueIntento, letras: (Letra | null)[]): void {
  bloque.preguntas.forEach((pregunta, indice) => {
    bloque.respuestas[pregunta.id] = letras[indice] ?? null;
  });
}

describe('clasificarRespuesta — RN-07: clasificación', () => {
  it('clasifica la letra elegida frente a la clave', () => {
    const pregunta = crearPregunta('tema#q1', 1, 'C');
    expect(clasificarRespuesta(pregunta, 'C')).toBe('correcta');
    expect(clasificarRespuesta(pregunta, 'A')).toBe('incorrecta');
    expect(clasificarRespuesta(pregunta, null)).toBe('noRespondida');
  });
});

describe('calcularResultado — RN-07: clasificación', () => {
  it('clasifica correcta / incorrecta / no respondida', () => {
    const bloque = bloquePrueba('matematico', 3);
    responder(bloque, ['A', 'C', null]);
    const resultado = calcularResultado(intentoPrueba([bloque]));
    expect(resultado.areas[0]).toMatchObject({ total: 3, correctas: 1, incorrectas: 1, noRespondidas: 1 });
  });

  it('E-07: al editar respuestas, el cálculo final usa las editadas', () => {
    const bloque = bloquePrueba('matematico', 3);
    responder(bloque, ['B', 'C', null]);
    const antes = calcularResultado(intentoPrueba([bloque]));
    expect(antes.areas[0]).toMatchObject({ correctas: 0, incorrectas: 2, noRespondidas: 1 });

    responder(bloque, ['A', 'C', 'A']); // «Atrás» + editar
    const despues = calcularResultado(intentoPrueba([bloque]));
    expect(despues.areas[0]).toMatchObject({ correctas: 2, incorrectas: 1, noRespondidas: 0 });
  });

  it('trata una respuesta ausente del mapa como no respondida', () => {
    const bloque = bloquePrueba('matematico', 2);
    delete bloque.respuestas[bloque.preguntas[0].id];
    const resultado = calcularResultado(intentoPrueba([bloque]));
    expect(resultado.areas[0]).toMatchObject({ correctas: 0, incorrectas: 0, noRespondidas: 2 });
  });
});

describe('calcularResultado — RN-08: puntaje', () => {
  it('aplica la escala: correctas×pc + no respondidas×pnr + incorrectas×pi', () => {
    const bloque = bloquePrueba('matematico', 4);
    responder(bloque, ['A', 'A', 'D', null]);
    const resultado = calcularResultado(intentoPrueba([bloque]));
    expect(resultado.areas[0].puntaje).toBe(2 * 5 + 1 * 0 + 1 * -2);
    expect(resultado.puntajeTotal).toBe(8);
    expect(resultado.escala).toEqual(ESCALA);
  });

  it('E-09: el puntaje negativo se aplica tal cual y el total puede ser negativo', () => {
    const bloque = bloquePrueba('matematico', 3);
    responder(bloque, ['B', 'B', 'B']);
    const resultado = calcularResultado(intentoPrueba([bloque], { puntos: { correcta: 5, noRespondida: 0, incorrecta: -3 } }));
    expect(resultado.areas[0].puntaje).toBe(-9);
    expect(resultado.puntajeTotal).toBe(-9);
  });

  it('el puntaje total es la suma de las áreas incluidas', () => {
    const rm = bloquePrueba('matematico', 2);
    const rv = bloquePrueba('verbal', 1);
    responder(rm, ['A', 'A']);
    responder(rv, ['B']);
    const resultado = calcularResultado(intentoPrueba([rm, rv]));
    expect(resultado.areas.map((area) => area.puntaje)).toEqual([10, -2]);
    expect(resultado.puntajeTotal).toBe(8);
  });

  it('E-05: con escala 0/0/0 el puntaje es 0 y los porcentajes se calculan igual', () => {
    const bloque = bloquePrueba('matematico', 3);
    responder(bloque, ['A', 'A', 'B']);
    const resultado = calcularResultado(intentoPrueba([bloque], { puntos: { correcta: 0, noRespondida: 0, incorrecta: 0 } }));
    expect(resultado.areas[0].puntaje).toBe(0);
    expect(resultado.puntajeTotal).toBe(0);
    expect(resultado.areas[0].porcentajes).toEqual({ aciertos: 67, erroneas: 33, noRespondidas: 0 });
    expect(resultado.escala).toEqual({ correcta: 0, noRespondida: 0, incorrecta: 0 });
  });
});

describe('calcularResultado — RN-09: porcentajes con mayor resto', () => {
  it('E-03: T = 1 produce 100/0/0, 0/100/0 o 0/0/100', () => {
    const correcta = bloquePrueba('matematico', 1);
    responder(correcta, ['A']);
    expect(calcularResultado(intentoPrueba([correcta])).areas[0].porcentajes).toEqual({
      aciertos: 100,
      erroneas: 0,
      noRespondidas: 0,
    });

    const erronea = bloquePrueba('matematico', 1);
    responder(erronea, ['B']);
    expect(calcularResultado(intentoPrueba([erronea])).areas[0].porcentajes).toEqual({
      aciertos: 0,
      erroneas: 100,
      noRespondidas: 0,
    });

    const enBlanco = bloquePrueba('matematico', 1);
    expect(calcularResultado(intentoPrueba([enBlanco])).areas[0].porcentajes).toEqual({
      aciertos: 0,
      erroneas: 0,
      noRespondidas: 100,
    });
  });

  it('E-04: quiz en blanco → 100 % no respondidas y puntaje = T × pnr', () => {
    const bloque = bloquePrueba('matematico', 4);
    const resultado = calcularResultado(intentoPrueba([bloque], { puntos: { correcta: 5, noRespondida: 3, incorrecta: -2 } }));
    expect(resultado.areas[0]).toMatchObject({ noRespondidas: 4, puntaje: 12 });
    expect(resultado.areas[0].porcentajes).toEqual({ aciertos: 0, erroneas: 0, noRespondidas: 100 });
  });

  it('T = 15 con 12 aciertos, 2 erróneas y 1 en blanco → 80/13/7', () => {
    const bloque = bloquePrueba('matematico', 15);
    responder(bloque, [...Array<Letra>(12).fill('A'), 'B', 'B', null]);
    const resultado = calcularResultado(intentoPrueba([bloque]));
    expect(resultado.areas[0].porcentajes).toEqual({ aciertos: 80, erroneas: 13, noRespondidas: 7 });
  });

  it('T = 3 reparte 34/33/33 con desempate determinista (aciertos primero)', () => {
    const bloque = bloquePrueba('matematico', 3);
    responder(bloque, ['A', 'B', null]);
    const primero = calcularResultado(intentoPrueba([bloque]));
    const segundo = calcularResultado(intentoPrueba([bloque]));
    expect(primero.areas[0].porcentajes).toEqual({ aciertos: 34, erroneas: 33, noRespondidas: 33 });
    expect(segundo.areas[0].porcentajes).toEqual(primero.areas[0].porcentajes);
  });

  it('invariante: los tres porcentajes suman 100 y cada uno queda a <1 del exacto (200 casos)', () => {
    const rng = rngSembrado(2026);
    for (let caso = 0; caso < 200; caso += 1) {
      const correctas = Math.floor(rng() * 20);
      const incorrectas = Math.floor(rng() * 20);
      const noRespondidas = Math.floor(rng() * 20);
      const total = correctas + incorrectas + noRespondidas;
      if (total === 0) continue;
      const bloque = bloquePrueba('matematico', total);
      responder(bloque, [
        ...Array<Letra>(correctas).fill('A'),
        ...Array<Letra>(incorrectas).fill('B'),
        ...Array<null>(noRespondidas).fill(null),
      ]);
      const { aciertos, erroneas, noRespondidas: nr } = calcularResultado(intentoPrueba([bloque])).areas[0]
        .porcentajes;
      expect(aciertos + erroneas + nr).toBe(100);
      expect(Math.abs(aciertos - (correctas / total) * 100)).toBeLessThan(1);
      expect(Math.abs(erroneas - (incorrectas / total) * 100)).toBeLessThan(1);
      expect(Math.abs(nr - (noRespondidas / total) * 100)).toBeLessThan(1);
    }
  });
});

describe('calcularResultado — RN-10: denominadores por área', () => {
  it('cada área usa su propio total, no el global', () => {
    const rm = bloquePrueba('matematico', 2);
    const rv = bloquePrueba('verbal', 1);
    responder(rm, ['A', 'B']); // 1 de 2
    responder(rv, ['A']); // 1 de 1
    const resultado = calcularResultado(intentoPrueba([rm, rv]));
    const areaRM = resultado.areas.find((area) => area.area === 'matematico');
    const areaRV = resultado.areas.find((area) => area.area === 'verbal');
    expect(areaRM).toMatchObject({ total: 2, puntaje: 3 });
    expect(areaRM?.porcentajes).toEqual({ aciertos: 50, erroneas: 50, noRespondidas: 0 });
    expect(areaRV).toMatchObject({ total: 1, puntaje: 5 });
    expect(areaRV?.porcentajes).toEqual({ aciertos: 100, erroneas: 0, noRespondidas: 0 });
  });

  it('agrupa todos los bloques de un área en una sola tarjeta', () => {
    const rm1 = bloquePrueba('matematico', 1);
    const rm2 = bloquePrueba('matematico', 3);
    responder(rm1, ['A']);
    responder(rm2, ['A', 'A', 'B']);
    const resultado = calcularResultado(intentoPrueba([rm1, rm2]));
    expect(resultado.areas).toHaveLength(1);
    expect(resultado.areas[0]).toMatchObject({ total: 4, correctas: 3, incorrectas: 1, noRespondidas: 0 });
  });
});

describe('calcularResultado — RN-11: áreas no incluidas', () => {
  it('un intento solo verbal no produce datos de RM', () => {
    const bloque = bloquePrueba('verbal', 2);
    responder(bloque, ['A', null]);
    const resultado = calcularResultado(intentoPrueba([bloque]));
    expect(resultado.areas).toHaveLength(1);
    expect(resultado.areas[0].area).toBe('verbal');
    expect(resultado.areas.some((area) => area.area === 'matematico')).toBe(false);
  });
});

describe('calcularResultado — duración (RF-16)', () => {
  it('duracionMs = terminadoEn − iniciadoEn', () => {
    const bloque = bloquePrueba('matematico', 1);
    const resultado = calcularResultado(intentoPrueba([bloque], { terminadoEn: 61_000 }));
    expect(resultado.duracionMs).toBe(60_000);
  });

  it('sin terminadoEn (defensa) la duración es 0 y nunca negativa', () => {
    const bloque = bloquePrueba('matematico', 1);
    expect(calcularResultado(intentoPrueba([bloque], { terminadoEn: null })).duracionMs).toBe(0);
    expect(calcularResultado(intentoPrueba([bloque], { terminadoEn: 500 })).duracionMs).toBe(0);
  });

  it('la escala del resultado es una copia del snapshot del intento', () => {
    const bloque = bloquePrueba('matematico', 1);
    const intento = intentoPrueba([bloque]);
    const resultado = calcularResultado(intento);
    expect(resultado.escala).not.toBe(intento.config.puntos);
    expect(resultado.escala).toEqual(intento.config.puntos);
  });
});

/* ------------------------------------------------------------------ */
/* Integración con el banco real (E-10)                                */
/* ------------------------------------------------------------------ */

// Igual que en `generator.test.ts`: el JSON es generado y no se versiona.
const entradasReales = import.meta.glob<{ default: Tema[] }>('../data/questions.json', { eager: true });
const BANCO_REAL: Tema[] | null = Object.values(entradasReales)[0]?.default ?? null;

describe.skipIf(BANCO_REAL === null)('calcularResultado — banco real (E-10)', () => {
  it('un intento real respondido con todas las claves da 100 % de aciertos por área', () => {
    const banco = BANCO_REAL ?? [];
    const bloques: BloqueIntento[] = banco.slice(0, 3).map((tema) => {
      const preguntas = tema.preguntas.map((pregunta, indice) => ({ ...pregunta, numero: indice + 1 }));
      const respuestas: Record<string, Letra | null> = {};
      for (const pregunta of preguntas) respuestas[pregunta.id] = pregunta.correcta;
      return {
        area: tema.area,
        temaId: tema.id,
        titulo: tema.titulo,
        textoComun: tema.textoComun,
        preguntas,
        respuestas,
      };
    });
    const resultado = calcularResultado(intentoPrueba(bloques));
    const area = resultado.areas[0];
    expect(area.total).toBe(15);
    expect(area.porcentajes).toEqual({ aciertos: 100, erroneas: 0, noRespondidas: 0 });
    expect(resultado.puntajeTotal).toBe(75);
  });
});
