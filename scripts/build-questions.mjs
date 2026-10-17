/**
 * Extracción del banco de preguntas (Plan 02 · `03 §3.1`–`§3.3`, `06 §6.4`):
 * los `.md` de `docs/preguntas/` → `src/data/questions.json`.
 *
 * Sin dependencias: solo `node:*`. Al ejecutarlo directamente regenera el banco:
 *
 *   node scripts/build-questions.mjs
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
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

const LETRAS = ['A', 'B', 'C', 'D', 'E'];
const RE_TITULO = /^#(?!#)\s*(.*)$/;
const RE_SECCION_TEXTO = /^##\s+Texto\s*$/;
const RE_SECCION_CLAVE = /^##\s+Clave de respuestas\s*$/;
const RE_PREGUNTA = /^\*\*(\d+)\.\*\*\s*(.*)$/;
const RE_OPCION = /^([A-E])\)\s*(.*)$/;
const RE_CLAVE = /^\*\*(\d+)\.\s*([A-E])\s*(?:\(([^()]*)\))?\*\*\s*(?:—\s*(.*))?$/;

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
    throw new Error(`${archivo}: el nombre del archivo no empieza con los 2 dígitos del número de tema (03 §3.4)`);
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
      throw new Error(`${archivo}: no se pudo interpretar la clave «${linea}»`);
    }
    const numero = Number(coincidencia[1]);
    claves.set(numero, { letra: coincidencia[2], explicacion: (coincidencia[4] ?? '').trim() });
  }
  return claves;
}

/** Construye una pregunta a partir de su segmento de líneas (`03 §3.2`). */
function construirPregunta(segmento, claves, archivo, temaId) {
  const { numero, lineas } = segmento;
  const corte = lineas.findIndex((linea) => RE_OPCION.test(linea));
  if (corte === -1) throw new Error(`${archivo}: la pregunta ${numero} no tiene alternativas A)–E)`);

  const enunciado = unirBloque(lineas.slice(0, corte));
  if (enunciado === '') throw new Error(`${archivo}: la pregunta ${numero} no tiene enunciado`);

  const opciones = [];
  for (const linea of lineas.slice(corte)) {
    if (linea.trim() === '') continue;
    const coincidencia = RE_OPCION.exec(linea);
    if (!coincidencia) throw new Error(`${archivo}: la pregunta ${numero} tiene una línea inesperada: «${linea}»`);
    opciones.push({ letra: coincidencia[1], texto: coincidencia[2].trim() });
  }

  const encontradas = opciones.map((opcion) => opcion.letra).join(', ');
  if (opciones.length !== LETRAS.length || opciones.some((opcion, i) => opcion.letra !== LETRAS[i])) {
    throw new Error(`${archivo}: la pregunta ${numero} debe tener 5 alternativas A–E en orden (encontradas: ${encontradas || 'ninguna'})`);
  }

  const clave = claves.get(numero);
  if (!clave) throw new Error(`${archivo}: falta la clave de la pregunta ${numero}`);

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
 * Parsea un tema completo (`03 §3.1`, `§3.2`).
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
  if (!coincidenciaTitulo) throw new Error(`${archivo}: el archivo debe empezar con el título «# {título}»`);
  const titulo = coincidenciaTitulo[1].trim();
  if (titulo === '') throw new Error(`${archivo}: el título está vacío`);

  const indiceClave = lineas.findIndex((linea) => RE_SECCION_CLAVE.test(linea));
  if (indiceClave === -1) throw new Error(`${archivo}: falta la sección «## Clave de respuestas»`);
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
    if (fase === 'texto' && textoLineas) textoLineas.push(linea);
    else if (fase === 'preguntas' && actual) actual.lineas.push(linea);
    // fase 'cabecera': metadatos informativos (`03 §3.1.2`), no se parsean.
  }
  if (actual) segmentos.push(actual);

  const numeros = segmentos.map((segmento) => segmento.numero);
  const esperados = segmentos.map((_, i) => i + 1);
  if (segmentos.length !== LETRAS.length || numeros.some((numero, i) => numero !== esperados[i])) {
    throw new Error(`${archivo}: se esperaban 5 preguntas numeradas 1–5 sin huecos (encontradas: ${numeros.join(', ') || 'ninguna'})`);
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
 * Parsea todo el material (`06 §6.4`).
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
      throw new Error(`${rutaCitada(rutaCarpeta)}: no se pudo leer la carpeta del material (${area})`);
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

/** Genera `src/data/questions.json` desde el material real. */
export function main() {
  const temas = parseBanco();
  const json = serializeBanco(temas);
  mkdirSync(dirname(ARCHIVO_SALIDA), { recursive: true });
  writeFileSync(ARCHIVO_SALIDA, json, 'utf8');
  const preguntas = temas.reduce((total, tema) => total + tema.preguntas.length, 0);
  const kb = (Buffer.byteLength(json, 'utf8') / 1024).toFixed(1);
  console.log(`questions.json: ${temas.length} temas · ${preguntas} preguntas · ${kb} KB`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
