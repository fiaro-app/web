import type { ButtonHTMLAttributes, Ref } from 'react';
import { cn } from '@/lib/cn';
import { filterPillClasses } from '@/components/atoms/filter-pill-styles';

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
        filterPillClasses(selected),
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface',
        className,
      )}
      {...props}
    />
  );
}
