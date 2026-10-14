import { describe, expect, it } from 'vitest';
import {
  breadcrumbJsonLd,
  faqJsonLd,
  organizationJsonLd,
  serializeJsonLd,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from './json-ld';

describe('organizationJsonLd', () => {
  it('describes the organization with absolute URLs', () => {
    const node = organizationJsonLd();

    expect(node).toMatchObject({ '@type': 'Organization', name: 'Fiaro' });
    expect(String(node.url)).toMatch(/^https?:\/\//);
    expect(String(node.logo)).toMatch(/\/icon$/);
  });
});

describe('websiteJsonLd', () => {
  it('describes the website with language and publisher', () => {
    const node = websiteJsonLd();

    expect(node).toMatchObject({ '@type': 'WebSite', name: 'Fiaro' });
    expect(String(node.url)).toMatch(/^https?:\/\//);
    expect(node.inLanguage).toBe('es');
  });
});

describe('breadcrumbJsonLd', () => {
  it('generates an ordered list of breadcrumb items', () => {
    const node = breadcrumbJsonLd([
      { name: 'Inicio', path: '/' },
      { name: 'Contacto', path: '/contacto' },
    ]);

    expect(node).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: expect.stringMatching(/\/$/) },
        { '@type': 'ListItem', position: 2, name: 'Contacto', item: expect.stringMatching(/\/contacto$/) },
      ],
    });
  });
});

describe('softwareApplicationJsonLd', () => {
  const PLANS = [
    { name: 'Básico', price: '$79.000', description: 'a' },
    { name: 'Profesional', price: '$149.000', description: 'b' },
    { name: 'Empresarial', price: 'Hablemos', description: 'c' },
  ];

  it('turns the priced plans into COP offers and skips the one without a price', () => {
    const node = softwareApplicationJsonLd(PLANS);

    expect(node).toMatchObject({ '@type': 'SoftwareApplication', applicationCategory: 'BusinessApplication' });
    expect(node.offers).toEqual([
      { '@type': 'Offer', name: 'Básico', description: 'a', price: 79000, priceCurrency: 'COP' },
      { '@type': 'Offer', name: 'Profesional', description: 'b', price: 149000, priceCurrency: 'COP' },
    ]);
  });

  it('omits offers when no plan has a price', () => {
    expect(softwareApplicationJsonLd([PLANS[2]!])).not.toHaveProperty('offers');
  });
});

describe('serializeJsonLd', () => {
  it('cannot be used to close the script tag', () => {
    const text = serializeJsonLd({ name: '</script><script>alert(1)</script>' });

    expect(text).not.toContain('<');
    expect(JSON.parse(text)).toEqual({ name: '</script><script>alert(1)</script>' });
  });

  it('escapes the unicode line separators and accepts a list', () => {
    const text = serializeJsonLd([{ a: 'x\u2028y\u2029z' }]);

    expect(text).not.toMatch(/[\u2028\u2029]/);
    expect(JSON.parse(text)).toEqual([{ a: 'x\u2028y\u2029z' }]);
  });

  it('builds a FAQPage with one question and answer per entry', () => {
    const node = faqJsonLd([{ question: '¿Cuesta?', answer: 'No.' }]);

    expect(node).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [{ '@type': 'Question', name: '¿Cuesta?', acceptedAnswer: { '@type': 'Answer', text: 'No.' } }],
    });
  });
});
