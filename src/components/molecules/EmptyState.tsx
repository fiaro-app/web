import type { ReactNode } from 'react';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/lib/cn';

export interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  /** Dibujo o glyph dentro del círculo; por defecto una palomita. Suele ser un `StateIcon`. */
  readonly icon?: ReactNode;
  /** `error` pinta el círculo en rojo suave (algo falló); `neutral` en el tono de la marca. */
  readonly tone?: 'neutral' | 'error';
  /** Acción principal bajo el texto (un `ButtonLink` o `Button`). */
  readonly action?: ReactNode;
  /** `page` (por defecto) ocupa todo el área de contenido; `compact` es la tarjeta pequeña de las maquetas y páginas sueltas. */
  readonly size?: 'page' | 'compact';
  readonly className?: string;
}

/**
 * Pantalla o lista sin contenido. En el panel es grande (ocupa todo el alto disponible, como pide
 * el diseño `Estado — …`): icono en un círculo de 160px con un halo, título en Fraunces, explicación
 * y una acción. Nunca se ve cortada: crece con el contenido y se centra en el espacio libre.
 */
export function EmptyState({
  title,
  description,
  icon = '✓',
  tone = 'neutral',
  action,
  size = 'page',
  className,
}: Readonly<EmptyStateProps>) {
  const isPage = size === 'page';
  const isError = tone === 'error';

  return (
    <div
      className={cn(
        'flex flex-col items-center text-center',
        isPage
          ? 'min-h-112 w-full flex-1 justify-center gap-4 rounded-lg bg-surface px-6 py-16'
          : 'gap-3 rounded-lg bg-surface px-6 py-10 shadow-[0_10px_28px_-4px_rgb(28_27_46/0.2)]',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'grid place-items-center rounded-full font-display',
          isPage ? 'mb-4 size-40 text-[56px] font-semibold ring-[14px]' : 'size-18 text-h3',
          isError ? 'bg-destructive/10 text-destructive ring-destructive/5' : 'bg-surface-2 text-primary ring-surface-2/50',
          !isPage && !isError && 'text-primary/40',
        )}
      >
        {icon}
      </span>
      <Text variant={isPage ? 'price' : 'h3'} as="h2">
        {title}
      </Text>
      <Text className={cn('text-foreground/70', isPage ? 'max-w-135' : 'text-foreground/65')}>{description}</Text>
      {action && <div className={isPage ? 'mt-4 flex flex-wrap justify-center gap-3' : undefined}>{action}</div>}
    </div>
  );
}
