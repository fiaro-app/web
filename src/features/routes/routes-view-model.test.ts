import { describe, expect, it } from 'vitest';
import { ROUTES_PAGE } from '@/test/route-fixture';
import { describeRouteRange, toRoutesViewModel } from './routes-view-model';

describe('toRoutesViewModel', () => {
  it('turns a route day into a row with the times, the figures and the link to its visits', () => {
    const view = toRoutesViewModel(ROUTES_PAGE);

    expect(view.rows[0]).toMatchObject({
      date: '14/10/2026',
      collectorName: 'Ana Soto',
      visits: 12,
      paid: 9,
      collected: '$270.000 de $360.000',
    });
    expect(view.rows[0]?.startedAt).toMatch(/8:05/);
    expect(view.rows[0]?.endedAt).toMatch(/4:30/);
    expect(view.rows[0]?.visitsHref).toBe(
      '/cobros?desde=2026-10-14&hasta=2026-10-14&cobrador=0196f3a0-0000-7000-8000-0000000000aa',
    );
    expect(view).toMatchObject({ total: 1, page: 1, pageSize: 10, rangeFrom: '14/10/2026', rangeTo: '14/10/2026' });
  });
});

describe('describeRouteRange', () => {
  const view = { rangeFrom: '14/10/2026', rangeTo: '14/10/2026' };

  it('says today when there are no dates, a day for one date and a period for two', () => {
    const filters = { from: '', to: '', collectorId: '' };
    expect(describeRouteRange(view, filters)).toBe('Hoy · 14/10/2026');
    expect(describeRouteRange(view, { ...filters, from: '2026-10-14', to: '2026-10-14' })).toBe('El 14/10/2026');
    expect(describeRouteRange({ rangeFrom: '10/10/2026', rangeTo: '14/10/2026' }, { ...filters, from: '2026-10-10', to: '2026-10-14' })).toBe('Del 10/10/2026 al 14/10/2026');
  });
});
