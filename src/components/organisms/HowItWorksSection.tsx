import { Text } from '@/components/atoms/Text';
import { StepCard } from '@/components/molecules/StepCard';

export interface StepItem {
  readonly title: string;
  readonly description: string;
}

export interface HowItWorksSectionProps {
  readonly id: string;
  readonly title: string;
  readonly steps: readonly StepItem[];
}

/** Sección "cómo funciona": título y una fila de pasos numerados en orden. */
export function HowItWorksSection({ id, title, steps }: Readonly<HowItWorksSectionProps>) {
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId} className="flex flex-col items-center gap-12 px-6 py-16 lg:px-16 lg:py-24">
      <Text id={headingId} variant="section" className="max-w-175 text-center text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.1] tracking-[-0.02em]">
        {title}
      </Text>
      <ol className="grid w-full gap-10 md:grid-cols-3">
        {steps.map((step, index) => (
          <StepCard key={step.title} step={index + 1} {...step} />
        ))}
      </ol>
    </section>
  );
}
