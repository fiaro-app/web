import type { ReactNode } from 'react';
import { Text } from '@/components/atoms/Text';
import { FeatureCard } from '@/components/molecules/FeatureCard';
import type { Tone } from '@/lib/tone';

export interface FeatureItem {
  readonly icon: ReactNode;
  readonly tone: Tone;
  readonly title: string;
  readonly description: string;
}

export interface FeaturesSectionProps {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly features: readonly FeatureItem[];
}

/** Sección de características: título centrado y una cuadrícula de `FeatureCard`. */
export function FeaturesSection({ id, title, subtitle, features }: Readonly<FeaturesSectionProps>) {
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId} className="flex flex-col items-center gap-12 bg-surface px-6 py-16 lg:px-16 lg:py-24">
      <div className="flex max-w-175 flex-col items-center gap-3 text-center">
        <Text id={headingId} variant="section">
          {title}
        </Text>
        <Text variant="lead" className="max-w-150 text-foreground/70">
          {subtitle}
        </Text>
      </div>
      <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}
