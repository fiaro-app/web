import { KpiTile } from '@/components/molecules/KpiTile';
import { cn } from '@/lib/cn';

export interface PreviewKpi {
  readonly label: string;
  readonly value: string;
  /** Clase de color del valor (`text-success`, `text-destructive`…); sin ella va en tinta. */
  readonly valueClassName?: string;
}

export interface PreviewBar {
  /** Nombre accesible del tramo (p. ej. "1 a 5 días"). */
  readonly label: string;
  /** Ancho relativo de la barra respecto a la pista, como clase de Tailwind (`w-3/5`). */
  readonly widthClassName: string;
  /** Color de la barra, como clase de Tailwind (`bg-[#d9720a]`). */
  readonly colorClassName: string;
}

export interface DashboardPreviewProps {
  readonly kpis: readonly PreviewKpi[];
  readonly chartTitle: string;
  readonly bars: readonly PreviewBar[];
  readonly className?: string;
}

/**
 * Maqueta ilustrativa del panel dentro de una ventana de navegador (puntos, KPIs y barras de mora
 * por antigüedad). Es solo decoración de marketing: no muestra datos reales.
 */
export function DashboardPreview({ kpis, chartTitle, bars, className }: Readonly<DashboardPreviewProps>) {
  return (
    <div
      role="img"
      aria-label="Vista previa del panel de Fiaro con la cartera total, lo cobrado hoy y la mora por antigüedad"
      className={cn(
        'overflow-hidden rounded-md border border-foreground/10 bg-surface text-foreground shadow-sm',
        className,
      )}
    >
      <div aria-hidden="true" className="flex items-center gap-1.5 bg-surface-3 px-3.5 py-2.5">
        <span className="size-2.5 rounded-full bg-destructive" />
        <span className="size-2.5 rounded-full bg-warning" />
        <span className="size-2.5 rounded-full bg-success" />
      </div>
      <div aria-hidden="true" className="flex flex-col gap-3.5 p-6">
        <div className="grid grid-cols-3 gap-2.5">
          {kpis.map((kpi) => (
            <KpiTile key={kpi.label} {...kpi} />
          ))}
        </div>
        <div className="flex flex-col gap-2.5 rounded-sm bg-background p-4">
          <span className="text-[11px] font-semibold">{chartTitle}</span>
          {bars.map((bar) => (
            <div key={bar.label} className="h-2 rounded-[4px] bg-foreground/8">
              <div className={cn('h-2 rounded-[4px]', bar.widthClassName, bar.colorClassName)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
