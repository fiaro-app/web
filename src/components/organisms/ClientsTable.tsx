import { ButtonLink } from '@/components/atoms/ButtonLink';
import { CLIENTS_TEXT } from '@/content/clients';
import type { ClientRow } from '@/features/clients/clients-view-model';
import { ResponsiveTable } from '@/components/organisms/ResponsiveTable';
import { RESPONSIVE_TABLE } from '@/components/organisms/responsive-table';

export interface ClientsTableProps {
  readonly rows: readonly ClientRow[];
  readonly className?: string;
}

/** Tabla de clientes (nombre, cédula, teléfono y oficio). Solo presentación. */
export function ClientsTable({ rows, className }: Readonly<ClientsTableProps>) {
  return (
    <ResponsiveTable
      caption={CLIENTS_TEXT.tableCaption}
      headers={CLIENTS_TEXT.headers}
      minWidthClass="md:min-w-150"
      className={className}
    >
      {rows.map((row) => (
        <tr key={row.id} className={RESPONSIVE_TABLE.row}>
          <th scope="row" className={RESPONSIVE_TABLE.rowHeader}>
            {row.fullName}
          </th>
          <td className={RESPONSIVE_TABLE.cell} data-label={CLIENTS_TEXT.headers[1]}>
            {row.nationalId}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={CLIENTS_TEXT.headers[2]}>
            {row.phone}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={CLIENTS_TEXT.headers[3]}>
            {row.occupation}
          </td>
          <td className={RESPONSIVE_TABLE.action}>
            <ButtonLink
              variant="outline"
              href={`/clientes/${row.id}`}
              aria-label={`${CLIENTS_TEXT.edit} ${row.fullName}`}
            >
              {CLIENTS_TEXT.edit}
            </ButtonLink>
          </td>
        </tr>
      ))}
    </ResponsiveTable>
  );
}
