import { describe, expect, it } from 'vitest';
import { formatAmount, parseAmount } from './amount';

describe('parseAmount', () => {
  it('extracts the integer from a formatted amount', () => {
    expect(parseAmount('$ 1.250.000')).toBe(1250000);
  });

  it('returns null when there are no digits', () => {
    expect(parseAmount('')).toBeNull();
    expect(parseAmount('abc')).toBeNull();
  });

  it('keeps zero as a valid amount', () => {
    expect(parseAmount('0')).toBe(0);
  });

  it('truncates beyond the safe digit limit', () => {
    expect(parseAmount('9'.repeat(30))).toBe(Number('9'.repeat(15)));
  });
});

describe('formatAmount', () => {
  it('groups thousands with the es-CO separator', () => {
    expect(formatAmount(1250000)).toBe('1.250.000');
    expect(formatAmount(0)).toBe('0');
  });

  it('formats null as an empty string', () => {
    expect(formatAmount(null)).toBe('');
  });
});
