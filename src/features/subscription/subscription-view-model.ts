import { SUBSCRIPTION_TEXT } from '@/content/subscription';
import type { Subscription } from '@/features/subscription/endpoints';
import { hasAdvancedStats, hasExcelImport } from '@/features/subscription/plan-features';
import { formatInstantDate } from '@/lib/dates';
import type { Tone } from '@/lib/tone';

/** Aviso que el panel muestra arriba de todo; `null` si el plan no necesita atención. */
export interface SubscriptionNotice {
  readonly tone: Extract<Tone, 'warning' | 'error'>;
  readonly message: string;
}

/** Una fila de «Tu plan»: cuánto se usa de un tope. `percent` es `null` cuando no hay barra que pintar. */
export interface UsageRow {
  readonly key: 'collectors' | 'admins' | 'loans' | 'portfolios';
  readonly label: string;
  readonly value: string;
  /** Qué porción del tope se usa (0–100), para la barra. */
  readonly percent: number | null;
}

/** El plan del negocio listo para pintar. */
export interface SubscriptionView {
  readonly planName: string;
  /** Si el plan trae las estadísticas avanzadas (PDF, comparativo y reportes de riesgo, mora y desempeño). */
  readonly advancedStats: boolean;
  /** Si el plan trae la importación desde Excel. */
  readonly excelImport: boolean;
  readonly statusLabel: string;
  readonly endsOn: string;
  readonly daysRemaining: string;
  /** Cobradores, administradores, préstamos activos y carteras sobre el tope del plan. */
  readonly usage: readonly UsageRow[];
  /** Cuántas carteras admite el plan, la «General» incluida. */
  readonly maxPortfolios: number;
  readonly notice: SubscriptionNotice | null;
}

function toNotice(subscription: Subscription): SubscriptionNotice | null {
  const text = SUBSCRIPTION_TEXT.banner;
  if (subscription.isReadOnly || subscription.status === 'READ_ONLY') return { tone: 'error', message: text.readOnly };
  const isTrial = subscription.planCode === 'TRIAL';
  if (subscription.status === 'GRACE_PERIOD') {
    const grace = isTrial ? text.grace : text.paidGrace;
    return { tone: 'warning', message: grace(subscription.graceDaysRemaining) };
  }
  if (subscription.daysRemaining <= text.warnFromDays) {
    const ending = isTrial ? text.trialEnding : text.paidEnding;
    return { tone: 'warning', message: ending(subscription.daysRemaining) };
  }
  return null;
}

/** Qué porción de un tope se usa (0–100); un tope de cero no pinta barra. */
function percentOf(used: number, max: number): number {
  return max === 0 ? 0 : Math.min(100, Math.round((used / max) * 100));
}

function toUsageRows(subscription: Subscription): readonly UsageRow[] {
  const text = SUBSCRIPTION_TEXT.panel;
  const { usage, limits } = subscription;
  const loans: UsageRow =
    limits.maxActiveLoans === null
      ? { key: 'loans', label: text.loans, value: text.unlimitedUsage(usage.activeLoans), percent: null }
      : {
          key: 'loans',
          label: text.loans,
          value: text.usage(usage.activeLoans, limits.maxActiveLoans),
          percent: percentOf(usage.activeLoans, limits.maxActiveLoans),
        };
  return [
    {
      key: 'collectors',
      label: text.collectors,
      value: text.usage(usage.activeCollectors, limits.maxCollectors),
      percent: percentOf(usage.activeCollectors, limits.maxCollectors),
    },
    {
      key: 'admins',
      label: text.admins,
      value: text.usage(usage.activeAdmins, limits.maxAdmins),
      percent: percentOf(usage.activeAdmins, limits.maxAdmins),
    },
    loans,
    { key: 'portfolios', label: text.portfolios, value: text.upTo(limits.maxPortfolios), percent: null },
  ];
}

/** Convierte la suscripción de la API en lo que muestran el aviso del panel y el bloque «Tu plan». */
export function toSubscriptionView(subscription: Subscription): SubscriptionView {
  return {
    planName: SUBSCRIPTION_TEXT.plan[subscription.planCode],
    advancedStats: hasAdvancedStats(subscription.planCode),
    excelImport: hasExcelImport(subscription.planCode),
    statusLabel: SUBSCRIPTION_TEXT.status[subscription.status],
    endsOn: formatInstantDate(subscription.currentPeriodEndsAt),
    daysRemaining: String(subscription.daysRemaining),
    usage: toUsageRows(subscription),
    maxPortfolios: subscription.limits.maxPortfolios,
    notice: toNotice(subscription),
  };
}
