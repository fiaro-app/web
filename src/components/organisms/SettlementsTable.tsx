import { ButtonLink } from '@/components/atoms/ButtonLink';
import { StatePill, type StatePillTone } from '@/components/atoms/StatePill';
import { SETTLEMENTS_TEXT } from '@/content/settlements';
import type { SettlementRow } from '@/features/settlements/settlements-view-model';
import { RESPONSIVE_TABLE } from '@/components/organisms/responsive-table';
import { cn } from '@/lib/cn';
import { FIGURE_TEXT_CLASSES, type FigureTone } from '@/lib/tone';

/** Tono de la píldora según el tono de la cifra del estado. */
const PILL_TONE: Record<FigureTone, StatePillTone> = { good: 'success', warning: 'warning', bad: 'error', neutral: 'muted' };

export interface SettlementsTableProps {
  readonly rows: readonly SettlementRow[];
  readonly className?: string;
}

/** Tabla de cuadres (cobrador, cartera, fecha, montos, diferencia y estado). Solo presentación. */
export function SettlementsTable({ rows, className }: Readonly<SettlementsTableProps>) {
  return (
    <div className={cn(RESPONSIVE_TABLE.wrapper, className)}>
      <table className={cn(RESPONSIVE_TABLE.table, 'md:min-w-215')}>
        <caption className="sr-only">{SETTLEMENTS_TEXT.tableCaption}</caption>
        <thead className={RESPONSIVE_TABLE.head}>
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
        <tbody className={RESPONSIVE_TABLE.body}>
          {rows.map((row) => (
            <tr key={row.id} className={RESPONSIVE_TABLE.row}>
              <th scope="row" className={RESPONSIVE_TABLE.rowHeader}>
                {row.collectorName}
              </th>
              <td className={RESPONSIVE_TABLE.cell} data-label={SETTLEMENTS_TEXT.headers[1]}>{row.portfolioName}</td>
              <td className={RESPONSIVE_TABLE.cell} data-label={SETTLEMENTS_TEXT.headers[2]}>{row.date}</td>
              <td className={RESPONSIVE_TABLE.cell} data-label={SETTLEMENTS_TEXT.headers[3]}>{row.expected}</td>
              <td className={RESPONSIVE_TABLE.cell} data-label={SETTLEMENTS_TEXT.headers[4]}>{row.collected}</td>
              <td className={cn(RESPONSIVE_TABLE.cell, row.difference && `font-semibold ${FIGURE_TEXT_CLASSES[row.differenceTone]}`)} data-label={SETTLEMENTS_TEXT.headers[5]}>
                {row.difference ?? '—'}
              </td>
              <td className={RESPONSIVE_TABLE.cell} data-label={SETTLEMENTS_TEXT.headers[6]}>
                <StatePill tone={PILL_TONE[row.statusTone]}>{row.status}</StatePill>
              </td>
              <td className={RESPONSIVE_TABLE.action}>
                <ButtonLink
                  variant="outline"
                  href={`/cuadres/${row.id}`}
                  aria-label={`${row.reviewable ? SETTLEMENTS_TEXT.review : SETTLEMENTS_TEXT.view} cuadre de ${row.collectorName}`}
                >
                  {row.reviewable ? SETTLEMENTS_TEXT.review : SETTLEMENTS_TEXT.view}
                </ButtonLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
