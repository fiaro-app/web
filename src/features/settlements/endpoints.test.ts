import { describe, expect, it } from 'vitest';
import { ListSettlementsBodySchema, ReviewSettlementBodySchema, settlementEndpoints } from './endpoints';

describe('settlement endpoints', () => {
  it('declares read, list, approve and reject with the API paths', () => {
    expect(settlementEndpoints.get).toMatchObject({ method: 'GET', path: '/daily-settlements/:id' });
    expect(settlementEndpoints.list).toMatchObject({ method: 'QUERY', path: '/daily-settlements' });
    expect(settlementEndpoints.approve).toMatchObject({ method: 'POST', path: '/daily-settlements/:id/approve' });
    expect(settlementEndpoints.reject).toMatchObject({ method: 'POST', path: '/daily-settlements/:id/reject' });
  });

  it('accepts the status filter and rejects an unknown one', () => {
    expect(ListSettlementsBodySchema.safeParse({ status: 'PENDING' }).success).toBe(true);
    expect(ListSettlementsBodySchema.safeParse({ status: 'DONE' }).success).toBe(false);
  });

  it('allows an empty review body or a note, and rejects unknown keys', () => {
    expect(ReviewSettlementBodySchema.safeParse({}).success).toBe(true);
    expect(ReviewSettlementBodySchema.safeParse({ reviewNote: 'Falta el recibo' }).success).toBe(true);
    expect(ReviewSettlementBodySchema.safeParse({ status: 'APPROVED' }).success).toBe(false);
  });
});
