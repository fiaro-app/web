import { Text } from '@/components/atoms/Text';
import { cn } from '@/lib/cn';

export interface KpiTileProps {
  readonly label: string;
  readonly value: string;
  /** Clase de color del valor (`text-success`, `text-destructive`…); sin ella va en tinta. */
  readonly valueClassName?: string;
  /** Versión pequeña (etiqueta de 9px y cifra de 14px) para la tarjeta de Login y Registro. */
  readonly compact?: boolean;
  readonly className?: string;
}

/** Mini indicador de las maquetas de marketing: etiqueta diminuta y una cifra en Fraunces. */
export function KpiTile({ label, value, valueClassName, compact = false, className }: Readonly<KpiTileProps>) {
  return (
    <div className={cn('flex flex-col rounded-sm bg-background', compact ? 'gap-0.5 p-2.5' : 'gap-1 p-3', className)}>
      <span className={cn('text-foreground/60', compact ? 'text-[9px]' : 'text-[10px]')}>{label}</span>
      {compact ? (
        <span className={cn('font-display text-label leading-tight font-semibold', valueClassName)}>{value}</span>
      ) : (
        <Text variant="body" as="span" weight="semibold" className={cn('font-display', valueClassName)}>
          {value}
        </Text>
      )}
    </div>
  );
}
