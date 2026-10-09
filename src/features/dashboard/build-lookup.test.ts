import { describe, expect, it } from 'vitest';
import { buildSettlementLookup } from './build-lookup';

const collector = (id: string, fullName: string, portfolioId: string | null) => ({
  id,
  userId: 'u',
  lenderId: 'l',
  roles: ['COLLECTOR' as const],
  status: 'ACTIVE' as const,
  portfolioId,
  createdAt: '2026-10-01T10:00:00.000Z',
  deactivatedAt: null,
  fullName,
  phone: '+573001234567',
});

describe('buildSettlementLookup', () => {
  const portfolios = [{ id: 'p1', name: 'Zona Norte' }];

  it('maps each collector to their name and their portfolio', () => {
    const lookup = buildSettlementLookup([collector('m1', 'Alejo Zuleta', 'p1')], portfolios);

    expect(lookup.collectorNames.get('m1')).toBe('Alejo Zuleta');
    expect(lookup.collectorPortfolioNames.get('m1')).toBe('Zona Norte');
  });

  it('keeps the name but no portfolio when the collector has none or it is unknown', () => {
    const lookup = buildSettlementLookup(
      [collector('m1', 'Ana', null), collector('m2', 'Luis', 'p-desconocida')],
      portfolios,
    );

    expect(lookup.collectorNames.size).toBe(2);
    expect(lookup.collectorPortfolioNames.size).toBe(0);
  });

  it('is empty without collectors', () => {
    expect(buildSettlementLookup([], portfolios).collectorNames.size).toBe(0);
  });
});
