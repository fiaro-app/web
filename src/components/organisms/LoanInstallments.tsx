import { StatePill } from '@/components/atoms/StatePill';
import { Text } from '@/components/atoms/Text';
import { ResponsiveTable } from '@/components/organisms/ResponsiveTable';
import { RESPONSIVE_TABLE } from '@/components/organisms/responsive-table';
import { LOANS_TEXT } from '@/content/loans';
import type { InstallmentRow, InstallmentsSummary } from '@/features/loans/installments-view-model';

export interface LoanInstallmentsProps {
  readonly rows: readonly InstallmentRow[];
  readonly summary: InstallmentsSummary;
}

/** Calendario de cuotas de un préstamo (`Detalle de préstamo — Calendario`): cada cuota con lo pagado y su estado. Solo presentación. */
export function LoanInstallments({ rows, summary }: Readonly<LoanInstallmentsProps>) {
  const text = LOANS_TEXT.installments;

  return (
    <section aria-labelledby="installments-title" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Text variant="h3" as="h2" id="installments-title">
          {text.title}
        </Text>
        {rows.length > 0 && (
          <p className="text-label text-foreground/70">{text.summary(summary.paid, summary.total, summary.overdue)}</p>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="text-label text-foreground/70">{text.empty}</p>
      ) : (
        <ResponsiveTable caption={text.caption} headers={text.headers} minWidthClass="md:min-w-150" withActions={false} className="max-h-112 overflow-y-auto">
          {rows.map((row) => (
            <tr key={row.number} className={RESPONSIVE_TABLE.row}>
              <th scope="row" className={RESPONSIVE_TABLE.rowHeader}>
                {row.number}
              </th>
              <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[1]}>
                {row.dueDate}
              </td>
              <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[2]}>
                {row.expected}
              </td>
              <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[3]}>
                {row.paid}
              </td>
              <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[4]}>
                <StatePill tone={row.statusTone}>{row.status}</StatePill>
              </td>
            </tr>
          ))}
        </ResponsiveTable>
      )}
    </section>
  );
}
