import { describe, expect, it } from 'vitest';
import { pageHref, parsePageParam, parseSearchParam } from './pagination';

describe('parsePageParam', () => {
  it('reads a positive integer', () => {
    expect(parsePageParam('3')).toBe(3);
  });

  it.each([undefined, '', '0', '-2', '1.5', 'abc', '1e3', ['2', '3'], '9999999'])('falls back to page 1 for %j', (value) => {
    expect(parsePageParam(value)).toBe(1);
  });
});

describe('parseSearchParam', () => {
  it('trims and bounds the text', () => {
    expect(parseSearchParam('  Gómez ')).toBe('Gómez');
    expect(parseSearchParam('x'.repeat(200))).toHaveLength(80);
  });

  it.each([undefined, ['a', 'b'], '   '])('is empty for %j', (value) => {
    expect(parseSearchParam(value)).toBe('');
  });
});

describe('pageHref', () => {
  it('omits the default page and an empty search', () => {
    expect(pageHref('/clientes', 1)).toBe('/clientes');
  });

  it('keeps the page and encodes the search', () => {
    expect(pageHref('/clientes', 3, 'Gómez Pérez')).toBe('/clientes?pagina=3&q=G%C3%B3mez+P%C3%A9rez');
    expect(pageHref('/clientes', 1, 'a&b')).toBe('/clientes?q=a%26b');
  });
});
