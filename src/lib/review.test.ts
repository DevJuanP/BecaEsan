import { describe, expect, it } from 'vitest';
import { opcionesRevisadas } from './review';
import type { Letra, Pregunta } from './types';

const LETRAS: Letra[] = ['A', 'B', 'C', 'D', 'E'];

function preguntaPrueba(correcta: Letra = 'C'): Pregunta {
  return {
    id: 'tema#q1',
    numero: 1,
    enunciado: 'Enunciado de prueba',
    opciones: LETRAS.map((letra) => ({ letra, texto: `Opción ${letra}` })),
    correcta,
    explicacion: 'Explicación de prueba',
  };
}

describe('opcionesRevisadas — RF-22', () => {
  it('marca la clave y la alternativa elegida cuando son distintas', () => {
    const opciones = opcionesRevisadas(preguntaPrueba('C'), 'B');
    expect(opciones.filter((opcion) => opcion.esCorrecta).map((opcion) => opcion.letra)).toEqual(['C']);
    expect(opciones.filter((opcion) => opcion.esSeleccionada).map((opcion) => opcion.letra)).toEqual(['B']);
  });

  it('marca la misma alternativa como correcta y seleccionada al acertar', () => {
    const opciones = opcionesRevisadas(preguntaPrueba('D'), 'D');
    expect(opciones.filter((opcion) => opcion.esCorrecta && opcion.esSeleccionada)).toHaveLength(1);
    expect(opciones.find((opcion) => opcion.esCorrecta)?.letra).toBe('D');
  });

  it('no marca ninguna alternativa como seleccionada si quedó en blanco', () => {
    const opciones = opcionesRevisadas(preguntaPrueba('A'), null);
    expect(opciones.some((opcion) => opcion.esSeleccionada)).toBe(false);
    expect(opciones.find((opcion) => opcion.esCorrecta)?.letra).toBe('A');
  });

  it('conserva el orden y el texto del material (RN-06)', () => {
    const opciones = opcionesRevisadas(preguntaPrueba(), 'E');
    expect(opciones.map((opcion) => opcion.letra)).toEqual(LETRAS);
    expect(opciones.map((opcion) => opcion.texto)).toEqual(LETRAS.map((letra) => `Opción ${letra}`));
  });
});
