import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Divider } from '@/components/atoms/Divider';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/lib/cn';

export interface PlanCardProps {
  readonly name: string;
  /** Precio ya formateado ("$79.000") o un texto como "Hablemos" cuando no hay precio fijo. */
  readonly price: string;
  /** Periodo del precio ("/mes"); se omite cuando el plan no tiene precio fijo. */
  readonly period?: string;
  readonly description: string;
  readonly features: readonly string[];
  readonly ctaLabel: string;
  readonly ctaHref: string;
  /** El plan recomendado: fondo de marca y botón blanco. */
  readonly highlighted?: boolean;
}

/** Un plan de precios: nombre, precio, para quién es, qué incluye y su botón de contratación. */
export function PlanCard({
  name,
  price,
  period,
  description,
  features,
  ctaLabel,
  ctaHref,
  highlighted = false,
}: Readonly<PlanCardProps>) {
  const secondaryText = highlighted ? 'text-primary-foreground/85' : 'text-foreground/70';

  return (
    <article
      className={cn(
        'flex flex-col gap-4 rounded-lg border-2 px-6 py-7',
        highlighted
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-transparent bg-background text-foreground',
      )}
    >
      <Text variant="lead" as="h3" weight="semibold">
        {name}
      </Text>
      <p className="flex items-end gap-1">
        <Text variant="price" as="span">
          {price}
        </Text>
        {period && (
          <Text variant="small" as="span" className={secondaryText}>
            {period}
          </Text>
        )}
      </p>
      <Text variant="small" className={secondaryText}>
        {description}
      </Text>
      <Divider inverse={highlighted} decorative />
      <ul className="flex flex-col gap-2">
        {features.map((feature) => (
          <li key={feature} className="flex gap-2 text-small">
            <span aria-hidden="true" className={highlighted ? undefined : 'text-success'}>
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <ButtonLink href={ctaHref} variant={highlighted ? 'inverse' : 'primary'} className="w-full">
        {ctaLabel}
      </ButtonLink>
    </article>
  );
}
