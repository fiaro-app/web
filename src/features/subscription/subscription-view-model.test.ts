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
  limits: { maxActiveLenders: 1, maxCollectors: 5, maxAdmins: 3, maxPortfolios: 4, maxActiveLoans: null },
  usage: { activeLenders: 1, activeCollectors: 2, activeAdmins: 1, activeLoans: 7 },
  createdAt: '2026-10-09T17:00:00.000Z',
};

describe('toSubscriptionView', () => {
  it('formats the plan, the end date in Colombian time and the use of every limit', () => {
    expect(toSubscriptionView(SUBSCRIPTION)).toEqual({
      planName: 'Prueba gratis',
      advancedStats: true,
      statusLabel: 'Activo',
      endsOn: '08/11/2026',
      daysRemaining: '30',
      usage: [
        { key: 'collectors', label: 'Cobradores activos', value: '2 de 5', percent: 40 },
        { key: 'admins', label: 'Administradores', value: '1 de 3', percent: 33 },
        { key: 'loans', label: 'Préstamos activos', value: '7 (sin tope)', percent: null },
        { key: 'portfolios', label: 'Carteras', value: 'Hasta 4', percent: null },
      ],
      maxPortfolios: 4,
      notice: null,
    });
  });

  it('names the paid plans and shows the loan cap with its bar', () => {
    const view = toSubscriptionView({
      ...SUBSCRIPTION,
      planCode: 'INDIVIDUAL',
      limits: { ...SUBSCRIPTION.limits, maxActiveLoans: 20, maxPortfolios: 2 },
      usage: { ...SUBSCRIPTION.usage, activeLoans: 15 },
    });

    expect(view.planName).toBe('Individual');
    expect(view.advancedStats).toBe(false);
    expect(view.maxPortfolios).toBe(2);
    expect(view.usage.find((row) => row.key === 'loans')).toEqual({
      key: 'loans',
      label: 'Préstamos activos',
      value: '15 de 20',
      percent: 75,
    });
  });

  it('speaks of the plan, not of the trial, once the plan is paid', () => {
    const paid = { ...SUBSCRIPTION, planCode: 'PRO' as const };

    expect(toSubscriptionView({ ...paid, daysRemaining: 3 }).notice?.message).toBe('Tu plan vence en 3 días.');
    expect(toSubscriptionView({ ...paid, daysRemaining: 0 }).notice?.message).toBe('Tu plan vence hoy.');
    expect(toSubscriptionView({ ...paid, status: 'GRACE_PERIOD', daysRemaining: 0, graceDaysRemaining: 1 }).notice?.message).toBe(
      'Tu plan venció. Tienes 1 día para renovarlo antes de pasar a solo lectura.',
    );
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
    const collectorsPercent = (subscription: Subscription) => toSubscriptionView(subscription).usage[0]?.percent;

    expect(collectorsPercent({ ...SUBSCRIPTION, usage: { ...SUBSCRIPTION.usage, activeCollectors: 9 } })).toBe(100);
    expect(collectorsPercent({ ...SUBSCRIPTION, limits: { ...SUBSCRIPTION.limits, maxCollectors: 0 } })).toBe(0);
  });
});
