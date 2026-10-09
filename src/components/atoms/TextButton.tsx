import type { ButtonHTMLAttributes, Ref } from 'react';
import { cn } from '@/lib/cn';

export interface TextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly ref?: Ref<HTMLButtonElement>;
}

/**
 * Acción secundaria de bajo peso visual (p. ej. "Cancelar"): solo texto en tinta, con un velo
 * negro del 6% al hacer hover y del 10% al presionar.
 */
export function TextButton({ ref, type = 'button', className, ...props }: Readonly<TextButtonProps>) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex h-8 items-center justify-center rounded-sm px-3 text-body font-medium text-foreground transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'enabled:hover:bg-black/6 enabled:active:bg-black/10',
        'disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
      {...props}
    />
  );
}
