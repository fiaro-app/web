import { describe, expect, it } from 'vitest';
import type { Subscription } from './endpoints';
import { toSubscriptionView } from './subscription-view-model';

const SUBSCRIPTION: Subscription = {
  planCode: 'TRIAL',
  status: 'ACTIVE',
  currentPeriodEndsAt: '2026-11-08T17:00:00.000Z',
  graceEndsAt: '2026-11-15T17:00:00.000Z',
  daysRemaining: 30,
  graceDaysRemaining: 0,
  isReadOnly: false,
  limits: { maxActiveLenders: 1, maxCollectors: 5 },
  usage: { activeLenders: 1, activeCollectors: 2 },
  createdAt: '2026-10-09T17:00:00.000Z',
};

describe('toSubscriptionView', () => {
  it('formats the plan, the end date in Colombian time and the use of collectors', () => {
    expect(toSubscriptionView(SUBSCRIPTION)).toEqual({
      planName: 'Prueba gratis',
      statusLabel: 'Activo',
      endsOn: '08/11/2026',
      daysRemaining: '30',
      collectors: '2 de 5',
      collectorsPercent: 40,
      notice: null,
    });
  });

  it('warns when the trial is about to end, in the singular and on its last day', () => {
    expect(toSubscriptionView({ ...SUBSCRIPTION, daysRemaining: 7 }).notice).toEqual({
      tone: 'warning',
      message: 'Tu prueba gratis termina en 7 días.',
    });
    expect(toSubscriptionView({ ...SUBSCRIPTION, daysRemaining: 1 }).notice?.message).toBe('Tu prueba gratis termina en 1 día.');
    expect(toSubscriptionView({ ...SUBSCRIPTION, daysRemaining: 0 }).notice?.message).toBe('Tu prueba gratis termina hoy.');
  });

  it('counts down the grace period before the read-only mode', () => {
    const view = toSubscriptionView({ ...SUBSCRIPTION, status: 'GRACE_PERIOD', daysRemaining: 0, graceDaysRemaining: 3 });

    expect(view.statusLabel).toBe('En gracia');
    expect(view.notice).toEqual({
      tone: 'warning',
      message: 'Tu prueba terminó. Tienes 3 días para activar tu plan antes de pasar a solo lectura.',
    });
  });

  it('says the business is read-only, as an error', () => {
    const view = toSubscriptionView({ ...SUBSCRIPTION, status: 'READ_ONLY', isReadOnly: true, daysRemaining: 0 });

    expect(view.notice).toMatchObject({ tone: 'error', message: expect.stringContaining('solo lectura') });
  });

  it('caps the usage bar at 100 % and tolerates a plan without collectors', () => {
    expect(toSubscriptionView({ ...SUBSCRIPTION, usage: { activeLenders: 1, activeCollectors: 9 } }).collectorsPercent).toBe(100);
    expect(toSubscriptionView({ ...SUBSCRIPTION, limits: { maxActiveLenders: 1, maxCollectors: 0 } }).collectorsPercent).toBe(0);
  });
});
