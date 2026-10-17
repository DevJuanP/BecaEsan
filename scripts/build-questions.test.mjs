/**
 * Pruebas del parser y del contrato del material (Plan 02 · T-2.5).
 *
 * Casos negativos: fixtures rotos de `scripts/__fixtures__` (03 §3.6.2–3, 5).
 * Casos positivos: fixture mínimo válido y los 28 archivos reales (03 §3.6.1).
 * Determinismo (03 §3.6.6) y glifos intactos (RNF-08).
 */
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { ContratoError, parseBanco, parseTema, serializeBanco } from './build-questions.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(AQUI, '__fixtures__');
const MATERIAL = join(resolve(AQUI, '..'), 'docs', 'preguntas');
const LETRAS = ['A', 'B', 'C', 'D', 'E'];

/** Lee un fixture de `scripts/__fixtures__`. */
function leerFixture(nombre) {
  return readFileSync(join(FIXTURES, nombre), 'utf8');
}

/** Meta de `03 §3.4` para un fixture (lo que `parseBanco` deriva de la ruta). */
function metaDeFixture(nombre) {
  return {
    id: 'razonamiento-matematico/01-fixture',
    area: 'matematico',
    numero: 1,
    archivo: `scripts/__fixtures__/${nombre}`,
  };
}

/** Ejecuta `fn` y devuelve el mensaje del error del contrato (falla si no lanza). */
function mensajeDeError(fn) {
  try {
    fn();
  } catch (error) {
    expect(error).toBeInstanceOf(ContratoError);
    return error.message;
  }
  throw new Error('se esperaba un ContratoError y no hubo error');
}

/** Ruta del archivo fuente real de un tema. */
function fuenteDeTema(tema) {
  return readFileSync(join(MATERIAL, ...tema.id.split('/')) + '.md', 'utf8');
}

describe('parser: casos negativos (03 §3.6.2–3, 5)', () => {
  it('detecta una pregunta con cuatro alternativas', () => {
    const mensaje = mensajeDeError(() => parseTema(leerFixture('roto-opciones.md'), metaDeFixture('roto-opciones.md')));
    expect(mensaje).toContain('scripts/__fixtures__/roto-opciones.md:');
    expect(mensaje).toContain('la pregunta 1 debe tener 5 alternativas A–E en orden');
  });

  it('detecta una clave con letra inválida', () => {
    const mensaje = mensajeDeError(() => parseTema(leerFixture('roto-clave.md'), metaDeFixture('roto-clave.md')));
    expect(mensaje).toContain('scripts/__fixtures__/roto-clave.md:');
    expect(mensaje).toContain('la clave «**4. F (16)**');
  });

  it('detecta una clave ausente', () => {
    const roto = leerFixture('valido-minimo.md').replace(/^\*\*3\. C \(S\/ 30\)\*\*.*$/m, '');
    const mensaje = mensajeDeError(() => parseTema(roto, metaDeFixture('roto-clave-ausente.md')));
    expect(mensaje).toContain('scripts/__fixtures__/roto-clave-ausente.md:');
    expect(mensaje).toContain('falta la clave de la pregunta 3');
  });

  it('detecta numeración con huecos', () => {
    const mensaje = mensajeDeError(() => parseTema(leerFixture('roto-numeracion.md'), metaDeFixture('roto-numeracion.md')));
    expect(mensaje).toContain('scripts/__fixtures__/roto-numeracion.md:');
    expect(mensaje).toContain('se esperaban 5 preguntas numeradas 1–5 sin huecos (encontradas: 1, 2, 4, 5, 6)');
  });

  it('detecta la falta de la sección «## Clave de respuestas»', () => {
    const mensaje = mensajeDeError(() => parseTema(leerFixture('roto-sin-clave.md'), metaDeFixture('roto-sin-clave.md')));
    expect(mensaje).toContain('scripts/__fixtures__/roto-sin-clave.md:');
    expect(mensaje).toContain('falta la sección «## Clave de respuestas»');
  });

  it('detecta un título vacío', () => {
    const mensaje = mensajeDeError(() => parseTema(leerFixture('roto-titulo-vacio.md'), metaDeFixture('roto-titulo-vacio.md')));
    expect(mensaje).toContain('scripts/__fixtures__/roto-titulo-vacio.md:');
    expect(mensaje).toContain('el título está vacío');
  });

  it('detecta una sección no soportada en vez de descartarla en silencio', () => {
    const roto = leerFixture('valido-minimo.md').replace('## Texto', '## Imagen');
    const mensaje = mensajeDeError(() => parseTema(roto, metaDeFixture('roto-seccion.md')));
    expect(mensaje).toContain('sección no soportada «## Imagen»');
  });
});

