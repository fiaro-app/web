import { cn } from "@/lib/cn";
import { TONE_TEXT_CLASSES, type Tone } from "@/lib/tone";

export interface RiskGaugeProps {
  /** De 0 a 100. */
  readonly score: number;
  readonly tone: Tone;
  /** Lo que lee un lector de pantalla del medidor. */
  readonly label: string;
  readonly className?: string;
}

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Medidor circular del puntaje de riesgo: un anillo que se llena según el puntaje, con la cifra al
 * centro. El nivel siempre se escribe aparte (no depende solo del color). SVG puro, sin librerías.
 */
export function RiskGauge({ score, tone, label, className }: Readonly<RiskGaugeProps>) {
  const filled = (Math.min(Math.max(score, 0), 100) / 100) * CIRCUMFERENCE;
  return (
    <div className={cn("relative size-28", className)}>
      <svg role="img" aria-label={label} viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r={RADIUS} fill="none" strokeWidth="10" className="stroke-foreground/10" />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${String(filled)} ${String(CIRCUMFERENCE)}`}
          className={cn("stroke-current", TONE_TEXT_CLASSES[tone])}
        />
      </svg>
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center text-title font-bold text-foreground"
      >
        {score}
      </span>
    </div>
  );
}
