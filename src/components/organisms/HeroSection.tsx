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

/** Portada de la landing: propuesta de valor en tipografía grande, dos llamados a la acción y la maqueta del panel. Sobria, sin adornos. */
export function HeroSection({ eyebrow, title, description, primaryCta, secondaryCta, footnote, visual }: Readonly<HeroSectionProps>) {
  return (
    <section className="border-b border-foreground/8 bg-surface px-6 py-16 lg:px-16 lg:py-24">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-14 lg:flex-row lg:gap-16">
        <div className="flex flex-col items-start gap-6 lg:w-1/2 lg:shrink-0">
          <p className="font-mono text-caption font-medium tracking-[0.08em] text-primary uppercase">{eyebrow}</p>
          <Text variant="hero" className="text-[clamp(2.25rem,4.6vw,3.75rem)] leading-[1.05] tracking-[-0.025em]">
            {title}
          </Text>
          <Text variant="body" className="max-w-xl text-[17px] text-foreground/75">
            {description}
          </Text>
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href={primaryCta.href} className="px-7">
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink href={secondaryCta.href} variant="outline" className="px-7">
              {secondaryCta.label}
            </ButtonLink>
          </div>
          <Text variant="caption" className="text-foreground/65">
            {footnote}
          </Text>
        </div>
        <div className="w-full min-w-0 flex-1">{visual}</div>
      </div>
    </section>
  );
}
