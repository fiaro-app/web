import type { LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  readonly required?: boolean;
}

/** Rótulo de un campo de formulario (12px medium). `required` agrega un `*` visual, no una validación. */
export function Label({ required = false, className, children, ...props }: Readonly<LabelProps>) {
  return (
    <label className={cn('text-caption font-medium text-foreground', className)} {...props}>
      {children}
      {required && (
        <span className="ml-0.5 text-destructive" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}
