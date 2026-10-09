import { cn } from '@/lib/cn';

export interface ActivityItemProps {
  readonly text: string;
  readonly className?: string;
}

/** Línea de actividad de una maqueta: punto de marca y un texto corto ("Alejo cerró su ruta"). */
export function ActivityItem({ text, className }: Readonly<ActivityItemProps>) {
  return (
    <div className={cn('flex items-center gap-2 rounded-sm bg-background px-2.5 py-1.5', className)}>
      <span aria-hidden="true" className="size-6 shrink-0 rounded-full bg-primary" />
      <span className="text-[11px]">{text}</span>
    </div>
  );
}
