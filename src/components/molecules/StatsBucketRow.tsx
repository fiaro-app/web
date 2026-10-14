import type { ArrearsBucketView } from '@/features/stats/stats-view-model';

/** Un tramo de la mora por antigüedad: etiqueta, monto, clientes y una barra proporcional al tramo más grande. */
export function StatsBucketRow({ bucket }: Readonly<{ bucket: ArrearsBucketView }>) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-label">
        <span className="font-medium">{bucket.label}</span>
        <span className="text-foreground/70">
          {bucket.amount} · {bucket.clients}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-2" role="presentation">
        <div className="h-full rounded-full bg-warning" style={{ width: `${String(bucket.barPercent)}%` }} />
      </div>
    </div>
  );
}
