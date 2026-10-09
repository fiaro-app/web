import { describe, expect, it } from 'vitest';
import { SITE, resolveSiteUrl } from './site';

describe('resolveSiteUrl', () => {
  it('falls back to the local site', () => {
    expect(resolveSiteUrl(undefined)).toBe('http://localhost:3001');
    expect(resolveSiteUrl('')).toBe('http://localhost:3001');
  });

  it('keeps only the origin, without a trailing slash or path', () => {
    expect(resolveSiteUrl('https://fiaro.co/')).toBe('https://fiaro.co');
    expect(resolveSiteUrl('https://fiaro.co/es/inicio')).toBe('https://fiaro.co');
  });

  it('fails fast when it is not a URL', () => {
    expect(() => resolveSiteUrl('fiaro.co')).toThrow();
  });
});

describe('SITE', () => {
  it('exposes the resolved url', () => {
    expect(SITE.url).toBe(resolveSiteUrl());
  });
});
