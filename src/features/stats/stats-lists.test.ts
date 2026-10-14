import { describe, expect, it } from 'vitest';
import { EMPTY_STATS_FILTERS, parseStatsListPages, statsHref } from './stats-filters';

describe('parseStatsListPages', () => {
  it('opens a long list only when its parameter is there', () => {
    expect(parseStatsListPages({})).toEqual({ arrears: null, collectors: null });
    expect(parseStatsListPages({ mora: '3', desempeno: 'x' })).toEqual({ arrears: 3, collectors: 1 });
  });
});

describe('statsHref', () => {
  it('keeps the active filters and opens the asked list', () => {
    const filters = { from: '2026-10-01', to: '2026-10-09', collectorId: '', portfolioId: 'p1' };
    expect(statsHref(filters, { name: 'mora', page: 2 })).toBe('/estadisticas?desde=2026-10-01&hasta=2026-10-09&cartera=p1&mora=2');
    expect(statsHref(EMPTY_STATS_FILTERS)).toBe('/estadisticas');
  });
});
