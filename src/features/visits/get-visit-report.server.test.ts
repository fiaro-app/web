import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { EMPTY_VISIT_REPORT_FILTERS } from './visit-report-filters';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser, getSettlementLookup } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn(), getSettlementLookup: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));
vi.mock('@/features/settlements/get-settlement-lookup.server', () => ({ getSettlementLookup }));

import { getVisitReport } from './get-visit-report.server';

const ID = '0190f7a0-0000-7000-8000-000000000001';

beforeEach(() => {
  callEndpointAsUser.mockReset();
  getSettlementLookup.mockReset();
  getSettlementLookup.mockResolvedValue({ collectorNames: new Map([[ID, 'Luis Pérez']]) });
});

describe('getVisitReport', () => {
  it('asks for the page with the filters and offers the collectors', async () => {
    callEndpointAsUser.mockResolvedValue({
      data: [],
      meta: { page: 2, pageSize: 20, total: 0 },
      range: { from: '2026-10-09', to: '2026-10-09' },
    });

    const result = await getVisitReport({ ...EMPTY_VISIT_REPORT_FILTERS, outcome: 'PAID' }, 2);

    expect(callEndpointAsUser.mock.calls[0]?.[1]).toEqual({ body: { page: 2, pageSize: 20, outcome: 'PAID' } });
    expect(result).toMatchObject({
      status: 'ok',
      collectors: [{ id: ID, name: 'Luis Pérez' }],
      report: { page: 2, rangeFrom: '09/10/2026' },
    });
  });

  it('is a screen state when the person cannot see the business collections', async () => {
    callEndpointAsUser.mockRejectedValue(new ApiRequestError({ statusCode: 403, code: 'FORBIDDEN', message: 'x' }));

    await expect(getVisitReport(EMPTY_VISIT_REPORT_FILTERS, 1)).resolves.toEqual({ status: 'forbidden' });
  });

  it('propagates any other failure', async () => {
    callEndpointAsUser.mockRejectedValue(new ApiRequestError({ statusCode: 503, code: 'MAINTENANCE', message: 'x' }));

    await expect(getVisitReport(EMPTY_VISIT_REPORT_FILTERS, 1)).rejects.toBeInstanceOf(ApiRequestError);
  });
});
