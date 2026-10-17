/**
 * Extracción y validación del banco de preguntas (Plan 02 · `03 §3.1`–`§3.6`,
 * `06 §6.4`): los `.md` de `docs/preguntas/` → `src/data/questions.json`.
 *
 * Sin dependencias: solo `node:*`. Falla temprano, con `{archivo}: {problema}`,
 * sin escribir un JSON parcial. Al ejecutarlo directamente regenera el banco:
 *
 *   node scripts/build-questions.mjs
 */
import { mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CARPETA_MATERIAL = join(ROOT, 'docs', 'preguntas');
const ARCHIVO_SALIDA = join(ROOT, 'src', 'data', 'questions.json');

/** 1 archivo de `docs/preguntas/` = 1 tema; `area` según `03 §3.4`. */
const AREAS = [
  { carpeta: 'razonamiento-matematico', area: 'matematico' },
  { carpeta: 'razonamiento-verbal', area: 'verbal' },
];

/** Cobertura exigida por `03 §3.6.1` (85 RM + 55 RV). */
const COBERTURA_POR_AREA = {
  matematico: { temas: 17, preguntas: 85 },
  verbal: { temas: 11, preguntas: 55 },
};
const COBERTURA_TOTAL = { temas: 28, preguntas: 140 };

const LETRAS = ['A', 'B', 'C', 'D', 'E'];
const RE_TITULO = /^#(?!#)\s*(.*)$/;
const RE_SECCION_TEXTO = /^##\s+Texto\s*$/;
const RE_SECCION_CLAVE = /^##\s+Clave de respuestas\s*$/;
const RE_OTRA_SECCION = /^##\s+/;
const RE_PREGUNTA = /^\*\*(\d+)\.\*\*\s*(.*)$/;
const RE_OPCION = /^([A-E])\)\s*(.*)$/;
const RE_CLAVE = /^\*\*(\d+)\.\s*([A-E])\s*(?:\(([^()]*)\))?\*\*\s*(?:—\s*(.*))?$/;

/** Incumplimiento del contrato del material (`03 §3.6`). */
export class ContratoError extends Error {
  name = 'ContratoError';
}

/** Recorta espacios sobrantes al final de línea (`03 §3.1`, tolerancias). */
function recortar(linea) {
  return linea.replace(/\s+$/, '');
}

/** Une un bloque de líneas ya recortadas, sin líneas vacías en los extremos. */
function unirBloque(lineas) {
  let inicio = 0;
  let fin = lineas.length;
  while (inicio < fin && lineas[inicio].trim() === '') inicio++;
  while (fin > inicio && lineas[fin - 1].trim() === '') fin--;
  return lineas.slice(inicio, fin).join('\n');
}

/** Ruta del material tal como se cita en los mensajes de error. */
function rutaCitada(ruta) {
  const relativa = relative(ROOT, ruta);
  return relativa.startsWith('..') ? ruta : relativa;
}

/** Número de tema: los 2 primeros dígitos del nombre del archivo (`03 §3.4`). */
function numeroDeTema(base, archivo) {
  const coincidencia = /^(\d{2})/.exec(base);
  if (!coincidencia) {
    throw new ContratoError(`${archivo}: el nombre del archivo no empieza con los 2 dígitos del número de tema (03 §3.4)`);
  }
  return Number(coincidencia[1]);
}

/**
 * Parsea la clave de respuestas de un tema (`03 §3.1.7`).
 * @returns {Map<number, { letra: string, explicacion: string }>}
 */
function parseClave(lineas, archivo) {
  const claves = new Map();
  for (const linea of lineas) {
    if (linea.trim() === '') continue;
    const coincidencia = RE_CLAVE.exec(linea);
    if (!coincidencia) {
      throw new ContratoError(
        `${archivo}: la clave «${linea}» no respeta el formato «**{n}. {A–E} ({respuesta corta})** — {explicación}»`,
      );
    }
    const numero = Number(coincidencia[1]);
    const explicacion = (coincidencia[4] ?? '').trim();
    if (explicacion === '') throw new ContratoError(`${archivo}: la clave de la pregunta ${numero} no tiene explicación`);
    if (claves.has(numero)) throw new ContratoError(`${archivo}: la clave de la pregunta ${numero} está repetida`);
    claves.set(numero, { letra: coincidencia[2], explicacion });
  }
  return claves;
}

