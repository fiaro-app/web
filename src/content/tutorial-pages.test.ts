import { describe, expect, it } from 'vitest';
import { PAGE_GUIDES, guideKeyFor } from './tutorial-pages';

describe('PAGE_GUIDES', () => {
  it('explains every control with a selector, a title and a body', () => {
    for (const [route, steps] of Object.entries(PAGE_GUIDES)) {
      expect(steps.length, route).toBeGreaterThan(0);
      for (const step of steps) {
        expect(step.selector, route).toMatch(/\S/);
        expect(step.title, route).toMatch(/\S/);
        expect(step.body, route).toMatch(/\S/);
      }
    }
  });
});

describe('guideKeyFor', () => {
  it('matches a known route, with or without a trailing slash or query', () => {
    expect(guideKeyFor('/clientes')).toBe('/clientes');
    expect(guideKeyFor('/clientes/')).toBe('/clientes');
    expect(guideKeyFor('/clientes?q=ana')).toBe('/clientes');
  });

  it('maps a loan detail to its id-less key, but not the create form', () => {
    expect(guideKeyFor('/prestamos/0190a1b2')).toBe('/prestamos/:id');
    expect(guideKeyFor('/prestamos/nuevo')).toBeNull();
  });

  it('has no guide for unknown routes', () => {
    expect(guideKeyFor('/otra')).toBeNull();
    expect(guideKeyFor('/')).toBeNull();
  });
});
