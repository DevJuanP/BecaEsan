/**
 * Clasificación, puntaje y porcentajes del intento (`02 §RN-07`–`§RN-11`,
 * `03 §3.3`). Módulo puro: sin DOM ni estado (`06 §6.1`).
 */

import type { Area, Intento, Letra, Pregunta, Resultado, ResultadoArea } from './types';

/** Orden fijo de categorías para el desempate del mayor resto (RN-09). */
const CATEGORIAS = ['aciertos', 'erroneas', 'noRespondidas'] as const;

/** Clasificación de una respuesta según RN-07. */
export type ClasificacionRespuesta = 'correcta' | 'incorrecta' | 'noRespondida';

/**
 * Clasifica una pregunta del intento (`02 §RN-07`): en blanco, correcta o
 * incorrecta. La usan el cálculo de resultados y la revisión posterior.
 */
export function clasificarRespuesta(pregunta: Pregunta, respuesta: Letra | null): ClasificacionRespuesta {
  if (respuesta === null) return 'noRespondida';
  return respuesta === pregunta.correcta ? 'correcta' : 'incorrecta';
}

/**
 * Reparte tres porcentajes enteros que suman 100 con el método del mayor
 * resto (`02 §RN-09`). Los empates se resuelven en el orden fijo de
 * `CATEGORIAS` (aciertos → erróneas → no respondidas) para que el resultado
 * no dependa del azar.
 */
function repartirPorcentajes(
  correctas: number,
  incorrectas: number,
  noRespondidas: number,
): ResultadoArea['porcentajes'] {
  const total = correctas + incorrectas + noRespondidas;
  if (total === 0) {
    return { aciertos: 0, erroneas: 0, noRespondidas: 0 };
  }

  const conteos = [correctas, incorrectas, noRespondidas];
  const exactos = conteos.map((conteo) => (conteo / total) * 100);
  const repartidos = exactos.map((exacto) => Math.floor(exacto));
  let sobrante = 100 - repartidos.reduce((suma, valor) => suma + valor, 0);

  const porResto = [0, 1, 2].sort(
    (a, b) => exactos[b] - repartidos[b] - (exactos[a] - repartidos[a]),
  );
  for (const indice of porResto) {
    if (sobrante <= 0) break;
    repartidos[indice] += 1;
    sobrante -= 1;
  }

  return {
    aciertos: repartidos[0],
    erroneas: repartidos[1],
    noRespondidas: repartidos[2],
  };
}

/** Acumulador por área mientras se recorre el intento. */
function areaVacia(area: Area): ResultadoArea {
  return {
    area,
    total: 0,
    correctas: 0,
    incorrectas: 0,
    noRespondidas: 0,
    puntaje: 0,
    porcentajes: { aciertos: 0, erroneas: 0, noRespondidas: 0 },
  };
}

/**
 * Calcula el resultado del intento al confirmar «Ver resultados»
 * (`02 §RF-19`): clasifica cada pregunta (RN-07), aplica la escala del
 * snapshot (RN-08), usa denominadores por área (RN-10) y omite las áreas no
 * incluidas (RN-11).
 */
export function calcularResultado(intento: Intento): Resultado {
  const porArea = new Map<Area, ResultadoArea>();

  for (const bloque of intento.bloques) {
    let area = porArea.get(bloque.area);
    if (area === undefined) {
      area = areaVacia(bloque.area);
      porArea.set(bloque.area, area);
    }
    for (const pregunta of bloque.preguntas) {
      area.total += 1;
      const letra = bloque.respuestas[pregunta.id] ?? null;
      switch (clasificarRespuesta(pregunta, letra)) {
        case 'correcta':
          area.correctas += 1;
          break;
        case 'incorrecta':
          area.incorrectas += 1;
          break;
        case 'noRespondida':
          area.noRespondidas += 1;
          break;
      }
    }
  }

  const { puntos } = intento.config;
  const areas = [...porArea.values()].map((area) => {
    area.puntaje =
      area.correctas * puntos.correcta +
      area.noRespondidas * puntos.noRespondida +
      area.incorrectas * puntos.incorrecta;
    area.porcentajes = repartirPorcentajes(area.correctas, area.incorrectas, area.noRespondidas);
    return area;
  });

  const duracionMs = Math.max(0, (intento.terminadoEn ?? intento.iniciadoEn) - intento.iniciadoEn);

  return {
    puntajeTotal: areas.reduce((total, area) => total + area.puntaje, 0),
    areas,
    duracionMs,
    escala: { ...puntos },
  };
}
