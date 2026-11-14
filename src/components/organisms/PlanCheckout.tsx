'use client';

import { Alert } from '@/components/molecules/Alert';
import { Button } from '@/components/atoms/Button';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Text } from '@/components/atoms/Text';
import { PLAN_OFFERS, PLANS_TEXT } from '@/content/plans';
import { useCheckout } from '@/features/subscription/use-checkout';
import { formatCop } from '@/lib/amount';

export interface PlanCheckoutProps {
  /** Nombre del plan actual (`Prueba gratis`, `Pro`…), para marcarlo. */
  readonly currentPlanName: string | null;
}

/** Los planes de pago, uno al lado del otro, cada uno con su botón para pagar un mes en Wompi. */
export function PlanCheckout({ currentPlanName }: Readonly<PlanCheckoutProps>) {
  const text = PLANS_TEXT.offers;
  const { payingPlan, error, pay } = useCheckout();

  return (
    <section aria-labelledby="plan-offers-title" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Text as="h2" variant="h3" id="plan-offers-title">
          {text.title}
        </Text>
        <Text variant="label" className="text-foreground/70">
          {text.description}
        </Text>
      </div>
      {error && <Alert tone="error">{error}</Alert>}
      <ul className="grid gap-4 lg:grid-cols-3">
        {PLAN_OFFERS.map((offer) => (
          <li key={offer.code} className="flex flex-col gap-4 rounded-md bg-surface p-6">
            <div className="flex flex-col gap-1">
              <Text as="h3" variant="h3">
                {offer.name}
              </Text>
              <Text variant="label" className="text-foreground/70">
                {offer.tagline}
              </Text>
            </div>
            <Text variant="title" weight="bold">
              {formatCop(offer.monthlyPrice)}{' '}
              <span className="text-body font-normal text-foreground/70">{text.perMonth}</span>
            </Text>
            <ul className="flex flex-1 flex-col gap-1.5 text-body">
              {offer.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            {currentPlanName === offer.name && <Text variant="label" className="font-semibold text-primary">{text.current}</Text>}
            <Button
              type="button"
              variant={offer.code === 'PRO' ? 'primary' : 'outline'}
              loading={payingPlan === offer.code}
              disabled={payingPlan !== null}
              onClick={() => void pay(offer.code)}
            >
              {payingPlan === offer.code ? text.paying : text.pay}
            </Button>
          </li>
        ))}
      </ul>
      <Text variant="label" className="text-foreground/70">
        {text.note}
      </Text>
      <ButtonLink href="/contacto" variant="outline" className="self-start">
        {text.help}
      </ButtonLink>
    </section>
  );
}
