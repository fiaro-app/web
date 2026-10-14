import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface StickyToolbarProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Barra de búsqueda y filtros de un listado. En pantallas angostas queda pegada arriba al hacer scroll; desde `md`
 * su marca (`data-list-toolbar`) hace que el panel mida lo que la pantalla y la tabla de debajo se desplace sola
 * (ver `AppShellTemplate` y `RESPONSIVE_TABLE.wrapper`), así filtros, cabecera y paginación siempre se ven.
 */
export function StickyToolbar({ children, className }: Readonly<StickyToolbarProps>) {
  return (
    <div
      data-list-toolbar=""
      className={cn('sticky top-0 z-20 -mx-5 -my-3 flex flex-col gap-4 bg-background px-5 py-3 sm:-mx-8 sm:px-8', className)}
    >
      {children}
    </div>
  );
}
