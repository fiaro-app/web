import { describe, expect, it } from 'vitest';
import { formatAmount, formatCop, formatCopCompact, formatPercent, parseAmount } from './amount';

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

describe('formatCop', () => {
  it('shows pesos with the dollar sign and thousands separators', () => {
    expect(formatCop(18400000)).toBe('$18.400.000');
    expect(formatCop(0)).toBe('$0');
  });

  it('keeps the sign outside the dollar sign for negatives', () => {
    expect(formatCop(-5000)).toBe('-$5.000');
  });
});

describe('formatPercent', () => {
  it.each([
    [0.854, '85 %'],
    [1, '100 %'],
    [0, '0 %'],
    [1.2, '120 %'],
  ])('rounds %s to %s', (ratio, text) => {
    expect(formatPercent(ratio)).toBe(text);
  });

  it('shows a dash when there is nothing to measure', () => {
    expect(formatPercent(null)).toBe('—');
  });
});

describe('formatCopCompact', () => {
  it.each([
    [18400000, '$18.4M'],
    [3200000, '$3.2M'],
    [3000000, '$3M'],
    [1000000, '$1M'],
    [999999, '$999.999'],
    [850000, '$850.000'],
    [0, '$0'],
    [1234000000, '$1.234M'],
    [-2500000, '-$2.5M'],
  ])('writes %s as %s', (value, text) => {
    expect(formatCopCompact(value)).toBe(text);
  });
});
