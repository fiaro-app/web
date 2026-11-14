import { describe, expect, it } from 'vitest';
import { toRiskView } from '@/features/risk/risk-view-model';

describe('toRiskView', () => {
  it('writes one sentence per factor, pluralising the paid loans', () => {
    const view = toRiskView({
      clientId: 'c',
      score: 60,
      level: 'HIGH',
      loansCount: 3,
      factors: [
        { code: 'OVERDUE_SHARE', points: 10, value: 40 },
        { code: 'MULTIPLE_LOANS_IN_ARREARS', points: 10, value: 2 },
        { code: 'PAID_LOANS', points: -10, value: 2 },
      ],
    });

    expect(view.tone).toBe('warning');
    expect(view.factors).toEqual(['El 40 % de su saldo está vencido.', 'Tiene 2 préstamos en mora a la vez.', 'Ya pagó 2 préstamos (resta riesgo).']);
  });
});
