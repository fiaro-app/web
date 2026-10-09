import { ButtonLink } from '@/components/atoms/ButtonLink';
import { ResponsiveTable } from '@/components/organisms/ResponsiveTable';
import { RESPONSIVE_TABLE } from '@/components/organisms/responsive-table';
import { cn } from '@/lib/cn';
import { FIGURE_TEXT_CLASSES } from '@/lib/tone';
import type { PendingSettlementView } from '@/features/dashboard/dashboard-view-model';

const HEADERS = ['Cobrador', 'Cartera', 'Fecha', 'Esperado', 'Cobrado', 'Diferencia'] as const;

export interface PendingSettlementsTableProps {
  readonly settlements: readonly PendingSettlementView[];
  readonly className?: string;
}

/** Tabla de cuadres pendientes de aprobar (cobrador, cartera, fecha, esperado, cobrado y diferencia). Solo presentación. */
export function PendingSettlementsTable({ settlements, className }: Readonly<PendingSettlementsTableProps>) {
  return (
    <ResponsiveTable
      caption={'Cuadres pendientes de aprobar'}
      headers={HEADERS}
      minWidthClass="md:min-w-190"
      className={className}
    >
      {settlements.map((settlement) => (
        <tr key={settlement.id} className={RESPONSIVE_TABLE.row}>
          <th scope="row" className={RESPONSIVE_TABLE.rowHeader}>
            {settlement.collectorName}
          </th>
          <td className={RESPONSIVE_TABLE.cell} data-label={HEADERS[1]}>
            {settlement.portfolioName}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={HEADERS[2]}>
            {settlement.date}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={HEADERS[3]}>
            {settlement.expected}
          </td>
          <td className={RESPONSIVE_TABLE.cell} data-label={HEADERS[4]}>
            {settlement.collected}
          </td>
          <td
            className={cn(
              RESPONSIVE_TABLE.cell,
              settlement.difference && `font-semibold ${FIGURE_TEXT_CLASSES[settlement.differenceTone]}`,
            )}
            data-label={HEADERS[5]}
          >
            {settlement.difference ?? '—'}
          </td>
          <td className={RESPONSIVE_TABLE.action}>
            <ButtonLink
              variant="outline"
              href={`/cuadres/${settlement.id}`}
              aria-label={`Revisar cuadre de ${settlement.collectorName}`}
            >
              Revisar
            </ButtonLink>
          </td>
        </tr>
      ))}
    </ResponsiveTable>
  );
}
