import { cn } from '@/lib/cn';
import { getInitials } from '@/lib/initials';
import { Skeleton } from '@/components/atoms/Skeleton';

export type AvatarSize = 'md' | 'sm';

/** `md` = 40px (listas); `sm` = 32px (barra superior). */
const SIZE_CLASSES: Record<AvatarSize, { readonly box: string; readonly text: string }> = {
  md: { box: 'size-10', text: 'text-label' },
  sm: { box: 'size-8', text: 'text-caption' },
};

export interface AvatarProps {
  /** Nombre completo de la persona: de aquí salen las iniciales y el nombre accesible. */
  readonly name: string;
  /** Muestra el círculo gris de carga en lugar de las iniciales. */
  readonly loading?: boolean;
  readonly size?: AvatarSize;
  readonly className?: string;
}

/** Círculo con las iniciales de una persona, en color de marca. */
export function Avatar({ name, loading = false, size = 'md', className }: Readonly<AvatarProps>) {
  const { box, text } = SIZE_CLASSES[size];

  if (loading) {
    return <Skeleton className={cn('shrink-0 rounded-full', box, className)} />;
  }

  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground select-none',
        box,
        text,
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
