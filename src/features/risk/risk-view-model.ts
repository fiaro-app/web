import { RISK_TEXT } from "@/content/risk";
import type { ClientRisk, RiskLevel } from "@/features/risk/endpoints";
import type { Tone } from "@/lib/tone";

/** El riesgo de un cliente listo para pintar. */
export interface RiskView {
  readonly score: number;
  readonly level: RiskLevel;
  /** «bajo», «medio», «alto» o «muy alto». */
  readonly levelLabel: string;
  readonly tone: Tone;
  /** Lo que lee un lector de pantalla del medidor. */
  readonly ariaLabel: string;
  /** Una frase por factor. */
  readonly factors: readonly string[];
  readonly hasHistory: boolean;
}

const TONE_BY_LEVEL: Record<RiskLevel, Tone> = {
  LOW: "success",
  MEDIUM: "info",
  HIGH: "warning",
  VERY_HIGH: "error",
};

/** Convierte el riesgo de la API en lo que pintan la ficha, la lista y el aviso del préstamo. */
export function toRiskView(risk: ClientRisk): RiskView {
  const levelLabel = RISK_TEXT.levels[risk.level];
  return {
    score: risk.score,
    level: risk.level,
    levelLabel,
    tone: TONE_BY_LEVEL[risk.level],
    ariaLabel: RISK_TEXT.scoreLabel(risk.score, levelLabel),
    factors: risk.factors.map((factor) => RISK_TEXT.factor(factor)),
    hasHistory: risk.loansCount > 0,
  };
}
