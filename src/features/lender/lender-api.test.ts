import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { describePortfolioDeleteError, describeSettingsError } from './error-messages';
import { lenderEndpoints } from './endpoints';

const { callEndpoint } = vi.hoisted(() => ({ callEndpoint: vi.fn() }));
vi.mock('@/lib/api', async (importOriginal) => ({ ...(await importOriginal<typeof import('@/lib/api')>()), callEndpoint }));

import { createPortfolio, deletePortfolio, updateBrandColor, renamePortfolio, updateBusinessName, updateCollectionDays } from './lender-api';

beforeEach(() => {
  vi.clearAllMocks();
  callEndpoint.mockResolvedValue({});
});

describe('lender api', () => {
  it('updates only the name', async () => {
    await updateBusinessName('Buen Vecino');
    expect(callEndpoint).toHaveBeenCalledWith(lenderEndpoints.update, { body: { name: 'Buen Vecino' } });
  });

  it('updates the collection days sending a copy of the list', async () => {
    const days = ['SUNDAY'] as const;
    await updateCollectionDays(days, true);
    expect(callEndpoint).toHaveBeenCalledWith(lenderEndpoints.update, { body: { nonWorkingWeekdays: ['SUNDAY'], skipNationalHolidays: true } });
  });

  it('creates a portfolio by name', async () => {
    await createPortfolio('Zona Norte');
    expect(callEndpoint).toHaveBeenCalledWith(lenderEndpoints.createPortfolio, { body: { name: 'Zona Norte' } });
  });
});

describe('describeSettingsError', () => {
  const apiError = (code: string) => new ApiRequestError({ statusCode: 400, code, message: 'x' } as never);

  it.each([
    ['CONFLICT', /cartera con ese nombre/],
    ['FORBIDDEN', /No tienes permiso/],
    ['SUBSCRIPTION_READ_ONLY', /solo lectura/],
  ])('maps %s', (code, message) => {
    expect(describeSettingsError(apiError(code)).message).toMatch(message);
  });

  it('falls back to the generic mapping', () => {
    expect(describeSettingsError(new Error('boom')).field).toBeNull();
  });
});

describe('portfolio maintenance', () => {
  it('renames a portfolio by id', async () => {
    await renamePortfolio('p2', 'Zona Sur');
    expect(callEndpoint).toHaveBeenCalledWith(lenderEndpoints.renamePortfolio, { params: { id: 'p2' }, body: { name: 'Zona Sur' } });
  });

  it('deletes a portfolio by id', async () => {
    await deletePortfolio('p2');
    expect(callEndpoint).toHaveBeenCalledWith(lenderEndpoints.deletePortfolio, { params: { id: 'p2' } });
  });

  it('declares PATCH and DELETE on the portfolio', () => {
    expect(lenderEndpoints.renamePortfolio).toMatchObject({ method: 'PATCH', path: '/portfolios/:id' });
    expect(lenderEndpoints.deletePortfolio).toMatchObject({ method: 'DELETE', path: '/portfolios/:id' });
  });
});

describe('describePortfolioDeleteError', () => {
  const apiError = (statusCode: number, code: string) => new ApiRequestError({ statusCode, code, message: 'x' });

  it('explains the conflict as default portfolio or active collectors, not as a repeated name', () => {
    expect(describePortfolioDeleteError(apiError(409, 'CONFLICT')).message).toMatch(/cobradores activos/);
  });

  it('says the portfolio is gone on 404 and falls back to the general messages', () => {
    expect(describePortfolioDeleteError(apiError(404, 'NOT_FOUND')).message).toMatch(/ya no existe/);
    expect(describePortfolioDeleteError(apiError(403, 'FORBIDDEN')).message).toMatch(/No tienes permiso/);
  });
});

describe('brand color', () => {
  it('saves the color and null to go back to the default', async () => {
    await updateBrandColor('#0F766E');
    await updateBrandColor(null);

    expect(callEndpoint).toHaveBeenNthCalledWith(1, lenderEndpoints.update, { body: { brandColor: '#0F766E' } });
    expect(callEndpoint).toHaveBeenNthCalledWith(2, lenderEndpoints.update, { body: { brandColor: null } });
  });

  it('only accepts #RRGGBB in the update body and reads the color from the lender (null is the Fiaro color)', () => {
    expect(lenderEndpoints.update.body.safeParse({ brandColor: '#0f766e' }).success).toBe(true);
    expect(lenderEndpoints.update.body.safeParse({ brandColor: 'rojo' }).success).toBe(false);
    expect(lenderEndpoints.get.response.shape.brandColor.safeParse(null).success).toBe(true);
  });
});
