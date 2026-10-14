import { SUBSCRIPTION_TEXT } from '@/content/subscription';
import type { Subscription } from '@/features/subscription/endpoints';
import { formatInstantDate } from '@/lib/dates';
import type { Tone } from '@/lib/tone';

/** Aviso que el panel muestra arriba de todo; `null` si el plan no necesita atención. */
export interface SubscriptionNotice {
  readonly tone: Extract<Tone, 'warning' | 'error'>;
  readonly message: string;
}

/** El plan del negocio listo para pintar. */
export interface SubscriptionView {
  readonly planName: string;
  readonly statusLabel: string;
  readonly endsOn: string;
  readonly daysRemaining: string;
  /** Cobradores activos sobre el tope del plan («3 de 5»). */
  readonly collectors: string;
  /** Qué porción del tope de cobradores se usa (0–100), para la barra. */
  readonly collectorsPercent: number;
  readonly notice: SubscriptionNotice | null;
}

function toNotice(subscription: Subscription): SubscriptionNotice | null {
  const text = SUBSCRIPTION_TEXT.banner;
  if (subscription.isReadOnly || subscription.status === 'READ_ONLY') return { tone: 'error', message: text.readOnly };
  if (subscription.status === 'GRACE_PERIOD') return { tone: 'warning', message: text.grace(subscription.graceDaysRemaining) };
  if (subscription.daysRemaining <= text.warnFromDays) return { tone: 'warning', message: text.trialEnding(subscription.daysRemaining) };
  return null;
}

/** Convierte la suscripción de la API en lo que muestran el aviso del panel y el bloque «Tu plan». */
export function toSubscriptionView(subscription: Subscription): SubscriptionView {
  const { usage, limits } = subscription;
  return {
    planName: SUBSCRIPTION_TEXT.plan[subscription.planCode],
    statusLabel: SUBSCRIPTION_TEXT.status[subscription.status],
    endsOn: formatInstantDate(subscription.currentPeriodEndsAt),
    daysRemaining: String(subscription.daysRemaining),
    collectors: SUBSCRIPTION_TEXT.panel.collectorsUsage(usage.activeCollectors, limits.maxCollectors),
    collectorsPercent: limits.maxCollectors === 0 ? 0 : Math.min(100, Math.round((usage.activeCollectors / limits.maxCollectors) * 100)),
    notice: toNotice(subscription),
  };
}
