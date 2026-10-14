import { Text } from '@/components/atoms/Text';
import { cn } from '@/lib/cn';
import { FIGURE_TEXT_CLASSES, type FigureTone } from '@/lib/tone';
import type { Trend } from '@/lib/trend';

export interface StatTileProps {
  readonly label: string;
  readonly value: string;
  readonly tone?: FigureTone;
  /** Cambio frente al período anterior; sin él no se muestra nada. */
  readonly trend?: Trend | null;
  readonly className?: string;
}

/** Indicador del resumen: una etiqueta y una cifra grande en Fraunces, con el color de su tono. */
export function StatTile({ label, value, tone = 'neutral', trend = null, className }: Readonly<StatTileProps>) {
  return (
    <div className={cn('flex flex-col gap-2 rounded-md bg-surface p-5', className)}>
      <span className="text-small font-medium text-foreground/70">{label}</span>
      <Text variant="title" as="span" className={FIGURE_TEXT_CLASSES[tone]}>
        {value}
      </Text>
      {trend && (
        <span className={cn('text-small font-medium', FIGURE_TEXT_CLASSES[trend.tone])}>
          <span aria-hidden="true">{trend.label}</span>
          <span className="sr-only">{trend.description}</span>
        </span>
      )}
    </div>
  );
}
