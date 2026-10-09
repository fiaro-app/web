import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type LinkProps = ComponentProps<typeof NextLink>;

/** Enlace de texto en color de marca (14px medium); subraya al hacer hover y atenúa al presionar. */
export function Link({ className, ...props }: Readonly<LinkProps>) {
  return (
    <NextLink
      className={cn(
        'rounded-sm text-label font-medium text-primary underline-offset-4 transition-opacity',
        'hover:underline active:opacity-70',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    />
  );
}
