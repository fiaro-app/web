import { Link } from '@/components/atoms/Link';
import { SETTLEMENTS_TEXT } from '@/content/settlements';
import type { SettlementRow } from '@/features/settlements/settlements-view-model';
import { cn } from '@/lib/cn';
import { FIGURE_TEXT_CLASSES } from '@/lib/tone';

export interface SettlementsTableProps {
  readonly rows: readonly SettlementRow[];
  readonly className?: string;
}

/** Tabla de cuadres (cobrador, cartera, fecha, montos, diferencia y estado). Solo presentación. */
export function SettlementsTable({ rows, className }: Readonly<SettlementsTableProps>) {
  return (
    <div className={cn('overflow-x-auto rounded-md bg-surface', className)}>
      <table className="w-full min-w-215 border-collapse text-left text-label">
        <caption className="sr-only">{SETTLEMENTS_TEXT.tableCaption}</caption>
        <thead>
          <tr className="border-b border-foreground/8">
            {SETTLEMENTS_TEXT.headers.map((header) => (
              <th key={header} scope="col" className="px-5 py-3.5 text-caption font-semibold text-foreground/60">
                {header}
              </th>
            ))}
            <th scope="col" className="px-5 py-3.5">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-foreground/8">
          {rows.map((row) => (
            <tr key={row.id}>
              <th scope="row" className="px-5 py-5 font-normal">
                {row.collectorName}
              </th>
              <td className="px-5 py-5">{row.portfolioName}</td>
              <td className="px-5 py-5">{row.date}</td>
              <td className="px-5 py-5">{row.expected}</td>
              <td className="px-5 py-5">{row.collected}</td>
              <td className={cn('px-5 py-5', row.difference && `font-semibold ${FIGURE_TEXT_CLASSES[row.differenceTone]}`)}>
                {row.difference ?? '—'}
              </td>
              <td className={cn('px-5 py-5 font-semibold', FIGURE_TEXT_CLASSES[row.statusTone])}>{row.status}</td>
              <td className="px-5 py-5 text-right">
                <Link href={`/cuadres/${row.id}`} aria-label={`${row.reviewable ? SETTLEMENTS_TEXT.review : SETTLEMENTS_TEXT.view} cuadre de ${row.collectorName}`}>
                  {row.reviewable ? SETTLEMENTS_TEXT.review : SETTLEMENTS_TEXT.view}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
