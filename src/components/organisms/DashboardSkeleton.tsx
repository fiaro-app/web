import { Skeleton } from '@/components/atoms/Skeleton';

const KPI_PLACEHOLDERS = ['portfolio', 'collected', 'collectors', 'effectiveness', 'arrears'] as const;

/** Esqueleto del resumen mientras llegan los datos: título, cinco indicadores y la tabla. */
export function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Cargando el resumen" className="flex flex-col gap-7">
      <Skeleton className="h-8 w-40 rounded-sm" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {KPI_PLACEHOLDERS.map((id) => (
          <Skeleton key={id} className="h-24 rounded-md" />
        ))}
      </div>
      <Skeleton className="h-52 rounded-md" />
    </div>
  );
}
