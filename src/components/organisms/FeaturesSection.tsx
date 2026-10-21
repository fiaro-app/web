import type { ReactNode } from 'react';
import { Text } from '@/components/atoms/Text';
import { FeatureCard } from '@/components/molecules/FeatureCard';

export interface FeatureItem {
  readonly icon: ReactNode;
  readonly title: string;
  readonly description: string;
}

export interface FeaturesSectionProps {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly features: readonly FeatureItem[];
}

/** Casillas del bento: ancho (en columnas de 6) y color de cada tarjeta, en el orden en que llegan. */
const BENTO = [
  'lg:col-span-4 bg-[#241c63] text-white',
  'lg:col-span-2 bg-[#ffe9a8] text-[#1c1b2e]',
  'lg:col-span-2 bg-[#d9f3e4] text-[#1c1b2e]',
  'lg:col-span-4 bg-[#ffd6e3] text-[#1c1b2e]',
] as const;

/** Sección de características: título centrado y una cuadrícula de `FeatureCard`. */
export function FeaturesSection({ id, title, subtitle, features }: Readonly<FeaturesSectionProps>) {
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId} className="flex flex-col items-center gap-12 px-6 py-16 lg:px-16 lg:py-24">
      <div className="flex max-w-175 flex-col items-center gap-3 text-center">
        <Text id={headingId} variant="section" className="text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] tracking-[-0.03em]">
          {title}
        </Text>
        <Text variant="lead" className="max-w-150 text-[17px] text-foreground/70">
          {subtitle}
        </Text>
      </div>
      <div className="mx-auto grid w-full max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {features.map((feature, index) => (
          <FeatureCard key={feature.title} {...feature} className={BENTO[index % BENTO.length]} />
        ))}
      </div>
    </section>
  );
}
