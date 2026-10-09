import { Text } from '@/components/atoms/Text';
import { cn } from '@/lib/cn';

export interface KpiTileProps {
  readonly label: string;
  readonly value: string;
  /** Clase de color del valor (`text-success`, `text-destructive`…); sin ella va en tinta. */
  readonly valueClassName?: string;
  readonly className?: string;
}

/** Mini indicador de las maquetas de marketing: etiqueta diminuta y una cifra en Fraunces. */
export function KpiTile({ label, value, valueClassName, className }: Readonly<KpiTileProps>) {
  return (
    <div className={cn('flex flex-col gap-1 rounded-sm bg-background p-3', className)}>
      <span className="text-[10px] text-foreground/60">{label}</span>
      <Text variant="body" as="span" weight="semibold" className={cn('font-display', valueClassName)}>
        {value}
      </Text>
    </div>
  );
}
