import type { InputHTMLAttributes, Ref } from 'react';
import { cn } from '@/lib/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  readonly invalid?: boolean;
  readonly ref?: Ref<HTMLInputElement>;
}

/**
 * Casilla de 20px (`<input type="checkbox">` nativo con otro aspecto, así conserva teclado,
 * formularios y lectores de pantalla). Estados: sin marcar, marcada, foco, error y
 * deshabilitada. No trae texto: se acompaña con un `Label htmlFor` o un `aria-label`.
 * `className` va en el contenedor.
 */
export function Checkbox({ ref, invalid = false, className, ...props }: Readonly<CheckboxProps>) {
  return (
    <span className={cn('relative inline-flex size-5 shrink-0 has-[:disabled]:opacity-40', className)}>
      <input
        ref={ref}
        type="checkbox"
        aria-invalid={invalid}
        className={cn(
          'peer size-5 cursor-pointer appearance-none rounded-sm border-[1.5px] bg-surface transition-colors',
          'checked:border-primary checked:bg-primary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed',
          invalid ? 'border-destructive' : 'border-foreground',
        )}
        {...props}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="pointer-events-none absolute inset-0 size-5 text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100"
      >
        <path
          d="M5.5 10.5l3 3 6-6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
