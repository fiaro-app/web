import type { InputHTMLAttributes, Ref } from 'react';
import { cn } from '@/lib/cn';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  readonly ref?: Ref<HTMLInputElement>;
}

/**
 * Opción de 20px de un grupo (`<input type="radio">` nativo con otro aspecto): anillo en tinta
 * y, al elegirla, anillo y punto central en color de marca. Agrupar con el mismo `name`; el error de
 * un grupo se comunica en el grupo (`fieldset`), no en cada opción. No trae
 * texto: se acompaña con un `Label htmlFor` o un `aria-label`. `className` va en el contenedor.
 */
export function Radio({ ref, className, ...props }: Readonly<RadioProps>) {
  return (
    <span className={cn('relative inline-flex size-5 shrink-0 has-[:disabled]:opacity-40', className)}>
      <input
        ref={ref}
        type="radio"
        className={cn(
          'peer size-5 cursor-pointer appearance-none rounded-full border-[1.5px] bg-transparent transition-colors',
          'checked:border-primary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'border-foreground disabled:cursor-not-allowed',
        )}
        {...props}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 m-auto size-2.5 rounded-full bg-primary opacity-0 transition-opacity peer-checked:opacity-100"
      />
    </span>
  );
}
