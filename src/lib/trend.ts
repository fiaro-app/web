import type { FigureTone } from '@/lib/tone';

/** Qué dirección es buena para un indicador: más alto (cobrado), más bajo (mora) o ninguna (cartera). */
export type TrendPolarity = 'higher-is-better' | 'lower-is-better' | 'neutral';

/** Cambio de un indicador frente al período anterior, listo para pintar junto a su cifra. */
export interface Trend {
  readonly direction: 'up' | 'down' | 'flat';
  /** Lo que se ve: «↑ 4 %», «↓ 2 pts» o «= igual». */
  readonly label: string;
  /** Lo que lee un lector de pantalla: «Sube 4 % frente al período anterior». */
  readonly description: string;
  /** Verde si mejora, grana si empeora, neutro si no hay cambio o no hay un lado bueno. */
  readonly tone: FigureTone;
}

/** Cambio menor a esto (en %, o en puntos) se considera «igual»: evita flechas por ruido. */
const FLAT_BELOW = 0.5;

function toneOf(direction: Trend['direction'], polarity: TrendPolarity): FigureTone {
  if (direction === 'flat' || polarity === 'neutral') return 'neutral';
  const improves = (direction === 'up') === (polarity === 'higher-is-better');
  return improves ? 'good' : 'bad';
}

function build(change: number, unit: string, polarity: TrendPolarity): Trend {
  const magnitude = Math.round(Math.abs(change));
  const direction = Math.abs(change) < FLAT_BELOW ? 'flat' : change > 0 ? 'up' : 'down';
  const tone = toneOf(direction, polarity);
  if (direction === 'flat') return { direction, label: '= igual', description: 'Sin cambio frente al período anterior', tone };
  const text = `${String(magnitude)} ${unit}`;
  return {
    direction,
    label: `${direction === 'up' ? '↑' : '↓'} ${text}`,
    description: `${direction === 'up' ? 'Sube' : 'Baja'} ${text} frente al período anterior`,
    tone,
  };
}

/**
 * Tendencia de una cifra (pesos, cantidad) como cambio porcentual frente al período anterior.
 * `null` si no hay con qué comparar: sin período anterior o con uno en cero (no se divide por cero).
 */
export function relativeTrend(current: number, previous: number | null | undefined, polarity: TrendPolarity): Trend | null {
  if (previous === null || previous === undefined || previous === 0) return null;
  return build(((current - previous) / previous) * 100, '%', polarity);
}

/**
 * Tendencia de una proporción (0–1, como la mora o la efectividad) en puntos porcentuales: de 18 % a
 * 22 % es «↑ 4 pts». `null` si falta alguna de las dos.
 */
export function pointsTrend(current: number | null, previous: number | null | undefined, polarity: TrendPolarity): Trend | null {
  if (current === null || previous === null || previous === undefined) return null;
  return build((current - previous) * 100, 'pts', polarity);
}
