import type { Ref, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { fieldClasses } from '@/lib/field-styles';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  readonly invalid?: boolean;
  readonly ref?: Ref<HTMLSelectElement>;
}

/**
 * Lista desplegable nativa (accesible y con teclado gratis) con el aspecto de `Input` y el
 * chevron del diseño. Mismos estados que `Input`. `className` va en el contenedor.
 *
 * @example
 * <Select aria-label="Cobrador"><option>Todos los cobradores</option></Select>
 */
export function Select({
  ref,
  invalid = false,
  className,
  children,
  ...props
}: Readonly<SelectProps>) {
  return (
    <span className={cn('relative inline-flex w-full', className)}>
      <select
        ref={ref}
        aria-invalid={invalid}
        className={cn(fieldClasses(invalid), 'cursor-pointer appearance-none pr-10 text-label')}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-foreground"
      >
        <path
          d="M3.5 6l4.5 4.5L12.5 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
