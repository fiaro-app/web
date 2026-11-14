import { StatePill } from '@/components/atoms/StatePill';
import { Link } from '@/components/atoms/Link';
import { ResponsiveTable } from '@/components/organisms/ResponsiveTable';
import { RESPONSIVE_TABLE } from '@/components/organisms/responsive-table';
import { COLLECTORS_TODAY_TEXT } from '@/content/collectors-today';
import type { CollectorsTodayViewModel } from '@/features/collectors-today/collectors-today-view-model';

/**
 * «Rutas de hoy»: quién ya empezó su ruta, cuántos préstamos le faltan y cuánto lleva cobrado.
 * Primero aparecen los que no han iniciado. Solo presentación.
 */
export function CollectorsTodaySection({ today }: Readonly<{ today: CollectorsTodayViewModel }>) {
  const text = COLLECTORS_TODAY_TEXT;

  return (
    <section aria-labelledby="collectors-today-title" className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 id="collectors-today-title" className="text-lg font-semibold text-foreground">
          {text.title}
        </h2>
        <p className="text-label text-foreground/70">{today.summary}</p>
      </div>
      {today.rows.length === 0 ? (
        <p className="rounded-md bg-surface p-5 text-label text-foreground/70">{text.empty}</p>
      ) : (
        <ResponsiveTable caption={text.tableCaption} headers={text.headers} minWidthClass="md:min-w-225">
          {today.rows.map((row) => (
            <tr key={row.id} className={RESPONSIVE_TABLE.row}>
              <th scope="row" className={RESPONSIVE_TABLE.rowHeader}>
                <Link href={`/cobradores/${row.id}`}>{row.fullName}</Link>
              </th>
              <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[1]}>
                <StatePill tone={row.statusTone}>{row.statusLabel}</StatePill>
              </td>
              <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[2]}>
                {row.progress}
              </td>
              <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[3]}>
                {row.pending}
              </td>
              <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[4]}>
                {row.collected}
              </td>
              <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[5]}>
                {row.startedAt}
              </td>
              <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[6]}>
                {row.settlement}
              </td>
            </tr>
          ))}
        </ResponsiveTable>
      )}
    </section>
  );
}
