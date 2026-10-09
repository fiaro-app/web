import { Link } from '@/components/atoms/Link';
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
    <div className={cn('overflow-x-auto rounded-md bg-surface', className)}>
      <table className="w-full min-w-190 border-collapse text-left text-label">
        <caption className="sr-only">Cuadres pendientes de aprobar</caption>
        <thead>
          <tr className="border-b border-foreground/8">
            {HEADERS.map((header) => (
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
          {settlements.map((settlement) => (
            <tr key={settlement.id}>
              <th scope="row" className="px-5 py-5 font-normal">
                {settlement.collectorName}
              </th>
              <td className="px-5 py-5">{settlement.portfolioName}</td>
              <td className="px-5 py-5">{settlement.date}</td>
              <td className="px-5 py-5">{settlement.expected}</td>
              <td className="px-5 py-5">{settlement.collected}</td>
              <td className={cn('px-5 py-5', settlement.difference && `font-semibold ${FIGURE_TEXT_CLASSES[settlement.differenceTone]}`)}>
                {settlement.difference ?? '—'}
              </td>
              <td className="px-5 py-5 text-right">
                <Link href={`/cuadres/${settlement.id}`} aria-label={`Revisar cuadre de ${settlement.collectorName}`}>
                  Revisar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
