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
    <article className={cn('flex min-h-56 flex-col items-start justify-between gap-6 rounded-[28px] p-7', className)}>
      <span
        aria-hidden="true"
        className={cn(
          'grid size-12 place-items-center rounded-full bg-white/70 text-lead font-semibold text-[#241c63] ring-1 ring-black/5',
        )}
      >
        {icon}
      </span>
      <div className="flex flex-col gap-2">
        <Text variant="body" as="h3" weight="semibold" className="text-[22px] tracking-[-0.02em]">
          {title}
        </Text>
        <Text variant="small" className="max-w-md text-[15px] opacity-80">
          {description}
        </Text>
      </div>
    </article>
  );
}
