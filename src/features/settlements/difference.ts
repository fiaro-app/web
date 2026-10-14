import { formatCop } from '@/lib/amount';
import type { FigureTone } from '@/lib/tone';

export interface SettlementDifference {
  /** Diferencia cobrado − esperado ya formateada; `null` si cuadra. */
  readonly text: string | null;
  /** `bad` cuando faltó dinero, `warning` cuando sobró, `neutral` si cuadra. */
  readonly tone: FigureTone;
}

/** Diferencia entre lo cobrado y lo esperado de un cuadre, con el tono con el que se pinta. */
export function describeDifference(expected: number, collected: number): SettlementDifference {
  const difference = collected - expected;
  if (difference === 0) return { text: null, tone: 'neutral' };
  return { text: formatCop(difference), tone: difference < 0 ? 'bad' : 'warning' };
}
