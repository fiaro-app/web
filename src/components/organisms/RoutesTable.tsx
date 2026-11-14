import { Link } from '@/components/atoms/Link';
import { ResponsiveTable } from '@/components/organisms/ResponsiveTable';
import { RESPONSIVE_TABLE } from '@/components/organisms/responsive-table';
import { ROUTES_TEXT } from '@/content/routes';
import type { RouteRow } from '@/features/routes/routes-view-model';

/** Tabla del registro de rutas: un renglón por cobrador y día, con el enlace a sus visitas. Solo presentación. */
export function RoutesTable({ rows }: Readonly<{ rows: readonly RouteRow[] }>) {
  const text = ROUTES_TEXT;

  return (
    <ResponsiveTable caption={text.tableCaption} headers={text.headers} minWidthClass="md:min-w-225">
      {rows.map((row) => (
        <tr key={row.key} className={RESPONSIVE_TABLE.row}>
          <th scope="row" className={RESPONSIVE_TABLE.rowHeader}>
            {row.date}
          </th>
          <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[1]}>
            {row.collectorName}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[2]}>
            {row.startedAt}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[3]}>
            {row.endedAt}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[4]}>
            {row.visits}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[5]}>
            {row.paid}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[6]}>
            {row.collected}
          </td>
          <td className={RESPONSIVE_TABLE.action}>
            <Link href={row.visitsHref} aria-label={text.viewVisitsFor(row.collectorName, row.date)}>
              {text.viewVisits}
            </Link>
          </td>
        </tr>
      ))}
    </ResponsiveTable>
  );
}
