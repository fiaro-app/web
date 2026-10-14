import { describe, expect, it } from 'vitest';
import { DEFAULT_API_URL, resolveApiUrl } from './api-url';

describe('resolveApiUrl', () => {
  it('falls back to the local API', () => {
    expect(resolveApiUrl()).toBe(DEFAULT_API_URL);
    expect(resolveApiUrl('')).toBe(DEFAULT_API_URL);
  });

  it('keeps only the origin, dropping any path or trailing slash', () => {
    expect(resolveApiUrl('https://api.fiaro.co/v1/')).toBe('https://api.fiaro.co');
  });

  it('fails fast when the value is not a URL', () => {
    expect(() => resolveApiUrl('api.fiaro.co')).toThrow();
  });
});
