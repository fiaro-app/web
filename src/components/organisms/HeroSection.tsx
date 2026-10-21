import type { ReactNode } from 'react';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/lib/cn';

/** Un aviso flotante de la portada: ilustra, con datos de ejemplo, lo que Fiaro te muestra. */
export interface HeroChip {
  readonly label: string;
  readonly value: string;
  /** Posición y ritmo del flote (clases de Tailwind). */
  readonly className: string;
}

export interface HeroSectionProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly primaryCta: { readonly label: string; readonly href: string };
  readonly secondaryCta: { readonly label: string; readonly href: string };
  readonly footnote: string;
  /** La ilustración de la derecha (p. ej. `DashboardPreview`). */
  readonly visual: ReactNode;
  /** Avisos que flotan alrededor de la ilustración (decorativos). */
  readonly chips?: readonly HeroChip[];
}

const PILL = 'inline-flex h-12 items-center justify-center rounded-full px-7 text-label font-semibold whitespace-nowrap transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-4 focus-visible:outline-white';

/**
 * Portada de la landing: un panel a todo color (degradado de marca con manchas de color) con el titular enorme, dos botones en
 * píldora, la ilustración del panel y avisos que flotan. Los colores vivos viven solo aquí; el resto de la página es sobrio.
 */
export function HeroSection({ eyebrow, title, description, primaryCta, secondaryCta, footnote, visual, chips = [] }: Readonly<HeroSectionProps>) {
  return (
    <section className="relative isolate mx-3 overflow-hidden rounded-[32px] bg-[#241c63] px-6 py-16 text-white lg:mx-6 lg:px-16 lg:py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_85%_20%,#e0487a_0%,transparent_60%),radial-gradient(50%_60%_at_100%_90%,#f5a524_0%,transparent_60%),radial-gradient(55%_65%_at_60%_100%,#2fb36b_0%,transparent_55%),linear-gradient(135deg,#241c63_0%,#4b2fb0_55%,#6b3fd4_100%)] opacity-95"
      />
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 lg:flex-row lg:gap-10">
        <div className="flex flex-col items-start gap-6 lg:w-1/2 lg:shrink-0">
          <p className="rounded-full bg-white/16 px-4 py-1.5 font-mono text-caption font-medium tracking-[0.06em] uppercase backdrop-blur">{eyebrow}</p>
          <Text variant="hero" className="text-[clamp(2.5rem,5.6vw,4.5rem)] leading-[0.98] tracking-[-0.035em] text-white">
            {title}
          </Text>
          <Text variant="body" className="max-w-xl text-[18px] text-white/88">
            {description}
          </Text>
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href={primaryCta.href} variant="inverse" className={cn(PILL, 'h-14 bg-white px-8 text-[#241c63]')}>
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink href={secondaryCta.href} variant="text" className={cn(PILL, 'h-14 bg-white/16 px-8 text-white backdrop-blur')}>
              {secondaryCta.label}
            </ButtonLink>
          </div>
          <Text variant="caption" className="font-mono tracking-[0.04em] text-white/80 uppercase">
            {footnote}
          </Text>
        </div>
        <div className="relative w-full min-w-0 flex-1 pb-10 lg:pb-0">
          <div className="rotate-1 transition-transform duration-500 hover:rotate-0">{visual}</div>
          {chips.map((chip) => (
            <div
              key={chip.label}
              aria-hidden="true"
              className={cn('absolute z-10 rounded-2xl bg-white px-4 py-3 text-[#1c1b2e] shadow-xl motion-safe:animate-[float_6s_ease-in-out_infinite]', chip.className)}
            >
              <p className="font-mono text-caption tracking-[0.04em] text-[#1c1b2e]/70 uppercase">{chip.label}</p>
              <p className="font-display text-title leading-none font-bold">{chip.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
