import { describe, expect, it } from 'vitest';
import { formatDuracion, formatoEntero } from './format';

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
