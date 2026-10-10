import type { ReactNode } from 'react';
import { RESPONSIVE_TABLE } from '@/components/organisms/responsive-table';
import { cn } from '@/lib/cn';

export interface ResponsiveTableProps {
  /** Descripción para lectores de pantalla (la tabla no la muestra). */
  readonly caption: string;
  /** Encabezados de las columnas de datos; la última columna (acciones) se agrega sola. */
  readonly headers: readonly string[];
  /** Ancho mínimo desde `md` (`md:min-w-150`); debajo la tabla se vuelve una lista de tarjetas. */
  readonly minWidthClass: string;
  /** Si la tabla lleva una última columna de acciones (por defecto sí); sin ella cada fila omite su `<td>` final. */
  readonly withActions?: boolean;
  /** Las filas (`<tr>`) con las clases de `RESPONSIVE_TABLE`. */
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Cascarón común de las tablas del panel: tabla con encabezados desde `md` y tarjetas en pantallas
 * angostas. Cada tabla aporta solo sus filas. Solo presentación.
 */
export function ResponsiveTable({
  caption,
  headers,
  minWidthClass,
  withActions = true,
  children,
  className,
}: Readonly<ResponsiveTableProps>) {
  return (
    <div className={cn(RESPONSIVE_TABLE.wrapper, className)}>
      <table className={cn(RESPONSIVE_TABLE.table, minWidthClass)}>
        <caption className="sr-only">{caption}</caption>
        <thead className={RESPONSIVE_TABLE.head}>
          <tr className="border-b border-foreground/8">
            {headers.map((header) => (
              <th key={header} scope="col" className="px-5 py-3.5 text-caption font-semibold text-foreground/65">
                {header}
              </th>
            ))}
            {withActions && (
              <th scope="col" className="px-5 py-3.5">
                <span className="sr-only">Acciones</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className={RESPONSIVE_TABLE.body}>{children}</tbody>
      </table>
    </div>
  );
}
