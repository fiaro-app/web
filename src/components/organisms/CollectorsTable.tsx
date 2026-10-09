import { ButtonLink } from '@/components/atoms/ButtonLink';
import { StatePill } from '@/components/atoms/StatePill';
import { RESPONSIVE_TABLE } from '@/components/organisms/responsive-table';
import { cn } from '@/lib/cn';
import { COLLECTORS_TEXT } from '@/content/collectors';
import type { CollectorRow } from '@/features/collectors/collectors-view-model';

export interface CollectorsTableProps {
  readonly rows: readonly CollectorRow[];
  readonly className?: string;
}

/** Tabla de cobradores (nombre, teléfono, cartera y estado). Solo presentación. */
export function CollectorsTable({ rows, className }: Readonly<CollectorsTableProps>) {
  return (
    <div className={cn(RESPONSIVE_TABLE.wrapper, className)}>
      <table className={cn(RESPONSIVE_TABLE.table, 'md:min-w-150')}>
        <caption className="sr-only">{COLLECTORS_TEXT.tableCaption}</caption>
        <thead className={RESPONSIVE_TABLE.head}>
          <tr className="border-b border-foreground/8">
            {COLLECTORS_TEXT.headers.map((header) => (
              <th key={header} scope="col" className="px-5 py-3.5 text-caption font-semibold text-foreground/60">
                {header}
              </th>
            ))}
            <th scope="col" className="px-5 py-3.5 text-caption font-semibold text-foreground/60">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className={RESPONSIVE_TABLE.body}>
          {rows.map((row) => (
            <tr key={row.id} className={RESPONSIVE_TABLE.row}>
              <th scope="row" className={RESPONSIVE_TABLE.rowHeader}>
                {row.fullName}
              </th>
              <td className={RESPONSIVE_TABLE.cell} data-label={COLLECTORS_TEXT.headers[1]}>{row.phone}</td>
              <td className={RESPONSIVE_TABLE.cell} data-label={COLLECTORS_TEXT.headers[2]}>{row.portfolioName}</td>
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
        </tbody>
      </table>
    </div>
  );
}
