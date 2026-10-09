import { Text } from '@/components/atoms/Text';
import { cn } from '@/lib/cn';
import { FIGURE_TEXT_CLASSES, type FigureTone } from '@/lib/tone';

export interface StatTileProps {
  readonly label: string;
  readonly value: string;
  readonly tone?: FigureTone;
  readonly className?: string;
}

/** Indicador del resumen: una etiqueta y una cifra grande en Fraunces, con el color de su tono. */
export function StatTile({ label, value, tone = 'neutral', className }: Readonly<StatTileProps>) {
  return (
    <div className={cn('flex flex-col gap-2 rounded-md bg-surface p-5', className)}>
      <span className="text-small font-medium text-foreground/70">{label}</span>
      <Text variant="title" as="span" className={FIGURE_TEXT_CLASSES[tone]}>
        {value}
      </Text>
    </div>
  );
}
