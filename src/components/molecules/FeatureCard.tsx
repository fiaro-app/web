import type { ReactNode } from 'react';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/lib/cn';
import { TONE_SURFACE_CLASSES, type Tone } from '@/lib/tone';

export interface FeatureCardProps {
  readonly icon: ReactNode;
  /** Color del círculo del icono: su intención semántica (error, éxito, info, aviso). */
  readonly tone: Tone;
  readonly title: string;
  readonly description: string;
  readonly className?: string;
}

/** Una característica del producto: icono en círculo tintado, título y descripción corta. */
export function FeatureCard({ icon, tone, title, description, className }: Readonly<FeatureCardProps>) {
  return (
    <article className={cn('flex flex-col items-start gap-3', className)}>
      <span
        aria-hidden="true"
        className={cn(
          'grid size-12 place-items-center rounded-full text-lead font-semibold',
          TONE_SURFACE_CLASSES[tone],
        )}
      >
        {icon}
      </span>
      <Text variant="body" as="h3" weight="semibold">
        {title}
      </Text>
      <Text variant="small" className="text-foreground/70">
        {description}
      </Text>
    </article>
  );
}