/** Construye una pregunta a partir de su segmento de líneas (`03 §3.2`). */
function construirPregunta(segmento, claves, archivo, temaId) {
  const { numero, lineas } = segmento;
  const corte = lineas.findIndex((linea) => RE_OPCION.test(linea));
  if (corte === -1) throw new ContratoError(`${archivo}: la pregunta ${numero} no tiene alternativas A)–E)`);

  const enunciado = unirBloque(lineas.slice(0, corte));
  if (enunciado === '') throw new ContratoError(`${archivo}: la pregunta ${numero} no tiene enunciado`);

  const opciones = [];
  for (const linea of lineas.slice(corte)) {
    if (linea.trim() === '') continue;
    const coincidencia = RE_OPCION.exec(linea);
    if (!coincidencia) {
      throw new ContratoError(`${archivo}: contenido inesperado tras las alternativas de la pregunta ${numero}: «${linea}»`);
    }
    const texto = coincidencia[2].trim();
    if (texto === '') throw new ContratoError(`${archivo}: la alternativa ${coincidencia[1]} de la pregunta ${numero} está vacía`);
    opciones.push({ letra: coincidencia[1], texto });
  }

  const encontradas = opciones.map((opcion) => opcion.letra).join(', ');
  if (opciones.length !== LETRAS.length || opciones.some((opcion, i) => opcion.letra !== LETRAS[i])) {
    throw new ContratoError(`${archivo}: la pregunta ${numero} debe tener 5 alternativas A–E en orden (encontradas: ${encontradas || 'ninguna'})`);
  }

  const clave = claves.get(numero);
  if (!clave) throw new ContratoError(`${archivo}: falta la clave de la pregunta ${numero}`);

  return {
    id: `${temaId}#q${numero}`,
    numero,
    enunciado,
    opciones,
    correcta: clave.letra,
    explicacion: clave.explicacion,
  };
}

/**
 * Parsea un tema completo y valida su contrato (`03 §3.1`, `§3.2`, `§3.6.2–3`).
 *
 * @param {string} markdown contenido del archivo
 * @param {{ id: string, area: 'matematico' | 'verbal', numero: number, archivo: string }} meta
 *   identificadores de `03 §3.4`; `archivo` se usa en los mensajes de error
 * @returns {{ id: string, area: string, numero: number, titulo: string, textoComun: string | null, preguntas: object[] }}
 */
