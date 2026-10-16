import { Skeleton } from '@/components/atoms/Skeleton';

/** Campos de relleno con clave estable (no se reordenan). */
const FIELD_IDS = ['a', 'b', 'c', 'd'] as const;

/**
 * Marcador de una pantalla de detalle o de edición que carga: el título, un formulario a la izquierda y el panel lateral a la
 * derecha (solo desde `lg`, como la pantalla real). Solo presentación.
 */
export function DetailSkeleton() {
  return (
    <div role="status" aria-label="Cargando" className="flex flex-col gap-7">
      <Skeleton className="h-9 w-64 max-w-full rounded-sm" />
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,32rem)_minmax(0,26rem)]">
        <div className="flex max-w-lg flex-col gap-5">
          {FIELD_IDS.map((id) => (
            <div key={id} className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32 rounded-sm" />
              <Skeleton className="h-12 w-full rounded-sm" />
            </div>
          ))}
          <Skeleton className="h-12 w-40 rounded-sm" />
        </div>
        <Skeleton className="hidden h-72 w-full rounded-lg lg:block" />
      </div>
      <span className="sr-only">Cargando…</span>
    </div>
  );
}
