import { ButtonLink } from '@/components/atoms/ButtonLink';
import { CLIENTS_TEXT } from '@/content/clients';
import type { ClientRow } from '@/features/clients/clients-view-model';
import { ResponsiveTable } from '@/components/organisms/ResponsiveTable';
import { RESPONSIVE_TABLE } from '@/components/organisms/responsive-table';

export interface ClientsTableProps {
  readonly rows: readonly ClientRow[];
  readonly className?: string;
  /** Puede editar clientes: sin esto no se ofrece «Editar». */
  readonly canManage?: boolean;
}

/** Tabla de clientes (nombre y oficio, cédula, teléfono, préstamos activos, saldo y mora). Solo presentación. */
export function ClientsTable({ rows, className, canManage = true }: Readonly<ClientsTableProps>) {
  return (
    <ResponsiveTable caption={CLIENTS_TEXT.tableCaption} headers={CLIENTS_TEXT.headers} minWidthClass="md:min-w-225" className={className}>
      {rows.map((row) => (
        <tr key={row.id} className={RESPONSIVE_TABLE.row}>
          <th scope="row" className={RESPONSIVE_TABLE.rowHeader}>
            <span className="flex flex-col">
              {row.fullName}
              <span className="text-caption font-normal text-foreground/65">{row.occupation}</span>
            </span>
          </th>
          <td className={RESPONSIVE_TABLE.cell} data-label={CLIENTS_TEXT.headers[1]}>
            {row.nationalId}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={CLIENTS_TEXT.headers[2]}>
            {row.phone}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={CLIENTS_TEXT.headers[3]}>
            {row.activeLoans}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={CLIENTS_TEXT.headers[4]}>
            {row.balance}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={CLIENTS_TEXT.headers[5]}>
            <span className="flex flex-col md:items-start">
              <span className={row.isOverdue ? 'font-semibold text-destructive' : undefined}>{row.overdue}</span>
              {row.overdueAmount && <span className="text-caption text-foreground/65">{row.overdueAmount}</span>}
            </span>
          </td>
          <td className={RESPONSIVE_TABLE.action}>
            {canManage && (
              <ButtonLink variant="outline" href={`/clientes/${row.id}`} aria-label={`${CLIENTS_TEXT.edit} ${row.fullName}`}>
                {CLIENTS_TEXT.edit}
              </ButtonLink>
            )}
          </td>
        </tr>
      ))}
    </ResponsiveTable>
  );
}
