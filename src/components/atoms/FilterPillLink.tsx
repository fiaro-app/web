import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { filterPillClasses } from '@/components/atoms/filter-pill-styles';

export interface FilterPillLinkProps extends ComponentProps<typeof NextLink> {
  /** Filtro activo: relleno de marca. Se anuncia con `aria-current`. */
  readonly selected?: boolean;
}

/**
 * Píldora de filtro que navega (`?estado=…`): el filtro vive en la URL, así que funciona sin
 * JavaScript y se puede compartir. Misma apariencia que `FilterPill`.
 */
export function FilterPillLink({ selected = false, className, ...props }: Readonly<FilterPillLinkProps>) {
  return <NextLink aria-current={selected ? 'true' : undefined} className={cn(filterPillClasses(selected), className)} {...props} />;
}
