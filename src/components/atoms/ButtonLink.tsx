import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { buttonClasses, type ButtonSize, type ButtonVariant } from '@/components/atoms/button-styles';

export interface ButtonLinkProps extends ComponentProps<typeof NextLink> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
}

/**
 * Un enlace con la apariencia de `Button`, para acciones que navegan ("Comenzar gratis" →
 * `/registro`). Semánticamente es un `<a>`; usa `Button` cuando la acción no cambia de página.
 */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: Readonly<ButtonLinkProps>) {
  return (
    <NextLink
      className={cn(buttonClasses(variant, size), 'hover:opacity-85 active:opacity-70', className)}
      {...props}
    />
  );
}
