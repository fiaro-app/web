import { cn } from '@/lib/cn';

export interface SkeletonProps {
  /** Tamaño y forma (`h-6 w-14 rounded-full`): el skeleton no impone ninguno por defecto. */
  readonly className?: string;
}

/** Bloque gris pulsante (`color.base.skeleton`) que ocupa el lugar de un contenido que aún carga. */
export function Skeleton({ className }: Readonly<SkeletonProps>) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse bg-skeleton motion-reduce:animate-none', className)}
    />
  );
}