export function parseTema(markdown, meta) {
  if (!meta || !meta.id || !meta.area || !Number.isInteger(meta.numero)) {
    throw new Error('parseTema: meta incompleta (requiere id, area y numero)');
  }
  const archivo = meta.archivo ?? meta.id;
  const lineas = markdown.split(/\r?\n/).map(recortar);

  const primera = lineas.findIndex((linea) => linea.trim() !== '');
  const coincidenciaTitulo = primera === -1 ? null : RE_TITULO.exec(lineas[primera]);
  if (!coincidenciaTitulo) {
    throw new ContratoError(`${archivo}: el archivo debe empezar con el título «# {título}»`);
  }
  const titulo = coincidenciaTitulo[1].trim();
  if (titulo === '') throw new ContratoError(`${archivo}: el título está vacío`);

  const indiceClave = lineas.findIndex((linea) => RE_SECCION_CLAVE.test(linea));
  if (indiceClave === -1) throw new ContratoError(`${archivo}: falta la sección «## Clave de respuestas»`);
  const claves = parseClave(lineas.slice(indiceClave + 1), archivo);

  const segmentos = [];
  let textoLineas = null;
  let actual = null;
  let fase = 'cabecera';
  for (const linea of lineas.slice(primera + 1, indiceClave)) {
    if (linea === '---') {
      if (fase === 'texto') fase = 'preguntas';
      else if (fase === 'preguntas' && actual) {
        segmentos.push(actual);
        actual = null;
        fase = 'fin';
      }
      continue;
    }
    if (RE_SECCION_TEXTO.test(linea)) {
      if (fase !== 'cabecera') throw new ContratoError(`${archivo}: la sección «## Texto» está fuera de lugar`);
      textoLineas = [];
      fase = 'texto';
      continue;
    }
    const coincidenciaPregunta = RE_PREGUNTA.exec(linea);
    if (coincidenciaPregunta) {
      if (actual) segmentos.push(actual);
      actual = { numero: Number(coincidenciaPregunta[1]), lineas: [coincidenciaPregunta[2].trim()] };
      fase = 'preguntas';
      continue;
    }
    if (RE_OTRA_SECCION.test(linea)) {
      throw new ContratoError(`${archivo}: sección no soportada «${linea}» (el contrato es el de 03 §3.1)`);
    }
    if (fase === 'texto' && textoLineas) textoLineas.push(linea);
    else if (fase === 'preguntas' && actual) actual.lineas.push(linea);
    else if (fase === 'fin' && linea.trim() !== '') {
      throw new ContratoError(`${archivo}: contenido inesperado tras la última pregunta: «${linea}»`);
    }
    // fase 'cabecera': metadatos informativos (`03 §3.1.2`), no se parsean.
  }
  if (actual) segmentos.push(actual);

  const numeros = segmentos.map((segmento) => segmento.numero);
  const esperados = segmentos.map((_, i) => i + 1);
  if (segmentos.length !== LETRAS.length || numeros.some((numero, i) => numero !== esperados[i])) {
    throw new ContratoError(`${archivo}: se esperaban 5 preguntas numeradas 1–5 sin huecos (encontradas: ${numeros.join(', ') || 'ninguna'})`);
  }
  for (const numero of claves.keys()) {
    if (!numeros.includes(numero)) throw new ContratoError(`${archivo}: la clave incluye la pregunta ${numero}, que no existe`);
  }

  const preguntas = segmentos.map((segmento) => construirPregunta(segmento, claves, archivo, meta.id));
  const textoComun = textoLineas ? unirBloque(textoLineas) : null;

  return {
    id: meta.id,
    area: meta.area,
    numero: meta.numero,
    titulo,
    textoComun: textoComun === '' ? null : textoComun,
    preguntas,
  };
}

/**
 * Valida la cobertura y la integridad del banco completo (`03 §3.6.1–3`).
 * @param {object[]} temas
 * @param {string} [origen] etiqueta de origen para los mensajes de error
 */
export function validateBanco(temas, origen = 'docs/preguntas') {
  const ids = new Set();
  const conteo = { matematico: { temas: 0, preguntas: 0 }, verbal: { temas: 0, preguntas: 0 } };
  let preguntas = 0;

  for (const tema of temas) {
    const acumulado = conteo[tema.area];
    if (!acumulado) throw new ContratoError(`${origen}: área desconocida «${tema.area}» en «${tema.id}»`);
    if (!tema.id || ids.has(tema.id)) throw new ContratoError(`${origen}: el tema «${tema.id}» está repetido o sin id`);
    ids.add(tema.id);
    if (typeof tema.titulo !== 'string' || tema.titulo.trim() === '') {
      throw new ContratoError(`${origen}: el tema «${tema.id}» no tiene título`);
    }
    if (tema.preguntas.length !== LETRAS.length) {
      throw new ContratoError(`${origen}: el tema «${tema.id}» tiene ${tema.preguntas.length} preguntas (se esperaban 5)`);
    }
    acumulado.temas++;
    acumulado.preguntas += tema.preguntas.length;
    preguntas += tema.preguntas.length;
  }

  for (const [area, esperado] of Object.entries(COBERTURA_POR_AREA)) {
    const real = conteo[area];
    if (real.temas !== esperado.temas || real.preguntas !== esperado.preguntas) {
      throw new ContratoError(
        `${origen}: ${area} debe tener ${esperado.temas} temas y ${esperado.preguntas} preguntas (encontrado: ${real.temas} temas y ${real.preguntas} preguntas)`,
      );
    }
  }
  if (temas.length !== COBERTURA_TOTAL.temas || preguntas !== COBERTURA_TOTAL.preguntas) {
    throw new ContratoError(
      `${origen}: el banco debe tener ${COBERTURA_TOTAL.temas} temas y ${COBERTURA_TOTAL.preguntas} preguntas (encontrado: ${temas.length} temas y ${preguntas} preguntas)`,
    );
  }
}

