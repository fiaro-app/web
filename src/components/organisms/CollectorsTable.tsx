import { ButtonLink } from '@/components/atoms/ButtonLink';
import { StatePill } from '@/components/atoms/StatePill';
import { ResponsiveTable } from '@/components/organisms/ResponsiveTable';
import { RESPONSIVE_TABLE } from '@/components/organisms/responsive-table';
import { COLLECTORS_TEXT } from '@/content/collectors';
import type { CollectorRow } from '@/features/collectors/collectors-view-model';

export interface CollectorsTableProps {
  readonly rows: readonly CollectorRow[];
  readonly className?: string;
}

/** Tabla de cobradores (nombre, teléfono, cartera y estado). Solo presentación. */
export function CollectorsTable({ rows, className }: Readonly<CollectorsTableProps>) {
  return (
    <ResponsiveTable
      caption={COLLECTORS_TEXT.tableCaption}
      headers={COLLECTORS_TEXT.headers}
      minWidthClass="md:min-w-150"
      className={className}
    >
      {rows.map((row) => (
        <tr key={row.id} className={RESPONSIVE_TABLE.row}>
          <th scope="row" className={RESPONSIVE_TABLE.rowHeader}>
            {row.fullName}
          </th>
          <td className={RESPONSIVE_TABLE.cell} data-label={COLLECTORS_TEXT.headers[1]}>
            {row.phone}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={COLLECTORS_TEXT.headers[2]}>
            {row.portfolioName}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={COLLECTORS_TEXT.headers[3]}>
            <StatePill tone={row.active ? 'success' : 'muted'}>
              {row.active ? COLLECTORS_TEXT.active : COLLECTORS_TEXT.inactive}
            </StatePill>
          </td>
          <td className={RESPONSIVE_TABLE.action}>
            <ButtonLink
              variant="outline"
              href={`/cobradores/${row.id}`}
              aria-label={`${COLLECTORS_TEXT.manage.manage} ${row.fullName}`}
            >
              {COLLECTORS_TEXT.manage.manage}
            </ButtonLink>
          </td>
        </tr>
      ))}
    </ResponsiveTable>
  );
}
