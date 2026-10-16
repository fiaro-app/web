import { describe, expect, it } from 'vitest';
import { LEGAL_DOCUMENTS, LEGAL_VERSION } from '@/content/legal';

describe('legal documents', () => {
  it('has a date-shaped version and unique public paths', () => {
    expect(LEGAL_VERSION).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(new Set(LEGAL_DOCUMENTS.map((document) => document.path)).size).toBe(LEGAL_DOCUMENTS.length);
  });

  it('names the Colombian laws the product relies on', () => {
    const text = JSON.stringify(LEGAL_DOCUMENTS);
    for (const law of ['Ley 1581 de 2012', 'Ley 2300 de 2023', 'Ley 527 de 1999']) expect(text).toContain(law);
  });
});
