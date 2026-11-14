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

/** Sección de características: título centrado y una cuadrícula de `FeatureCard`. */
export function FeaturesSection({ id, title, subtitle, features }: Readonly<FeaturesSectionProps>) {
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId} className="border-y border-foreground/8 bg-background px-6 py-12 lg:px-16 lg:py-16">
     <div className="mx-auto grid w-full max-w-288 gap-8 lg:grid-cols-[2fr_3fr] lg:gap-16">
      <div className="flex flex-col gap-3 lg:sticky lg:top-28 lg:self-start">
        <Text id={headingId} variant="section" className="text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.1] tracking-[-0.02em]">
          {title}
        </Text>
        <Text variant="lead" className="max-w-md text-foreground/70">
          {subtitle}
        </Text>
      </div>
      <div className="reveal grid gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} className="rounded-lg border border-foreground/10" />
        ))}
      </div>
     </div>
    </section>
  );
}
