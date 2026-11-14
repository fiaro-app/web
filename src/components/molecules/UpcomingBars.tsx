import { INSIGHTS_TEXT as T } from "@/content/insights";
import type { DailyBar } from "@/features/insights/insights-view-model";
import { formatCop } from "@/lib/amount";

export interface UpcomingBarsProps {
  readonly days: readonly DailyBar[];
  /** Lo que lee un lector de pantalla del conjunto. */
  readonly label: string;
}

/**
 * Lo que toca cobrar en los próximos días, una fila por día: el día, una barra horizontal proporcional y la cifra. Más
 * fácil de leer que columnas con una raya: de un vistazo se ve qué día pesa más. Los días sin nada por cobrar quedan
 * atenuados. Solo presentación.
 */
export function UpcomingBars({ days, label }: Readonly<UpcomingBarsProps>) {
  const max = Math.max(1, ...days.map((day) => day.expected));

  return (
    <ol aria-label={label} className="flex flex-col gap-2">
      {days.map((day) => (
        <li key={day.date} className="grid grid-cols-[7.5rem_1fr_auto] items-center gap-3 text-label">
          <span className={day.expected === 0 ? "text-foreground/50" : "text-foreground"}>{day.label}</span>
          <span aria-hidden="true" className="h-3 rounded-full bg-foreground/8">
            <span className="block h-3 rounded-full bg-warning" style={{ width: `${String(Math.round((day.expected / max) * 100))}%` }} />
          </span>
          <span className={day.expected === 0 ? "text-foreground/50" : "font-semibold text-foreground"}>
            {day.expected === 0 ? T.forecast.nothing : formatCop(day.expected)}
          </span>
        </li>
      ))}
    </ol>
  );
}
