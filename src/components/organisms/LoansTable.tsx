import { Link } from '@/components/atoms/Link';
import { LOAN_STATUS_CLASSES } from '@/components/organisms/loan-status-classes';
import { LOANS_TEXT } from '@/content/loans';
import type { LoanRow } from '@/features/loans/loans-view-model';
import { cn } from '@/lib/cn';

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
              <td className={cn('px-5 py-5 font-semibold', LOAN_STATUS_CLASSES[row.statusTone])}>{row.status}</td>
              <td className="px-5 py-5 text-right">
                <Link href={`/prestamos/${row.id}`} aria-label={`${LOANS_TEXT.view} préstamo de ${row.clientName}`}>
                  {LOANS_TEXT.view}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
