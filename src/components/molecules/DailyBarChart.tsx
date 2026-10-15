import { formatCop, formatCopCompact } from "@/lib/amount";
import type { DailyBar } from "@/features/insights/insights-view-model";

export interface DailyBarChartProps {
  readonly bars: readonly DailyBar[];
  /** Lo que lee un lector de pantalla del conjunto: el resumen del período. */
  readonly label: string;
  readonly legendCollected: string;
  readonly legendExpected: string;
  /** Si es `false` no se dibuja la marca de «lo que vencía» (la proyección solo tiene esperado). */
  readonly showCollected?: boolean;
}

const WIDTH = 720;
const HEIGHT = 220;
const PAD = { top: 12, right: 8, bottom: 26, left: 64 };
const TICKS = 3;

/**
 * Gráfica de columnas por día: la columna es lo cobrado y una raya marca lo que vencía según el calendario. Es SVG
 * puro (sin librería): escala sola al ancho, cada día trae su cifra al pasar el cursor (`<title>`) y, para quien no
 * ve la gráfica, una tabla con los mismos datos. Solo presentación.
 */
export function DailyBarChart({
  bars,
  label,
  legendCollected,
  legendExpected,
  showCollected = true,
}: Readonly<DailyBarChartProps>) {
  const max = Math.max(
    1,
    ...bars.map((bar) => Math.max(bar.collected, bar.expected)),
  );
  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;
  const slot = plotWidth / Math.max(1, bars.length);
  const barWidth = Math.max(2, Math.min(28, slot * 0.62));
  const y = (value: number) =>
    PAD.top + plotHeight - (value / max) * plotHeight;
  const labelEvery = Math.max(1, Math.ceil(bars.length / 8));

  return (
    <figure className="flex flex-col gap-2">
      <svg
        viewBox={`0 0 ${String(WIDTH)} ${String(HEIGHT)}`}
        role="img"
        aria-label={label}
        className="h-auto w-full"
      >
        {Array.from({ length: TICKS + 1 }, (_, index) => {
          const value = (max / TICKS) * index;
          return (
            <g key={index}>
              <line
                x1={PAD.left}
                x2={WIDTH - PAD.right}
                y1={y(value)}
                y2={y(value)}
                className="stroke-foreground/10"
                strokeWidth={1}
              />
              <text
                x={PAD.left - 6}
                y={y(value) + 4}
                textAnchor="end"
                className="fill-foreground/60 text-[11px]"
              >
                {formatCopCompact(Math.round(value))}
              </text>
            </g>
          );
        })}
        {bars.map((bar, index) => {
          const x = PAD.left + index * slot + (slot - barWidth) / 2;
          return (
            <g key={bar.date}>
              <title>{`${bar.label}: cobrado ${formatCop(bar.collected)}, vencía ${formatCop(bar.expected)}`}</title>
              {showCollected && bar.collected > 0 && (
                <rect
                  x={x}
                  y={y(bar.collected)}
                  width={barWidth}
                  height={y(0) - y(bar.collected)}
                  rx={2}
                  className="fill-primary"
                />
              )}
              {bar.expected > 0 && (
                <line
                  x1={x - 2}
                  x2={x + barWidth + 2}
                  y1={y(bar.expected)}
                  y2={y(bar.expected)}
                  className="stroke-warning"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              )}
              {index % labelEvery === 0 && (
                <text
                  x={x + barWidth / 2}
                  y={HEIGHT - 8}
                  textAnchor="middle"
                  className="fill-foreground/60 text-[11px]"
                >
                  {bar.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <figcaption className="flex flex-wrap gap-4 text-small text-foreground/70">
        {showCollected && (
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-2.5 rounded-sm bg-primary"
            />
            {legendCollected}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-0.5 w-4 rounded-full bg-warning"
          />
          {legendExpected}
        </span>
      </figcaption>
      <table className="sr-only">
        <caption>{label}</caption>
        <tbody>
          {bars.map((bar) => (
            <tr key={bar.date}>
              <th scope="row">{bar.label}</th>
              {showCollected && <td>{formatCop(bar.collected)}</td>}
              <td>{formatCop(bar.expected)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
