import { describe, expect, it } from 'vitest';
import { formatDuracion, formatoEntero, parsearEntero } from './format';

describe('formatDuracion (RF-16)', () => {
  it('0 ms → "0:00"', () => {
    expect(formatDuracion(0)).toBe('0:00');
  });

  it('61_000 ms → "1:01"', () => {
    expect(formatDuracion(61_000)).toBe('1:01');
  });

  it('3_661_000 ms → "1:01:01"', () => {
    expect(formatDuracion(3_661_000)).toBe('1:01:01');
  });
});

describe('formatoEntero (E-09)', () => {
  it('5 → "5"', () => {
    expect(formatoEntero(5)).toBe('5');
  });

  it('−2 → "−2" con menos tipográfico U+2212', () => {
    expect(formatoEntero(-2)).toBe('−2');
    expect(formatoEntero(-2).charCodeAt(0)).toBe(0x2212);
  });
});

describe('parsearEntero (RF-07, E-09)', () => {
  it('acepta enteros positivos, cero y negativos', () => {
    expect(parsearEntero('5')).toBe(5);
    expect(parsearEntero('0')).toBe(0);
    expect(parsearEntero('-2')).toBe(-2);
  });

  it('acepta el signo menos tipográfico − (U+2212) y lo normaliza', () => {
    expect(parsearEntero('−2')).toBe(-2);
    expect(parsearEntero('−999')).toBe(-999);
    expect(parsearEntero('−0')).toBe(0);
  });

  it('acepta los bordes del rango −999…999', () => {
    expect(parsearEntero('999')).toBe(999);
    expect(parsearEntero('-999')).toBe(-999);
  });

  it('recorta espacios externos (pegado desde el portapapeles)', () => {
    expect(parsearEntero(' 5 ')).toBe(5);
    expect(parsearEntero('\t−2\n')).toBe(-2);
  });

  it('rechaza vacío y solo espacios', () => {
    expect(parsearEntero('')).toBeNull();
    expect(parsearEntero('   ')).toBeNull();
  });

  it('rechaza no numéricos y signos sin dígitos', () => {
    expect(parsearEntero('abc')).toBeNull();
    expect(parsearEntero('−')).toBeNull();
    expect(parsearEntero('-')).toBeNull();
    expect(parsearEntero('--1')).toBeNull();
    expect(parsearEntero('+5')).toBeNull();
    expect(parsearEntero('5-')).toBeNull();
    expect(parsearEntero('–5')).toBeNull(); // en dash, no es el menos válido
  });

  it('rechaza decimales, comas y notación científica', () => {
    expect(parsearEntero('5.5')).toBeNull();
    expect(parsearEntero('5,5')).toBeNull();
    expect(parsearEntero('1e3')).toBeNull();
    expect(parsearEntero('0x10')).toBeNull();
  });

  it('rechaza valores fuera de −999…999 (incluido el desborde)', () => {
    expect(parsearEntero('1000')).toBeNull();
    expect(parsearEntero('-1000')).toBeNull();
    expect(parsearEntero('999999999999999999999999')).toBeNull();
    expect(parsearEntero('−999999999999999999999999')).toBeNull();
  });

  it('acepta ceros a la izquierda y los normaliza', () => {
    expect(parsearEntero('007')).toBe(7);
    expect(parsearEntero('-000')).toBe(0);
  });
});
