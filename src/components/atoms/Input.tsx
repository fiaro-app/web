import type { InputHTMLAttributes, Ref } from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Marks the border/ring red and sets `aria-invalid`, without owning the error message itself. */
  readonly invalid?: boolean;
  readonly ref?: Ref<HTMLInputElement>;
}

/** A single-line text field. Pair with `Label` and an error message via `FormField` (molecules). */
export function Input({ ref, invalid = false, className, ...props }: InputProps) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid}
      className={cn(
        'h-10 w-full rounded-md border bg-background px-3 text-sm text-foreground transition-colors',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-muted',
        invalid ? 'border-destructive' : 'border-border',
        className,
      )}
      {...props}
    />
  );
}
