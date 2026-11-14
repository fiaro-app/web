import type { ReactNode } from 'react';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/lib/cn';

export interface FeatureCardProps {
  readonly icon: ReactNode;
  readonly title: string;
  readonly description: string;
  readonly className?: string;
}

/** Una característica del producto: icono en círculo tintado, título y descripción corta. */
export function FeatureCard({ icon, title, description, className }: Readonly<FeatureCardProps>) {
  return (
    <article className={cn('flex flex-col items-start gap-4 bg-surface p-7', className)}>
      <span
        aria-hidden="true"
        className={cn(
          'grid size-10 place-items-center rounded-sm bg-primary/10 text-lead font-semibold text-primary',
        )}
      >
        {icon}
      </span>
      <div className="flex flex-col gap-2">
        <Text variant="body" as="h3" weight="semibold" className="tracking-[-0.01em]">
          {title}
        </Text>
        <Text variant="small" className="text-foreground/70">
          {description}
        </Text>
      </div>
    </article>
  );
}
