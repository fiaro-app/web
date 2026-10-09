import type { ButtonHTMLAttributes, Ref } from 'react';
import { cn } from '@/lib/cn';

export interface FilterPillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Filtro activo: relleno de marca. Se anuncia con `aria-pressed`. */
  readonly selected?: boolean;
  readonly ref?: Ref<HTMLButtonElement>;
}

/** Píldora de filtro (12px medium): en reposo con borde en tinta, seleccionada con relleno de marca. */
export function FilterPill({
  ref,
  type = 'button',
  selected = false,
  className,
  ...props
}: Readonly<FilterPillProps>) {
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={selected}
      className={cn(
        'inline-flex items-center justify-center rounded-full border px-3.5 py-2 text-caption font-medium whitespace-nowrap transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-40',
        selected
          ? 'border-primary bg-primary text-primary-foreground enabled:hover:opacity-85'
          : 'border-foreground bg-surface text-foreground enabled:hover:bg-black/6 enabled:active:bg-black/10',
        className,
      )}
      {...props}
    />
  );
}
