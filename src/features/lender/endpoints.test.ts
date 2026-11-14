import { describe, expect, it } from 'vitest';
import {
  CreatePortfolioBodySchema,
  LogoUploadUrlBodySchema,
  UpdateLenderBodySchema,
  lenderEndpoints,
} from './endpoints';

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

describe('lender write endpoints', () => {
  it('declares update, logo upload url and create portfolio with the API paths', () => {
    expect(lenderEndpoints.update).toMatchObject({ method: 'PATCH', path: '/lender' });
    expect(lenderEndpoints.logoUploadUrl).toMatchObject({ method: 'POST', path: '/lender/logo-upload-url' });
    expect(lenderEndpoints.createPortfolio).toMatchObject({ method: 'POST', path: '/portfolios' });
  });

  it('requires at least one field to update the lender', () => {
    expect(UpdateLenderBodySchema.safeParse({}).success).toBe(false);
    expect(UpdateLenderBodySchema.safeParse({ name: 'Buen Vecino' }).success).toBe(true);
    expect(UpdateLenderBodySchema.safeParse({ skipNationalHolidays: false }).success).toBe(true);
    expect(UpdateLenderBodySchema.safeParse({ nonWorkingWeekdays: [] }).success).toBe(true);
    expect(UpdateLenderBodySchema.safeParse({ logoUrl: null }).success).toBe(true);
  });

  it('rejects an unknown weekday and an unsupported logo type', () => {
    expect(UpdateLenderBodySchema.safeParse({ nonWorkingWeekdays: ['FUNDAY'] }).success).toBe(false);
    expect(LogoUploadUrlBodySchema.safeParse({ contentType: 'image/gif', sizeBytes: 100 }).success).toBe(false);
    expect(LogoUploadUrlBodySchema.safeParse({ contentType: 'image/png', sizeBytes: 100 }).success).toBe(true);
  });

  it('requires the logo size, between 1 byte and 2 MB', () => {
    const parse = (sizeBytes?: number) => LogoUploadUrlBodySchema.safeParse({ contentType: 'image/png', sizeBytes }).success;
    expect(parse()).toBe(false);
    expect(parse(0)).toBe(false);
    expect(parse(2 * 1024 * 1024)).toBe(true);
    expect(parse(2 * 1024 * 1024 + 1)).toBe(false);
  });

  it('requires a name to create a portfolio', () => {
    expect(CreatePortfolioBodySchema.safeParse({ name: '' }).success).toBe(false);
    expect(CreatePortfolioBodySchema.safeParse({ name: 'Zona Norte' }).success).toBe(true);
  });
});
