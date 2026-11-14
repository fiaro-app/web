import { cn } from "@/lib/cn";
import type { Segment } from "@/features/insights/insights-view-model";

const BAR_CLASSES: Record<Segment["tone"], string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  muted: "bg-foreground/25",
};

export interface ProportionBarProps {
  readonly segments: readonly Segment[];
  /** Lo que lee un lector de pantalla de toda la barra. */
  readonly label: string;
}

/**
 * Una barra horizontal partida en tramos proporcionales con su leyenda (nombre, cifra y porcentaje). El color
 * no es lo único que distingue un tramo: cada uno está nombrado en la leyenda. Solo presentación.
 */
export function ProportionBar({
  segments,
  label,
}: Readonly<ProportionBarProps>) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const share = (value: number) => (total === 0 ? 0 : (value / total) * 100);

  return (
    <div className="flex flex-col gap-3">
      <div
        role="img"
        aria-label={label}
        className="flex h-3 w-full overflow-hidden rounded-full bg-foreground/8"
      >
        {segments.map((segment) =>
          segment.value > 0 ? (
            <span
              key={segment.id}
              className={cn("h-full", BAR_CLASSES[segment.tone])}
              style={{ width: `${String(share(segment.value))}%` }}
            />
          ) : null,
        )}
      </div>
      <ul className="flex flex-col gap-1.5">
        {segments.map((segment) => (
          <li key={segment.id} className="flex items-center gap-2 text-label">
            <span
              aria-hidden="true"
              className={cn(
                "size-2.5 shrink-0 rounded-full",
                BAR_CLASSES[segment.tone],
              )}
            />
            <span className="flex-1 text-foreground/80">{segment.label}</span>
            <span className="font-medium text-foreground">
              {segment.amount}
            </span>
            <span className="w-12 text-right text-foreground/60">{`${String(Math.round(share(segment.value)))} %`}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
