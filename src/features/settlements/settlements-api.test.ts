import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { describeSettlementError } from './error-messages';
import { settlementEndpoints } from './endpoints';

const { callEndpoint } = vi.hoisted(() => ({ callEndpoint: vi.fn() }));
vi.mock('@/lib/api', async (importOriginal) => ({ ...(await importOriginal<typeof import('@/lib/api')>()), callEndpoint }));

import { approveSettlement, rejectSettlement } from './settlements-api';

beforeEach(() => {
  vi.clearAllMocks();
  callEndpoint.mockResolvedValue({});
});

describe('settlements api', () => {
  it('sends the trimmed note when there is one', async () => {
    await approveSettlement('s1', '  Todo bien ');
    expect(callEndpoint).toHaveBeenCalledWith(settlementEndpoints.approve, { params: { id: 's1' }, body: { reviewNote: 'Todo bien' } });
  });

  it('omits an empty note instead of sending an empty string', async () => {
    await rejectSettlement('s1', '   ');
    expect(callEndpoint).toHaveBeenCalledWith(settlementEndpoints.reject, { params: { id: 's1' }, body: {} });
  });
});

describe('describeSettlementError', () => {
  const apiError = (code: string) => new ApiRequestError({ statusCode: 400, code, message: 'x' } as never);

  it.each([
    ['CONFLICT', /ya fue revisado/],
    ['FORBIDDEN', /permiso/],
    ['SUBSCRIPTION_READ_ONLY', /solo lectura/],
    ['NOT_FOUND', /ya no existe/],
    ['VALIDATION_FAILED', /comentario/],
  ])('maps %s', (code, message) => {
    expect(describeSettlementError(apiError(code)).message).toMatch(message);
  });

  it('falls back to the generic mapping', () => {
    expect(describeSettlementError(new Error('boom')).field).toBeNull();
  });
});
