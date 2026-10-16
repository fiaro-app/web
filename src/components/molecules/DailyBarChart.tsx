import { INSIGHTS_TEXT as T } from "@/content/insights";
import { formatCop, formatCopCompact } from "@/lib/amount";
import type { DailyBar } from "@/features/insights/insights-view-model";

export interface DailyBarChartProps {
  readonly bars: readonly DailyBar[];
  /** Lo que lee un lector de pantalla del conjunto: el resumen del período. */
  readonly label: string;
  readonly legendCollected: string;
  readonly legendExpected: string;
}

const WIDTH = 720;
const HEIGHT = 240;
const PAD = { top: 12, right: 8, bottom: 28, left: 64 };
const TICKS = 3;

/**
 * Gráfica de cobro día a día: para cada día, una barra ancha y clara con lo que tocaba cobrar (la meta del día según el
 * calendario de cuotas) y, encima, una barra angosta de color con lo que de verdad se cobró. Verde cuando se llegó a la
 * meta del día, azul cuando se quedó corto: se lee de un vistazo sin saber qué es «vencer». Es SVG puro (sin
 * librería): escala sola al ancho, cada día trae su cifra al pasar el cursor (`<title>`) y, para quien no ve la
 * gráfica, una tabla con los mismos datos. Solo presentación.
 */
export function DailyBarChart({ bars, label, legendCollected, legendExpected }: Readonly<DailyBarChartProps>) {
  const max = Math.max(1, ...bars.map((bar) => Math.max(bar.collected, bar.expected)));
  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;
  const slot = plotWidth / Math.max(1, bars.length);
  const goalWidth = Math.max(3, Math.min(34, slot * 0.8));
  const collectedWidth = Math.max(2, goalWidth * 0.55);
  const y = (value: number) => PAD.top + plotHeight - (value / max) * plotHeight;
  const labelEvery = Math.max(1, Math.ceil(bars.length / 8));

  return (
    <figure className="flex flex-col gap-2">
      <svg viewBox={`0 0 ${String(WIDTH)} ${String(HEIGHT)}`} role="img" aria-label={label} className="h-auto w-full">
        {Array.from({ length: TICKS + 1 }, (_, index) => {
          const value = (max / TICKS) * index;
          return (
            <g key={index}>
              <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y(value)} y2={y(value)} className="stroke-foreground/10" strokeWidth={1} />
              <text x={PAD.left - 6} y={y(value) + 4} textAnchor="end" className="fill-foreground/60 text-[11px]">
                {formatCopCompact(Math.round(value))}
              </text>
            </g>
          );
        })}
        {bars.map((bar, index) => {
          const center = PAD.left + index * slot + slot / 2;
          const reachedGoal = bar.expected > 0 && bar.collected >= bar.expected;
          return (
            <g key={bar.date}>
              <title>{T.daily.dayLabel(bar.label, formatCop(bar.collected), formatCop(bar.expected))}</title>
              {bar.expected > 0 && (
                <rect x={center - goalWidth / 2} y={y(bar.expected)} width={goalWidth} height={y(0) - y(bar.expected)} rx={3} className="fill-foreground/12" />
              )}
              {bar.collected > 0 && (
                <rect
                  x={center - collectedWidth / 2}
                  y={y(bar.collected)}
                  width={collectedWidth}
                  height={y(0) - y(bar.collected)}
                  rx={2}
                  className={reachedGoal ? "fill-success" : "fill-primary"}
                />
              )}
              {index % labelEvery === 0 && (
                <text x={center} y={HEIGHT - 8} textAnchor="middle" className="fill-foreground/60 text-[11px]">
                  {bar.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <figcaption className="flex flex-wrap gap-4 text-small text-foreground/70">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2.5 rounded-sm bg-foreground/12" />
          {legendExpected}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2.5 rounded-sm bg-primary" />
          {legendCollected}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2.5 rounded-sm bg-success" />
          {T.daily.reachedGoal}
        </span>
      </figcaption>
      <table className="sr-only">
        <caption>{label}</caption>
        <tbody>
          {bars.map((bar) => (
            <tr key={bar.date}>
              <th scope="row">{bar.label}</th>
              <td>{formatCop(bar.collected)}</td>
              <td>{formatCop(bar.expected)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
