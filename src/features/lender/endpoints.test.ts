import { describe, expect, it } from 'vitest';
import { lenderEndpoints } from './endpoints';

describe('lender endpoints', () => {
  it('declares the lender and the portfolios as GET routes', () => {
    expect(lenderEndpoints.get).toMatchObject({ method: 'GET', path: '/lender' });
    expect(lenderEndpoints.portfolios).toMatchObject({ method: 'GET', path: '/portfolios' });
  });

  it('accepts a list of portfolios', () => {
    const parsed = lenderEndpoints.portfolios.response.safeParse([
      { id: '0192f0a4-7c3e-7000-8000-000000000001', name: 'General', isDefault: true, createdAt: '2026-10-01T10:00:00.000Z' },
    ]);

    expect(parsed.success).toBe(true);
  });
});
