import type { ReactNode } from 'react';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/lib/cn';

export interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  /** Glyph o icono dentro del círculo; por defecto una palomita. `!` lo pinta como aviso de error. */
  readonly icon?: ReactNode;
  /** Acción opcional bajo el texto (un `Button`). */
  readonly action?: ReactNode;
  /** `page` (por defecto) ocupa todo el área de contenido; `compact` es la tarjeta pequeña de las maquetas y páginas sueltas. */
  readonly size?: 'page' | 'compact';
  readonly className?: string;
}

/**
 * Pantalla o lista sin contenido. En el panel es grande (ocupa el área de contenido, como pide el
 * diseño `Estado — …`): icono en un círculo de 160px, título en Fraunces, explicación y una acción.
 */
export function EmptyState({
  title,
  description,
  icon = '✓',
  action,
  size = 'page',
  className,
}: Readonly<EmptyStateProps>) {
  const isPage = size === 'page';
  const isAlert = icon === '!';

  return (
    <div
      className={cn(
        'flex flex-col items-center text-center',
        isPage
          ? 'min-h-[calc(100vh-10rem)] w-full justify-center gap-4 rounded-lg bg-surface px-6 py-16'
          : 'gap-3 rounded-lg bg-surface px-6 py-10 shadow-[0_10px_28px_-4px_rgb(28_27_46/0.2)]',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'grid place-items-center rounded-full font-display',
          isPage ? 'mb-4 size-40 text-[56px] font-semibold' : 'size-18 text-h3',
          isAlert ? 'bg-destructive/10 text-destructive' : 'bg-surface-2 text-primary',
          !isPage && !isAlert && 'text-primary/40',
        )}
      >
        {icon}
      </span>
      <Text variant={isPage ? 'price' : 'h3'} as="h2">
        {title}
      </Text>
      <Text className={cn('text-foreground/70', isPage ? 'max-w-135' : 'text-foreground/65')}>{description}</Text>
      {action && <div className={isPage ? 'mt-4' : undefined}>{action}</div>}
    </div>
  );
}
