import { describe, expect, it } from 'vitest';
import type { MembershipListEntry } from '@/features/memberships/endpoints';
import { NO_PORTFOLIO_LABEL, toCollectorsViewModel } from './collectors-view-model';

const PORTFOLIO_ID = '0192f0a4-7c3e-7000-8000-0000000000aa';

function entry(overrides: Partial<MembershipListEntry>): MembershipListEntry {
  return {
    id: '0192f0a4-7c3e-7000-8000-000000000001',
    userId: '0192f0a4-7c3e-7000-8000-000000000002',
    lenderId: '0192f0a4-7c3e-7000-8000-000000000003',
    roles: ['COLLECTOR'],
    status: 'ACTIVE',
    portfolioId: PORTFOLIO_ID,
    createdAt: '2026-10-01T10:00:00.000Z',
    deactivatedAt: null,
    fullName: 'Luis Gómez',
    phone: '+573109998877',
    ...overrides,
  };
}

const PAGE = { total: 1, page: 1, pageSize: 20 };

describe('toCollectorsViewModel', () => {
  it('resolves the portfolio name and the active flag', () => {
    const view = toCollectorsViewModel([entry({})], [{ id: PORTFOLIO_ID, name: 'Zona Norte' }], PAGE);
    expect(view.rows).toEqual([
      expect.objectContaining({ fullName: 'Luis Gómez', portfolioName: 'Zona Norte', active: true }),
    ]);
    expect(view).toMatchObject(PAGE);
  });

  it('falls back when the collector has no portfolio or it is unknown', () => {
    const view = toCollectorsViewModel(
      [entry({ portfolioId: null }), entry({ portfolioId: '0192f0a4-7c3e-7000-8000-0000000000bb' })],
      [{ id: PORTFOLIO_ID, name: 'Zona Norte' }],
      PAGE,
    );
    expect(view.rows.map((row) => row.portfolioName)).toEqual([NO_PORTFOLIO_LABEL, NO_PORTFOLIO_LABEL]);
  });

  it('marks inactive collectors', () => {
    const view = toCollectorsViewModel([entry({ status: 'INACTIVE' })], [], PAGE);
    expect(view.rows[0]?.active).toBe(false);
  });
});
