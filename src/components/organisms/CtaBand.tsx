import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Text } from '@/components/atoms/Text';

export interface CtaBandProps {
  readonly title: string;
  readonly description: string;
  readonly ctaLabel: string;
  readonly ctaHref: string;
}

/** Banda de cierre sobre fondo de marca con un último llamado a la acción. */
export function CtaBand({ title, description, ctaLabel, ctaHref }: Readonly<CtaBandProps>) {
  return (
    <section className="flex flex-col items-center gap-5 bg-primary px-6 py-20 text-center text-primary-foreground lg:px-16">
      <Text variant="price" as="h2" className="max-w-175">
        {title}
      </Text>
      <Text variant="lead" className="max-w-150 text-primary-foreground/85">
        {description}
      </Text>
      <ButtonLink href={ctaHref} variant="inverse" className="w-55">
        {ctaLabel}
      </ButtonLink>
    </section>
  );
}
