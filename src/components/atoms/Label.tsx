import type { LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  readonly required?: boolean;
}

/** A form field's caption. `required` adds a visual `*`, not a validation rule. */
export function Label({ required = false, className, children, ...props }: LabelProps) {
  return (
    <label className={cn('text-sm font-medium text-foreground', className)} {...props}>
      {children}
      {required && (
        <span className="ml-0.5 text-destructive" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}
