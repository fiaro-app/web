import type { ReactNode } from 'react';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/lib/cn';

export interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  /** Glyph o icono dentro del círculo; por defecto una palomita. */
  readonly icon?: ReactNode;
  /** Acción opcional bajo el texto (un `Button`). */
  readonly action?: ReactNode;
  readonly className?: string;
}

/** Pantalla o lista sin contenido: icono en círculo, título, explicación y una acción opcional. */
export function EmptyState({
  title,
  description,
  icon = '✓',
  action,
  className,
}: Readonly<EmptyStateProps>) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-lg bg-surface px-6 py-10 text-center shadow-[0_10px_28px_-4px_rgb(28_27_46/0.2)]',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-18 place-items-center rounded-full bg-surface-2 font-display text-h3 text-primary/40"
      >
        {icon}
      </span>
      <Text variant="h3">{title}</Text>
      <Text className="text-foreground/65">{description}</Text>
      {action}
    </div>
  );
}
