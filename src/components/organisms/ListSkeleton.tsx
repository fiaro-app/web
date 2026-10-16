import { Skeleton } from '@/components/atoms/Skeleton';

/** Filas de relleno con clave estable (no se reordenan, pero evita usar el índice del arreglo como `key`). */
const ROW_IDS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

/** Marcador de una lista que carga (`Estado — Cargando lista`): una tarjeta con encabezado y filas grises. Solo presentación. */
export function ListSkeleton() {
  return (
    <div role="status" aria-label="Cargando" className="flex flex-col gap-7">
      <Skeleton className="h-9 w-64 rounded-sm" />
      <div className="flex flex-col rounded-lg bg-surface p-5">
        <Skeleton className="h-5 w-full rounded-sm" />
        <ul className="mt-6 flex flex-col">
          {ROW_IDS.map((id) => (
            <li key={id} className="flex items-center gap-4 border-t border-foreground/8 py-5 first:border-t-0 md:gap-12 md:py-7">
              <Skeleton className="h-4 w-40 max-w-full rounded-sm md:w-64" />
              <Skeleton className="hidden h-4 w-40 rounded-sm md:block" />
              <Skeleton className="hidden h-4 w-36 rounded-sm md:block" />
              <Skeleton className="h-6 w-24 rounded-full max-md:ml-auto" />
            </li>
          ))}
        </ul>
      </div>
      <span className="sr-only">Cargando…</span>
    </div>
  );
}
