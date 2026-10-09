import { ButtonLink } from '@/components/atoms/ButtonLink';
import { StatePill, type StatePillTone } from '@/components/atoms/StatePill';
import { LOANS_TEXT } from '@/content/loans';
import type { LoanRow, LoanStatusTone } from '@/features/loans/loans-view-model';
import { ResponsiveTable } from '@/components/organisms/ResponsiveTable';
import { RESPONSIVE_TABLE } from '@/components/organisms/responsive-table';

/** Activo en verde, pagado en anil y anulado atenuado. */
const PILL_TONE: Record<LoanStatusTone, StatePillTone> = { info: 'success', success: 'info', muted: 'muted' };

export interface LoansTableProps {
  readonly rows: readonly LoanRow[];
  readonly className?: string;
}

/** Tabla de préstamos (cliente, monto, cuotas, frecuencia, inicio y estado). Solo presentación. */
export function LoansTable({ rows, className }: Readonly<LoansTableProps>) {
  return (
    <ResponsiveTable
      caption={LOANS_TEXT.tableCaption}
      headers={LOANS_TEXT.headers}
      minWidthClass="md:min-w-210"
      className={className}
    >
      {rows.map((row) => (
        <tr key={row.id} className={RESPONSIVE_TABLE.row}>
          <th scope="row" className={RESPONSIVE_TABLE.rowHeader}>
            {row.clientName}
          </th>
          <td className={RESPONSIVE_TABLE.cell} data-label={LOANS_TEXT.headers[1]}>
            {row.principal}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={LOANS_TEXT.headers[2]}>
            {row.installments}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={LOANS_TEXT.headers[3]}>
            {row.paid}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={LOANS_TEXT.headers[4]}>
            {row.balance}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={LOANS_TEXT.headers[5]}>
            {row.startDate}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={LOANS_TEXT.headers[6]}>
            <StatePill tone={PILL_TONE[row.statusTone]}>{row.status}</StatePill>
          </td>
          <td className={RESPONSIVE_TABLE.action}>
            <ButtonLink
              variant="outline"
              href={`/prestamos/${row.id}`}
              aria-label={`${LOANS_TEXT.view} préstamo de ${row.clientName}`}
            >
              {LOANS_TEXT.view}
            </ButtonLink>
          </td>
        </tr>
      ))}
    </ResponsiveTable>
  );
}