describe('parser: fixture mínimo válido (03 §3.1, §3.2)', () => {
  const tema = parseTema(leerFixture('valido-minimo.md'), metaDeFixture('valido-minimo.md'));

  it('extrae el tema con sus identificadores (03 §3.4)', () => {
    expect(tema.id).toBe('razonamiento-matematico/01-fixture');
    expect(tema.area).toBe('matematico');
    expect(tema.numero).toBe(1);
    expect(tema.titulo).toBe('Temática de prueba');
  });

  it('extrae el texto común completo, párrafo a párrafo', () => {
    expect(tema.textoComun).toContain('π · r²');
    expect(tema.textoComun.split('\n\n')).toHaveLength(2);
  });

  it('extrae 5 preguntas con 5 opciones A–E y su clave', () => {
    expect(tema.preguntas).toHaveLength(5);
    for (const pregunta of tema.preguntas) {
      expect(pregunta.id).toBe(`${tema.id}#q${pregunta.numero}`);
      expect(pregunta.enunciado.length).toBeGreaterThan(0);
      expect(pregunta.opciones.map((opcion) => opcion.letra)).toEqual(LETRAS);
      expect(pregunta.opciones.every((opcion) => opcion.texto.length > 0)).toBe(true);
      expect(LETRAS).toContain(pregunta.correcta);
      expect(pregunta.explicacion.length).toBeGreaterThan(0);
    }
    expect(tema.preguntas[2].correcta).toBe('C');
    expect(tema.preguntas[2].explicacion).toBe('120 ÷ 4 = 30.');
  });

  it('acepta la clave con y sin «({respuesta corta})»', () => {
    expect(tema.preguntas[0].correcta).toBe('B');
    expect(tema.preguntas[1].correcta).toBe('D');
  });

  it('serializa a JSON válido sin escapar mal las comillas rectas', () => {
    const json = serializeBanco([tema]);
    expect(json.trimEnd().endsWith(']')).toBe(true);
    expect(json).toContain('\\"rectas\\"');
    expect(JSON.parse(json)).toEqual([tema]);
  });
});

describe('material real: cobertura e integridad (03 §3.6.1–3)', () => {
  const banco = parseBanco();

  it('extrae 28 temas: 17 RM y 11 RV', () => {
    expect(banco).toHaveLength(28);
    const matematico = banco.filter((tema) => tema.area === 'matematico');
    const verbal = banco.filter((tema) => tema.area === 'verbal');
    expect(matematico).toHaveLength(17);
    expect(verbal).toHaveLength(11);
    expect(matematico.map((tema) => tema.numero)).toEqual([...Array(17)].map((_, i) => i + 1));
    expect(verbal.map((tema) => tema.numero)).toEqual([...Array(11)].map((_, i) => i + 1));
  });

  it('extrae 140 preguntas (85 RM + 55 RV)', () => {
    const contar = (temas) => temas.reduce((total, tema) => total + tema.preguntas.length, 0);
    expect(contar(banco)).toBe(140);
    expect(contar(banco.filter((tema) => tema.area === 'matematico'))).toBe(85);
    expect(contar(banco.filter((tema) => tema.area === 'verbal'))).toBe(55);
  });

  it('no repite identificadores', () => {
    const idsTemas = new Set(banco.map((tema) => tema.id));
    const idsPreguntas = new Set(banco.flatMap((tema) => tema.preguntas.map((pregunta) => pregunta.id)));
    expect(idsTemas.size).toBe(28);
    expect(idsPreguntas.size).toBe(140);
  });

  it('cada pregunta tiene 5 opciones A–E, clave válida y explicación', () => {
    for (const tema of banco) {
      expect(tema.titulo.trim().length).toBeGreaterThan(0);
      expect(tema.preguntas.map((pregunta) => pregunta.numero)).toEqual([1, 2, 3, 4, 5]);
      for (const pregunta of tema.preguntas) {
        expect(pregunta.opciones.map((opcion) => opcion.letra)).toEqual(LETRAS);
        expect(pregunta.opciones.every((opcion) => opcion.texto.trim().length > 0)).toBe(true);
        expect(LETRAS).toContain(pregunta.correcta);
        expect(pregunta.enunciado.trim().length).toBeGreaterThan(0);
        expect(pregunta.explicacion.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('usa texto común solo en Comprensión de lectura', () => {
    const conTexto = banco.filter((tema) => tema.textoComun !== null).map((tema) => tema.id);
    expect(conTexto).toEqual(['razonamiento-verbal/03-comprension-de-lectura']);
    expect(banco.find((tema) => tema.id === conTexto[0]).textoComun.split('\n\n')).toHaveLength(3);
  });
});

describe('material real: glifos intactos (RNF-08, 03 §3.6.4)', () => {
  const banco = parseBanco();

  it('conserva enunciados, alternativas y explicaciones byte a byte', () => {
    for (const tema of banco) {
      const fuente = fuenteDeTema(tema);
      for (const linea of (tema.textoComun ?? '').split('\n').filter((linea) => linea !== '')) {
        expect(fuente).toContain(linea);
      }
      for (const pregunta of tema.preguntas) {
        for (const linea of pregunta.enunciado.split('\n').filter((linea) => linea !== '')) {
          expect(fuente).toContain(linea);
        }
        for (const opcion of pregunta.opciones) {
          expect(fuente).toContain(`${opcion.letra}) ${opcion.texto}`);
        }
        expect(fuente).toContain(`**${pregunta.numero}. ${pregunta.correcta}`);
        expect(fuente).toContain(pregunta.explicacion);
      }
    }
  });

  it('conserva los símbolos matemáticos y las comillas angulares en el JSON', () => {
    const json = serializeBanco(banco);
    for (const glifo of ['π', '≈', '×', '−', '²', '√', '÷', '→', 'S/', '«', '»', 'ñ', 'á']) {
      expect(json).toContain(glifo);
    }
  });
});

describe('material real: determinismo (03 §3.6.6, 06 §6.4.4)', () => {
  it('dos extracciones producen el mismo banco', () => {
    expect(parseBanco()).toEqual(parseBanco());
  });

  it('dos serializaciones producen el mismo texto, sin metadatos volátiles', () => {
    const primera = serializeBanco(parseBanco());
    const segunda = serializeBanco(parseBanco());
    expect(segunda).toBe(primera);
    expect(primera).not.toMatch(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
  });

  it('mantiene el orden RM 01→17 y luego RV 01→11', () => {
    const banco = parseBanco();
    expect(banco.slice(0, 17).every((tema) => tema.area === 'matematico')).toBe(true);
    expect(banco.slice(17).every((tema) => tema.area === 'verbal')).toBe(true);
  });
});
