import type { ReactNode } from 'react';

/** Tabla simple sobre superficie: encabezados con su `scope` y filas separadas por una línea. Las filas (`<tr>`) las pone quien la usa. */
export function PlainTable({ columns, children }: Readonly<{ columns: readonly string[]; children: ReactNode }>) {
  return (
    <div className="overflow-x-auto rounded-md bg-surface">
      <table className="w-full text-left text-body">
        <thead>
          <tr className="text-foreground/70">
            {columns.map((label) => (
              <th key={label} scope="col" className="px-4 py-3 font-medium">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-foreground/8">{children}</tbody>
      </table>
    </div>
  );
}
