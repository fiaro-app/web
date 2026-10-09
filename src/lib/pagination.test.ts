import { describe, expect, it } from 'vitest';
import { parsePageParam } from './pagination';

describe('parsePageParam', () => {
  it('reads a positive integer', () => {
    expect(parsePageParam('3')).toBe(3);
  });

  it.each([undefined, '', '0', '-2', '1.5', 'abc', '1e3', ['2', '3'], '9999999'])('falls back to page 1 for %j', (value) => {
    expect(parsePageParam(value)).toBe(1);
  });
});
