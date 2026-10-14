import { describe, expect, it } from 'vitest';
import { dashboardEndpoints, LenderDashboardSchema } from './endpoints';

const VALID = {
  totalPortfolio: 0,
  collectedToday: 0,
  activeCollectors: 0,
  totalCollectors: 0,
  effectivenessToday: null,
  clientsInArrears: 0,
  alerts: [],
  pendingSettlements: [],
  period: { from: '2026-10-09', to: '2026-10-09' },
  collectedInPeriod: 0,
  expectedInPeriod: 0,
  effectivenessInPeriod: null,
};

describe('dashboard endpoints', () => {
  it('declares the summary route as a GET', () => {
    expect(dashboardEndpoints.summary).toMatchObject({ method: 'GET', path: '/lenders/me/dashboard' });
  });

  it('accepts an empty business', () => {
    expect(LenderDashboardSchema.safeParse(VALID).success).toBe(true);
  });

  it('requires the period figures that the API now sends', () => {
    expect(LenderDashboardSchema.safeParse({ ...VALID, period: undefined }).success).toBe(false);
  });

  it('rejects a response that does not follow the contract', () => {
    expect(LenderDashboardSchema.safeParse({ ...VALID, totalPortfolio: -1 }).success).toBe(false);
    expect(LenderDashboardSchema.safeParse({ ...VALID, alerts: 'x' }).success).toBe(false);
    expect(LenderDashboardSchema.safeParse({ ...VALID, effectivenessToday: -0.1 }).success).toBe(false);
  });
});
