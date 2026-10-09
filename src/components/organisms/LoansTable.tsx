import { ButtonLink } from '@/components/atoms/ButtonLink';
import { StatePill, type StatePillTone } from '@/components/atoms/StatePill';
import { LOANS_TEXT } from '@/content/loans';
import type { LoanRow, LoanStatusTone } from '@/features/loans/loans-view-model';
import { cn } from '@/lib/cn';

/** Activo en verde, pagado en anil y anulado atenuado. */
const PILL_TONE: Record<LoanStatusTone, StatePillTone> = { info: 'success', success: 'info', muted: 'muted' };

export interface LoansTableProps {
  readonly rows: readonly LoanRow[];
  readonly className?: string;
}

/** Tabla de préstamos (cliente, monto, cuotas, frecuencia, inicio y estado). Solo presentación. */
export function LoansTable({ rows, className }: Readonly<LoansTableProps>) {
  return (
    <div className={cn('overflow-x-auto rounded-md bg-surface', className)}>
      <table className="w-full min-w-210 border-collapse text-left text-label">
        <caption className="sr-only">{LOANS_TEXT.tableCaption}</caption>
        <thead>
          <tr className="border-b border-foreground/8">
            {LOANS_TEXT.headers.map((header) => (
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
                {row.clientName}
              </th>
              <td className="px-5 py-5">{row.principal}</td>
              <td className="px-5 py-5">{row.installments}</td>
              <td className="px-5 py-5">{row.paid}</td>
              <td className="px-5 py-5">{row.balance}</td>
              <td className="px-5 py-5">{row.startDate}</td>
              <td className="px-5 py-5">
                <StatePill tone={PILL_TONE[row.statusTone]}>{row.status}</StatePill>
              </td>
              <td className="px-5 py-3.5 text-right">
                <ButtonLink variant="outline" href={`/prestamos/${row.id}`} aria-label={`${LOANS_TEXT.view} préstamo de ${row.clientName}`}>
                  {LOANS_TEXT.view}
                </ButtonLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