/**
 * Parsea y valida todo el material (`06 §6.4`).
 * @param {string} carpeta raíz del material (por defecto `docs/preguntas`)
 * @returns {object[]} temas en orden RM 01→17, luego RV 01→11
 */
export function parseBanco(carpeta = CARPETA_MATERIAL) {
  const temas = [];
  for (const { carpeta: subcarpeta, area } of AREAS) {
    const rutaCarpeta = join(carpeta, subcarpeta);
    let entradas;
    try {
      entradas = readdirSync(rutaCarpeta);
    } catch {
      throw new ContratoError(`${rutaCitada(rutaCarpeta)}: no se pudo leer la carpeta del material (${area})`);
    }
    const archivos = entradas.filter((nombre) => nombre.endsWith('.md')).sort();
    for (const nombre of archivos) {
      const ruta = join(rutaCarpeta, nombre);
      const base = nombre.slice(0, -'.md'.length);
      const archivo = rutaCitada(ruta);
      const meta = { id: `${subcarpeta}/${base}`, area, numero: numeroDeTema(base, archivo), archivo };
      temas.push(parseTema(readFileSync(ruta, 'utf8'), meta));
    }
  }
  validateBanco(temas, rutaCitada(carpeta));
  return temas;
}

/** Serializa el banco con orden de campos y formato fijos (`03 §3.6.6`). */
export function serializeBanco(temas) {
  const ordenado = temas.map((tema) => ({
    id: tema.id,
    area: tema.area,
    numero: tema.numero,
    titulo: tema.titulo,
    textoComun: tema.textoComun,
    preguntas: tema.preguntas.map((pregunta) => ({
      id: pregunta.id,
      numero: pregunta.numero,
      enunciado: pregunta.enunciado,
      opciones: pregunta.opciones.map((opcion) => ({ letra: opcion.letra, texto: opcion.texto })),
      correcta: pregunta.correcta,
      explicacion: pregunta.explicacion,
    })),
  }));
  return `${JSON.stringify(ordenado, null, 2)}\n`;
}

/** Escribe el artefacto: temporal + rename, solo con todo validado (`03 §3.6.5`). */
function escribirAtomico(destino, contenido) {
  const temporal = `${destino}.tmp`;
  mkdirSync(dirname(destino), { recursive: true });
  try {
    writeFileSync(temporal, contenido, 'utf8');
    renameSync(temporal, destino);
  } catch (error) {
    rmSync(temporal, { force: true });
    throw error;
  }
}

/** Genera `src/data/questions.json` desde el material real. */
export function main() {
  try {
    const temas = parseBanco();
    const json = serializeBanco(temas);
    escribirAtomico(ARCHIVO_SALIDA, json);
    const preguntas = temas.reduce((total, tema) => total + tema.preguntas.length, 0);
    const kb = (Buffer.byteLength(json, 'utf8') / 1024).toFixed(1);
    console.log(`questions.json: ${temas.length} temas · ${preguntas} preguntas · ${kb} KB`);
  } catch (error) {
    console.error(`error: ${error instanceof ContratoError ? error.message : error}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
