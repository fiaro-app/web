import { Text } from '@/components/atoms/Text';
import { PlanCard, type PlanCardProps } from '@/components/molecules/PlanCard';

export interface PricingSectionProps {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly note: string;
  readonly plans: readonly PlanCardProps[];
}

/** Sección de precios: título, nota aclaratoria y una `PlanCard` por plan (alineadas arriba). */
export function PricingSection({ id, eyebrow, title, note, plans }: Readonly<PricingSectionProps>) {
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId} className="flex flex-col items-center gap-3 bg-surface px-6 py-16 lg:px-16 lg:py-24">
      <Text variant="caption" as="p" weight="semibold" className="tracking-wide text-primary uppercase">
        {eyebrow}
      </Text>
      <Text id={headingId} variant="section" className="max-w-150 text-center">
        {title}
      </Text>
      <Text variant="small" className="text-center text-foreground/60">
        {note}
      </Text>
      <div className="mt-6 grid w-full items-start gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.name} {...plan} />
        ))}
      </div>
    </section>
  );
}
