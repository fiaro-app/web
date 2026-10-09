import { describe, expect, it } from 'vitest';
import { currentAssignment, paidInstallments, suggestTotalPayable, todayBusinessDate } from './loan-calculations';
import { LoanFormSchema } from './loan-schemas';
import { CreateAssignmentBodySchema, CreateLoanBodySchema, loanEndpoints } from './endpoints';

const valid = {
  clientId: '0192f0a4-7c3e-7000-8000-000000000001',
  principalAmount: 500_000,
  installmentCount: '20',
  installmentValue: 30_000,
  totalPayable: 600_000,
  frequency: 'DAILY',
  startDate: '2026-10-01',
};

describe('LoanFormSchema', () => {
  it('parses a valid form into the API body shape', () => {
    const values = LoanFormSchema.parse(valid);
    expect(values.installmentCount).toBe(20);
    expect(CreateLoanBodySchema.safeParse(values).success).toBe(true);
  });

  it('asks for every missing field in Spanish', () => {
    const result = LoanFormSchema.safeParse({
      clientId: '',
      principalAmount: null,
      installmentCount: '',
      installmentValue: null,
      totalPayable: null,
      frequency: '',
      startDate: '',
    });
    expect(result.success).toBe(false);
    expect(new Set(result.error?.issues.map((issue) => issue.path[0]))).toEqual(new Set(Object.keys(valid)));
    expect(result.error?.issues.find((issue) => issue.path[0] === 'principalAmount')?.message).toBe('Escribe el monto prestado.');
  });

  it.each(['0', '1001', '2.5', '-3', 'abc'])('rejects %s installments', (installmentCount) => {
    expect(LoanFormSchema.safeParse({ ...valid, installmentCount }).success).toBe(false);
  });

  it('rejects a zero amount and an unknown frequency', () => {
    expect(LoanFormSchema.safeParse({ ...valid, principalAmount: 0 }).success).toBe(false);
    expect(LoanFormSchema.safeParse({ ...valid, frequency: 'YEARLY' }).success).toBe(false);
  });
});

describe('suggestTotalPayable', () => {
  it('multiplies installments by their value', () => {
    expect(suggestTotalPayable(20, 30_000)).toBe(600_000);
  });

  it.each([[null, 30_000], [20, null], [0, 30_000], [20, 0]])('is null for %j / %j', (count, value) => {
    expect(suggestTotalPayable(count, value)).toBeNull();
  });
});

describe('todayBusinessDate', () => {
  it('uses the Colombian calendar day, not UTC', () => {
    // 2026-10-10 02:00 UTC es todavía 2026-10-09 9 pm en Bogotá (UTC-5).
    expect(todayBusinessDate(new Date('2026-10-10T02:00:00Z'))).toBe('2026-10-09');
    expect(todayBusinessDate(new Date('2026-10-10T06:00:00Z'))).toBe('2026-10-10');
  });
});

describe('loan endpoints', () => {
  it('declares the four operations with the API paths', () => {
    expect(loanEndpoints.create).toMatchObject({ method: 'POST', path: '/loans' });
    expect(loanEndpoints.get).toMatchObject({ method: 'GET', path: '/loans/:id' });
    expect(loanEndpoints.list).toMatchObject({ method: 'QUERY', path: '/loans' });
    expect(loanEndpoints.cancel).toMatchObject({ method: 'POST', path: '/loans/:id/cancel' });
  });
});

describe('paidInstallments', () => {
  it('counts the complete installments covered by what was paid', () => {
    // Pactado 600.000 en 20 cuotas de 30.000; saldo 380.000 → pagó 220.000 → 7 cuotas completas.
    expect(paidInstallments(600_000, 380_000, 30_000, 20)).toBe(7);
  });

  it('does not count a partial payment as a paid installment', () => {
    expect(paidInstallments(600_000, 590_000, 30_000, 20)).toBe(0);
  });

  it('is the full count when the balance is zero and never exceeds it', () => {
    expect(paidInstallments(600_000, 0, 30_000, 20)).toBe(20);
    expect(paidInstallments(700_000, 0, 30_000, 20)).toBe(20);
  });

  it('is zero for nonsense values', () => {
    expect(paidInstallments(600_000, 700_000, 30_000, 20)).toBe(0);
    expect(paidInstallments(600_000, 0, 0, 20)).toBe(0);
  });
});

describe('currentAssignment', () => {
  const make = (effectiveFrom: string, effectiveTo: string | null, id = effectiveFrom) => ({ id, effectiveFrom, effectiveTo });

  it('is the one in force today', () => {
    expect(currentAssignment([make('2026-09-01', null)], '2026-10-09')?.id).toBe('2026-09-01');
  });

  it('ignores future and finished assignments', () => {
    expect(currentAssignment([make('2026-10-10', null), make('2026-09-01', '2026-09-30')], '2026-10-09')).toBeNull();
    expect(currentAssignment([], '2026-10-09')).toBeNull();
  });

  it('prefers a one-day replacement over the permanent one', () => {
    const result = currentAssignment([make('2026-09-01', null, 'perm'), make('2026-10-09', '2026-10-09', 'dia')], '2026-10-09');
    expect(result?.id).toBe('dia');
  });

  it('prefers the one that started last among permanent ones', () => {
    const result = currentAssignment([make('2026-09-01', null, 'vieja'), make('2026-10-01', null, 'nueva')], '2026-10-09');
    expect(result?.id).toBe('nueva');
  });

  it('counts the last day of a range as in force', () => {
    expect(currentAssignment([make('2026-10-01', '2026-10-09')], '2026-10-09')).not.toBeNull();
  });
});

describe('balance and assignment endpoints', () => {
  it('declares them with the API paths', () => {
    expect(loanEndpoints.balance).toMatchObject({ method: 'GET', path: '/loans/:loanId/balance' });
    expect(loanEndpoints.assignments).toMatchObject({ method: 'GET', path: '/loans/:loanId/collection-assignments' });
    expect(loanEndpoints.assign).toMatchObject({ method: 'POST', path: '/loans/:loanId/collection-assignments' });
  });

  it('accepts a permanent or a one-day assignment body', () => {
    const base = { collectorMembershipId: '0192f0a4-7c3e-7000-8000-000000000001', effectiveFrom: '2026-10-09' };
    expect(CreateAssignmentBodySchema.safeParse(base).success).toBe(true);
    expect(CreateAssignmentBodySchema.safeParse({ ...base, effectiveTo: '2026-10-09' }).success).toBe(true);
    expect(CreateAssignmentBodySchema.safeParse({ ...base, effectiveTo: null }).success).toBe(true);
    expect(CreateAssignmentBodySchema.safeParse({ ...base, effectiveFrom: 'hoy' }).success).toBe(false);
  });
});
