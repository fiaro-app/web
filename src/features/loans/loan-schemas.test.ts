import { describe, expect, it } from 'vitest';
import { suggestTotalPayable, todayBusinessDate } from './loan-calculations';
import { LoanFormSchema } from './loan-schemas';
import { CreateLoanBodySchema, loanEndpoints } from './endpoints';

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
