'use client';

import { StateIcon } from '@/components/atoms/StateIcon';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { EmptyState } from '@/components/molecules/EmptyState';
import { PLAN_OFFERS, PLANS_TEXT } from '@/content/plans';
import { useCheckoutStatus } from '@/features/subscription/use-checkout-status';
import { formatInstantDate } from '@/lib/dates';

/**
 * La página a la que Wompi devuelve a la persona. No decide nada por lo que trae la dirección: pregunta
 * a la API en qué quedó la orden y lo cuenta (pendiente, aprobada, no completada, lenta o desconocida).
 */
export function CheckoutResult({ reference }: Readonly<{ reference: string }>) {
  const text = PLANS_TEXT.result;
  const wait = useCheckoutStatus(reference);
  const back = (
    <ButtonLink href="/plan" variant="outline">
      {text.back}
    </ButtonLink>
  );

  if (wait.kind === 'checking') {
    return <EmptyState icon={<StateIcon name="wallet" />} {...text.pending} />;
  }
  if (wait.kind === 'not-found') {
    return <EmptyState tone="error" icon={<StateIcon name="alert" />} {...text.notFound} action={back} />;
  }
  if (wait.kind === 'slow') {
    return <EmptyState icon={<StateIcon name="wallet" />} {...text.slow} action={back} />;
  }
  const { status } = wait;
  if (status.status === 'APPROVED') {
    const planName = PLAN_OFFERS.find((offer) => offer.code === status.planCode)?.name ?? status.planCode;
    const endsOn = status.periodEndsAt ? formatInstantDate(status.periodEndsAt) : '';
    return (
      <EmptyState
        title={text.approved.title}
        description={text.approved.description(planName, endsOn)}
        action={<ButtonLink href="/resumen">{text.goToPanel}</ButtonLink>}
      />
    );
  }
  return (
    <EmptyState
      tone="error"
      icon={<StateIcon name="alert" />}
      {...text.notApproved}
      action={<ButtonLink href="/plan">{text.retry}</ButtonLink>}
    />
  );
}
