import type { ReactNode } from 'react';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Text } from '@/components/atoms/Text';

export interface HeroSectionProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly primaryCta: { readonly label: string; readonly href: string };
  readonly secondaryCta: { readonly label: string; readonly href: string };
  readonly footnote: string;
  /** La ilustración de la derecha (p. ej. `DashboardPreview`). */
  readonly visual: ReactNode;
}

/** Portada de la landing: propuesta de valor con dos llamados a la acción y una ilustración. */
export function HeroSection({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  footnote,
  visual,
}: Readonly<HeroSectionProps>) {
  return (
    <section className="flex flex-col items-center gap-16 bg-background px-6 py-16 lg:flex-row lg:px-16 lg:py-20">
      <div className="flex flex-col items-start gap-5 lg:w-150 lg:shrink-0">
        <Text variant="caption" as="p" weight="semibold" className="tracking-wide text-primary uppercase">
          {eyebrow}
        </Text>
        <Text variant="hero">{title}</Text>
        <Text variant="body" className="text-foreground/75">
          {description}
        </Text>
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href={primaryCta.href} className="w-45">
            {primaryCta.label}
          </ButtonLink>
          <ButtonLink href={secondaryCta.href} variant="text" className="w-45">
            {secondaryCta.label}
          </ButtonLink>
        </div>
        <Text variant="caption" className="text-foreground/65">
          {footnote}
        </Text>
      </div>
      <div className="w-full min-w-0 flex-1">{visual}</div>
    </section>
  );
}
