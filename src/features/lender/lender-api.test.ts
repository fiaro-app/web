import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { describeSettingsError } from './error-messages';
import { lenderEndpoints } from './endpoints';

const { callEndpoint } = vi.hoisted(() => ({ callEndpoint: vi.fn() }));
vi.mock('@/lib/api', async (importOriginal) => ({ ...(await importOriginal<typeof import('@/lib/api')>()), callEndpoint }));

import { createPortfolio, updateBusinessName, updateCollectionDays } from './lender-api';

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
