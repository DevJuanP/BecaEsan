import { describe, expect, it } from 'vitest';
import type { Rng } from './generator';
import { crearIntento } from './generator';
import type { Area, ConfigQuiz, Letra, Pregunta, Tema } from './types';

const LETRAS: Letra[] = ['A', 'B', 'C', 'D', 'E'];

/** RNG sembrado (mulberry32) para pruebas deterministas. */
function rngSembrado(semilla: number): Rng {
  let estado = semilla >>> 0;
  return () => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function crearPregunta(temaId: string, numero: number): Pregunta {
  return {
    id: `${temaId}#q${numero}`,
    numero,
    enunciado: `Enunciado ${numero} del tema`,
    opciones: LETRAS.map((letra) => ({ letra, texto: `Opción ${letra} de la pregunta ${numero}` })),
    correcta: LETRAS[numero % LETRAS.length],
    explicacion: `Explicación de la pregunta ${numero}`,
  };
}

function crearTema(area: Area, numero: number, extra: Partial<Tema> = {}): Tema {
  const prefijo = area === 'matematico' ? 'razonamiento-matematico' : 'razonamiento-verbal';
  const id = `${prefijo}/${String(numero).padStart(2, '0')}-tema-${numero}`;
  return {
    id,
    area,
    numero,
    titulo: `Tema ${numero} de ${area}`,
    textoComun: null,
    preguntas: [1, 2, 3, 4, 5].map((n) => crearPregunta(id, n)),
    ...extra,
  };
}

const TEMAS_RM = Array.from({ length: 17 }, (_, i) => crearTema('matematico', i + 1));
const TEMAS_RV = Array.from({ length: 11 }, (_, i) => crearTema('verbal', i + 1));
const BANCO: Tema[] = [...TEMAS_RM, ...TEMAS_RV];

const CONFIG: ConfigQuiz = {
  modo: 'completo',
  temasRM: 8,
  temasRV: 5,
  preguntasPorTema: 2,
  puntos: { correcta: 5, noRespondida: 0, incorrecta: -2 },
};

describe('crearIntento — RN-01: snapshot inmutable', () => {
  it('copia la configuración: cambios posteriores no afectan al intento', () => {
    const config: ConfigQuiz = { ...CONFIG, puntos: { ...CONFIG.puntos } };
    const intento = crearIntento(config, BANCO, rngSembrado(1));

    config.temasRM = 1;
    config.preguntasPorTema = 5;
    config.puntos.correcta = 999;

    expect(intento.config).toEqual(CONFIG);
    expect(intento.config).not.toBe(config);
    expect(intento.config.puntos).not.toBe(config.puntos);
  });

  it('copia el material: mutar el banco no altera el intento', () => {
    const tema = crearTema('matematico', 1);
    const intento = crearIntento({ ...CONFIG, modo: 'solo-rm', temasRM: 1, preguntasPorTema: 5 }, [tema], rngSembrado(2));

    tema.titulo = 'Mutado';
    tema.textoComun = 'Mutado';
    tema.preguntas[0].enunciado = 'Mutado';
    tema.preguntas[0].opciones[0].texto = 'Mutado';

    const bloque = intento.bloques[0];
    expect(bloque.titulo).toBe('Tema 1 de matematico');
    expect(bloque.preguntas[0].enunciado).toBe('Enunciado 1 del tema');
    expect(bloque.preguntas[0].opciones[0].texto).toBe('Opción A de la pregunta 1');
  });

  it('inicializa respuestas en null por pregunta.id y el estado base del intento', () => {
    const antes = Date.now();
    const intento = crearIntento(CONFIG, BANCO, rngSembrado(3));
    const despues = Date.now();

    expect(intento.indiceActual).toBe(0);
    expect(intento.terminadoEn).toBeNull();
    expect(intento.iniciadoEn).toBeGreaterThanOrEqual(antes);
    expect(intento.iniciadoEn).toBeLessThanOrEqual(despues);
    expect(intento.id).toBe(String(intento.iniciadoEn));
    for (const bloque of intento.bloques) {
      expect(Object.keys(bloque.respuestas)).toEqual(bloque.preguntas.map((p) => p.id));
      expect(Object.values(bloque.respuestas).every((valor) => valor === null)).toBe(true);
    }
  });
});

describe('crearIntento — RN-02: temas al azar sin repetición', () => {
  it('entrega k temas distintos de cada área incluida (varias semillas)', () => {
    for (let semilla = 1; semilla <= 50; semilla += 1) {
      const intento = crearIntento(CONFIG, BANCO, rngSembrado(semilla));
      const rm = intento.bloques.filter((bloque) => bloque.area === 'matematico');
      const rv = intento.bloques.filter((bloque) => bloque.area === 'verbal');
      expect(rm).toHaveLength(8);
      expect(rv).toHaveLength(5);
      expect(new Set(rm.map((bloque) => bloque.temaId)).size).toBe(8);
      expect(new Set(rv.map((bloque) => bloque.temaId)).size).toBe(5);
      expect(rm.every((bloque) => TEMAS_RM.some((tema) => tema.id === bloque.temaId))).toBe(true);
      expect(rv.every((bloque) => TEMAS_RV.some((tema) => tema.id === bloque.temaId))).toBe(true);
    }
  });

  it('E-01: k = 17 de 17 incluye todos los temas en orden barajado y 85 preguntas con q = 5', () => {
    const intento = crearIntento(
      { ...CONFIG, modo: 'solo-rm', temasRM: 17, preguntasPorTema: 5 },
      BANCO,
      rngSembrado(7),
    );
    const ids = intento.bloques.map((bloque) => bloque.temaId);
    expect(intento.bloques).toHaveLength(17);
    expect([...ids].sort()).toEqual(TEMAS_RM.map((tema) => tema.id).sort());
    expect(ids).not.toEqual(TEMAS_RM.map((tema) => tema.id)); // barajado, no orden del archivo
    expect(intento.bloques.reduce((total, bloque) => total + bloque.preguntas.length, 0)).toBe(85);
  });

  it('k = 11 de 11 en RV también incluye todos los temas', () => {
    const intento = crearIntento({ ...CONFIG, modo: 'solo-rv', temasRV: 11 }, BANCO, rngSembrado(11));
    expect(intento.bloques).toHaveLength(11);
    expect([...intento.bloques.map((bloque) => bloque.temaId)].sort()).toEqual(
      TEMAS_RV.map((tema) => tema.id).sort(),
    );
  });

  it('caso del criterio de éxito 3 (01 §1.7): 10 temas RM → 10 distintos de 17', () => {
    const intento = crearIntento({ ...CONFIG, modo: 'solo-rm', temasRM: 10 }, BANCO, rngSembrado(4));
    const ids = intento.bloques.map((bloque) => bloque.temaId);
    expect(ids).toHaveLength(10);
    expect(new Set(ids).size).toBe(10);
  });
});

describe('crearIntento — RN-03: RM primero, luego RV', () => {
  it('nunca intercala áreas: todos los bloques RM van antes que los RV', () => {
    const intento = crearIntento(CONFIG, BANCO, rngSembrado(5));
    const areas = intento.bloques.map((bloque) => bloque.area);
    const primerRV = areas.indexOf('verbal');
    const ultimoRM = areas.lastIndexOf('matematico');
    expect(primerRV).toBe(8);
    expect(ultimoRM).toBe(7);
    expect(areas.slice(0, 8).every((area) => area === 'matematico')).toBe(true);
    expect(areas.slice(8).every((area) => area === 'verbal')).toBe(true);
  });

  it('solo-rm no produce bloques de RV y solo-rv no produce bloques de RM (RN-11)', () => {
    const soloRM = crearIntento({ ...CONFIG, modo: 'solo-rm' }, BANCO, rngSembrado(6));
    const soloRV = crearIntento({ ...CONFIG, modo: 'solo-rv' }, BANCO, rngSembrado(6));
    expect(soloRM.bloques.every((bloque) => bloque.area === 'matematico')).toBe(true);
    expect(soloRV.bloques.every((bloque) => bloque.area === 'verbal')).toBe(true);
    expect(soloRV.bloques).toHaveLength(5);
  });
});

describe('crearIntento — RN-04: preguntas al azar por tema', () => {
  it('E-02: con q = 5 cada bloque lleva las 5 preguntas en orden 1→5', () => {
    const intento = crearIntento({ ...CONFIG, modo: 'solo-rm', temasRM: 3, preguntasPorTema: 5 }, BANCO, rngSembrado(8));
    for (const bloque of intento.bloques) {
      expect(bloque.preguntas.map((pregunta) => pregunta.numero)).toEqual([1, 2, 3, 4, 5]);
      const tema = TEMAS_RM.find((t) => t.id === bloque.temaId);
      expect(bloque.preguntas.map((pregunta) => pregunta.id)).toEqual(
        tema?.preguntas.map((pregunta) => pregunta.id),
      );
    }
  });

  it('con q < 5 elige q preguntas distintas y las renumera 1..q', () => {
    const intento = crearIntento({ ...CONFIG, modo: 'solo-rm', temasRM: 5, preguntasPorTema: 3 }, BANCO, rngSembrado(9));
    for (const bloque of intento.bloques) {
      expect(bloque.preguntas).toHaveLength(3);
      expect(bloque.preguntas.map((pregunta) => pregunta.numero)).toEqual([1, 2, 3]);
      const ids = bloque.preguntas.map((pregunta) => pregunta.id);
      expect(new Set(ids).size).toBe(3); // distintas entre sí
      const tema = TEMAS_RM.find((t) => t.id === bloque.temaId);
      expect(ids.every((id) => tema?.preguntas.some((pregunta) => pregunta.id === id))).toBe(true);
    }
  });

  it('el subconjunto (y su orden) varía según la semilla', () => {
    const combinaciones = new Set<string>();
    for (let semilla = 1; semilla <= 20; semilla += 1) {
      const intento = crearIntento({ ...CONFIG, modo: 'solo-rm', temasRM: 1, preguntasPorTema: 2 }, [TEMAS_RM[0]], rngSembrado(semilla));
      combinaciones.add(intento.bloques[0].preguntas.map((pregunta) => pregunta.id).join(','));
    }
    expect(combinaciones.size).toBeGreaterThan(1);
  });

  it('caso del criterio de éxito 3 (01 §1.7): 3 preguntas por tema → 3 distintas por tema', () => {
    const intento = crearIntento({ ...CONFIG, modo: 'solo-rm', temasRM: 10, preguntasPorTema: 3 }, BANCO, rngSembrado(10));
    for (const bloque of intento.bloques) {
      const ids = bloque.preguntas.map((pregunta) => pregunta.id);
      expect(bloque.preguntas).toHaveLength(3);
      expect(new Set(ids).size).toBe(3);
    }
  });
});

describe('crearIntento — RN-05: sin memoria entre intentos', () => {
  it('dos intentos con la misma semilla producen los mismos bloques (función pura)', () => {
    const primero = crearIntento(CONFIG, BANCO, rngSembrado(12));
    const segundo = crearIntento(CONFIG, BANCO, rngSembrado(12));
    expect(segundo.bloques).toEqual(primero.bloques);
    expect(segundo.bloques).not.toBe(primero.bloques);
  });

  it('no arrastra estado de un intento al siguiente', () => {
    const primero = crearIntento(CONFIG, BANCO, rngSembrado(13));
    const segundo = crearIntento(CONFIG, BANCO, rngSembrado(12));
    const tercero = crearIntento(CONFIG, BANCO, rngSembrado(12));
    expect(segundo.bloques).toEqual(tercero.bloques);
    expect(primero.bloques).not.toEqual(segundo.bloques); // semillas distintas → barajados distintos
  });
});

describe('crearIntento — RN-06: alternativas sin barajar', () => {
  it('conserva las 5 opciones en orden A–E y la clave del material', () => {
    const intento = crearIntento({ ...CONFIG, modo: 'solo-rm', temasRM: 6, preguntasPorTema: 4 }, BANCO, rngSembrado(14));
    for (const bloque of intento.bloques) {
      const tema = TEMAS_RM.find((t) => t.id === bloque.temaId) as Tema;
      for (const pregunta of bloque.preguntas) {
        const original = tema.preguntas.find((p) => p.id === pregunta.id) as Pregunta;
        expect(pregunta.opciones.map((opcion) => opcion.letra)).toEqual(LETRAS);
        expect(pregunta.opciones).toEqual(original.opciones);
        expect(pregunta.correcta).toBe(original.correcta);
      }
    }
  });
});

describe('crearIntento — E-06: texto común', () => {
  it('copia textoComun del tema cuando q < 5 y deja null cuando no aplica', () => {
    const conTexto = crearTema('verbal', 1, { textoComun: 'Texto común de prueba.\n\nSegundo párrafo.' });
    const sinTexto = crearTema('verbal', 2);
    const intento = crearIntento({ ...CONFIG, modo: 'solo-rv', temasRV: 2, preguntasPorTema: 3 }, [conTexto, sinTexto], rngSembrado(15));
    for (const bloque of intento.bloques) {
      if (bloque.temaId === conTexto.id) {
        expect(bloque.textoComun).toBe('Texto común de prueba.\n\nSegundo párrafo.');
      } else {
        expect(bloque.textoComun).toBeNull();
      }
    }
  });
});

describe('crearIntento — defensa de entrada (RF-04–RF-06)', () => {
  it('lanza error si k queda fuera de rango por área', () => {
    expect(() => crearIntento({ ...CONFIG, temasRM: 0 }, BANCO, rngSembrado(16))).toThrow(/temasRM/);
    expect(() => crearIntento({ ...CONFIG, temasRM: 18 }, BANCO, rngSembrado(16))).toThrow(/temasRM/);
    expect(() => crearIntento({ ...CONFIG, temasRV: 0 }, BANCO, rngSembrado(16))).toThrow(/temasRV/);
    expect(() => crearIntento({ ...CONFIG, temasRV: 12 }, BANCO, rngSembrado(16))).toThrow(/temasRV/);
  });

  it('lanza error si k no es un entero', () => {
    expect(() => crearIntento({ ...CONFIG, temasRM: 2.5 }, BANCO, rngSembrado(16))).toThrow(/temasRM/);
    expect(() => crearIntento({ ...CONFIG, temasRV: Number.NaN }, BANCO, rngSembrado(16))).toThrow(/temasRV/);
  });

  it('lanza error si q queda fuera de rango', () => {
    expect(() => crearIntento({ ...CONFIG, preguntasPorTema: 0 }, BANCO, rngSembrado(16))).toThrow(
      /preguntasPorTema/,
    );
    expect(() => crearIntento({ ...CONFIG, preguntasPorTema: 6 }, BANCO, rngSembrado(16))).toThrow(
      /preguntasPorTema/,
    );
  });

  it('lanza error si el banco no tiene temas suficientes para k', () => {
    const bancoCorto = TEMAS_RM.slice(0, 3);
    expect(() => crearIntento({ ...CONFIG, modo: 'solo-rm', temasRM: 4 }, bancoCorto, rngSembrado(16))).toThrow(
      /banco/,
    );
  });
});

/* ------------------------------------------------------------------ */
/* E-10 — banco real (glifos intactos en el pipeline)                  */
/* ------------------------------------------------------------------ */

// `src/data/questions.json` es generado (Plan 02) y no se versiona: si aún no
// existe (falta correr `npm run dev` o `npm run build`), esta suite se omite.
const entradasReales = import.meta.glob<{ default: Tema[] }>('../data/questions.json', { eager: true });
const BANCO_REAL: Tema[] | null = Object.values(entradasReales)[0]?.default ?? null;
if (BANCO_REAL === null) {
  console.warn('E-10 omitido: falta src/data/questions.json (genera el banco con `npm run build`).');
}

describe.skipIf(BANCO_REAL === null)('E-10 — banco real: glifos intactos (RNF-08)', () => {
  const banco = BANCO_REAL ?? [];
  const texto = banco
    .flatMap((tema) => [
      tema.titulo,
      tema.textoComun ?? '',
      ...tema.preguntas.flatMap((pregunta) => [
        pregunta.enunciado,
        ...pregunta.opciones.map((opcion) => opcion.texto),
        pregunta.explicacion,
      ]),
    ])
    .join('\n');

  it('el banco real conserva los símbolos del material', () => {
    for (const glifo of ['π', '≈', '×', '−', '²', '√', '÷', '→', 'S/', '«', '»', 'ñ', 'á']) {
      expect(texto).toContain(glifo);
    }
  });

  it('crearIntento copia el texto byte a byte, sin transformaciones', () => {
    const tema = banco.find((t) => t.id === 'razonamiento-matematico/04-areas-de-figuras-geometricas');
    expect(tema).toBeDefined();
    const intento = crearIntento(
      { ...CONFIG, modo: 'solo-rm', temasRM: 1, preguntasPorTema: 5 },
      [tema as Tema],
      rngSembrado(17),
    );
    const bloque = intento.bloques[0];
    expect(bloque.textoComun).toBe(tema?.textoComun ?? null);
    for (const [indice, pregunta] of bloque.preguntas.entries()) {
      const original = (tema as Tema).preguntas[indice];
      expect(pregunta).toEqual({ ...original, numero: indice + 1 });
      expect(pregunta.enunciado).toBe(original.enunciado);
      expect(pregunta.opciones.map((opcion) => opcion.texto)).toEqual(
        original.opciones.map((opcion) => opcion.texto),
      );
    }
    expect(bloque.preguntas[2].enunciado).toContain('π ≈ 3,14');
    expect(bloque.preguntas[2].opciones[4].texto).toBe('157 cm²');
  });
});
