import { ButtonLink } from '@/components/atoms/ButtonLink';
import { InfoRow } from '@/components/molecules/InfoRow';
import { SettingsSection } from '@/components/molecules/SettingsSection';
import { SUBSCRIPTION_TEXT } from '@/content/subscription';
import type { SubscriptionView } from '@/features/subscription/subscription-view-model';

/** «Tu plan» en Configuración: plan, estado, vencimiento y uso de cobradores. Solo informa; no cobra ni bloquea. */
export function PlanPanel({ subscription }: Readonly<{ subscription: SubscriptionView }>) {
  const text = SUBSCRIPTION_TEXT.panel;

  return (
    <SettingsSection title={text.title} description={text.description}>
      <div className="flex flex-col divide-y divide-foreground/8 overflow-hidden rounded-md">
        <InfoRow label={text.plan} value={subscription.planName} />
        <InfoRow label={text.status} value={subscription.statusLabel} />
        <InfoRow label={text.endsOn} value={subscription.endsOn} />
        <InfoRow label={text.remaining} value={subscription.daysRemaining} />
        <InfoRow label={text.collectors} value={subscription.collectors} />
      </div>
      <div
        role="progressbar"
        aria-label={text.collectors}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={subscription.collectorsPercent}
        className="h-2 overflow-hidden rounded-full bg-foreground/8"
      >
        <div className="h-full rounded-full bg-primary" style={{ width: `${String(subscription.collectorsPercent)}%` }} />
      </div>
      <ButtonLink href="/contacto" variant="outline" className="self-start">
        {text.contact}
      </ButtonLink>
    </SettingsSection>
  );
}
