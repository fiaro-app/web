import { Text } from '@/components/atoms/Text';
import { cn } from '@/lib/cn';

export interface StepCardProps {
  /** Número del paso (1, 2, 3…), que se muestra en el círculo. */
  readonly step: number;
  readonly title: string;
  readonly description: string;
  readonly className?: string;
}

/** Un paso numerado de un proceso: círculo con el número, título y descripción. */
export function StepCard({ step, title, description, className }: Readonly<StepCardProps>) {
  return (
    <li className={cn('flex flex-col items-start gap-3', className)}>
      <span
        aria-hidden="true"
        className="grid size-10 place-items-center rounded-full bg-primary font-display text-lead font-semibold text-primary-foreground"
      >
        {step}
      </span>
      <Text variant="body" as="h3" weight="semibold">
        <span className="sr-only">Paso {step}: </span>
        {title}
      </Text>
      <Text variant="small" className="text-foreground/70">
        {description}
      </Text>
    </li>
  );
}
