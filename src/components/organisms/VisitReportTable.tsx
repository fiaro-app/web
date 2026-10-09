import { Link } from '@/components/atoms/Link';
import { StatePill } from '@/components/atoms/StatePill';
import { ResponsiveTable } from '@/components/organisms/ResponsiveTable';
import { RESPONSIVE_TABLE } from '@/components/organisms/responsive-table';
import { VISITS_TEXT } from '@/content/visits';
import type { VisitReportRow } from '@/features/visits/visits-view-model';

export interface VisitReportTableProps {
  readonly rows: readonly VisitReportRow[];
}

/** Tabla de «Cobros del día»: cada visita con su cliente, cobrador, resultado y lo cobrado. Solo presentación. */
export function VisitReportTable({ rows }: Readonly<VisitReportTableProps>) {
  const text = VISITS_TEXT.report;

  return (
    <ResponsiveTable caption={text.tableCaption} headers={text.headers} minWidthClass="md:min-w-225">
      {rows.map((row) => (
        <tr key={row.id} className={RESPONSIVE_TABLE.row}>
          <th scope="row" className={RESPONSIVE_TABLE.rowHeader}>
            {row.time}
          </th>
          <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[1]}>
            {row.clientName}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[2]}>
            {row.collectorName}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[3]}>
            <span className="flex flex-col items-start gap-1">
              <StatePill tone={row.outcomeTone}>{row.outcome}</StatePill>
              {row.note && <span className="text-caption text-foreground/60">{row.note}</span>}
            </span>
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[4]}>
            {row.expected}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[5]}>
            <span className={row.reverted ? 'text-foreground/50 line-through' : undefined}>{row.collected}</span>
            {row.reverted && <StatePill tone="muted">{VISITS_TEXT.reversed}</StatePill>}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[6]}>
            {row.method}
          </td>
          <td className={RESPONSIVE_TABLE.action}>
            <Link href={`/prestamos/${row.loanId}`} aria-label={`${text.viewLoan} de ${row.clientName}`}>
              {text.viewLoan}
            </Link>
          </td>
        </tr>
      ))}
    </ResponsiveTable>
  );
}
