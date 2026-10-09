import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type LinkSize = 'label' | 'small' | 'caption';

/** Tamaño de letra del enlace: 14px (`label`, por defecto), 13px o 12px. `cn` no resuelve choques de clases, por eso es una prop y no un `className`. */
const SIZE_CLASSES: Record<LinkSize, string> = { label: 'text-label', small: 'text-small', caption: 'text-caption' };

export interface LinkProps extends ComponentProps<typeof NextLink> {
  readonly size?: LinkSize;
}

/** Enlace de texto en color de marca (14px medium por defecto); subraya al hacer hover y atenúa al presionar. */
export function Link({ size = 'label', className, ...props }: Readonly<LinkProps>) {
  return (
    <NextLink
      className={cn(
        SIZE_CLASSES[size],
        'rounded-sm font-medium text-primary underline-offset-4 transition-opacity',
        'hover:underline active:opacity-70',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    />
  );
}
