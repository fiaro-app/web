import { describe, expect, it } from 'vitest';
import manifest from './manifest';
import robots from './robots';
import sitemap from './sitemap';

describe('robots.txt', () => {
  it('lets crawlers in, keeps the API and the private panel out and points at the sitemap', () => {
    const result = robots();

    expect(result.rules).toMatchObject({ userAgent: '*', allow: '/', disallow: ['/api/', '/resumen'] });
    expect(result.sitemap).toMatch(/\/sitemap\.xml$/);
  });
});

describe('sitemap.xml', () => {
  it('lists the public indexable pages: home, sales contact, register, login and the legal documents', () => {
    const urls = sitemap().map((entry) => new URL(entry.url).pathname);

    expect(urls).toEqual(['/', '/contacto', '/registro', '/login', '/terminos', '/privacidad', '/cookies']);
  });
});

describe('manifest', () => {
  it('describes an installable app with the brand colors and an icon', () => {
    const result = manifest();

    expect(result).toMatchObject({ short_name: 'Fiaro', display: 'standalone', theme_color: '#3b3382', lang: 'es' });
    expect(result.icons?.[0]?.src).toBe('/icon');
  });
});
