import { cn } from '@/lib/cn';
import { COLLECTORS_TEXT } from '@/content/collectors';
import type { CollectorRow } from '@/features/collectors/collectors-view-model';

export interface CollectorsTableProps {
  readonly rows: readonly CollectorRow[];
  readonly className?: string;
}

/** Tabla de cobradores (nombre, teléfono, cartera y estado). Solo presentación. */
export function CollectorsTable({ rows, className }: Readonly<CollectorsTableProps>) {
  return (
    <div className={cn('overflow-x-auto rounded-md bg-surface', className)}>
      <table className="w-full min-w-150 border-collapse text-left text-label">
        <caption className="sr-only">{COLLECTORS_TEXT.tableCaption}</caption>
        <thead>
          <tr className="border-b border-foreground/8">
            {COLLECTORS_TEXT.headers.map((header) => (
              <th key={header} scope="col" className="px-5 py-3.5 text-caption font-semibold text-foreground/60">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-foreground/8">
          {rows.map((row) => (
            <tr key={row.id}>
              <th scope="row" className="px-5 py-5 font-normal">
                {row.fullName}
              </th>
              <td className="px-5 py-5">{row.phone}</td>
              <td className="px-5 py-5">{row.portfolioName}</td>
              <td className={cn('px-5 py-5 font-semibold', row.active ? 'text-success' : 'text-foreground/60')}>
                {row.active ? COLLECTORS_TEXT.active : COLLECTORS_TEXT.inactive}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
