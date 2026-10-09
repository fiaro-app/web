import { cn } from '@/lib/cn';
import { getInitials } from '@/lib/initials';
import { Skeleton } from '@/components/atoms/Skeleton';

export interface AvatarProps {
  /** Nombre completo de la persona: de aquí salen las iniciales y el nombre accesible. */
  readonly name: string;
  /** Muestra el círculo gris de carga en lugar de las iniciales. */
  readonly loading?: boolean;
  readonly className?: string;
}

/** Círculo de 40px con las iniciales de una persona, en color de marca. */
export function Avatar({ name, loading = false, className }: Readonly<AvatarProps>) {
  if (loading) {
    return <Skeleton className={cn('size-10 shrink-0 rounded-full', className)} />;
  }

  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-label font-medium text-primary-foreground select-none',
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
