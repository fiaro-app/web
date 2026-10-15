import type { RiskLevel } from "@/features/risk/endpoints";
import type { ClientRisk } from "@/features/risk/endpoints";

type Factor = ClientRisk["factors"][number];

/** Textos del riesgo de un cliente. */
export const RISK_TEXT = {
  title: "Riesgo del cliente",
  noHistory: "Todavía no tiene préstamos en tu negocio: sin historial para puntuar.",
  noFactors: "Sin mora ni señales de riesgo.",
  scoreLabel: (score: number, level: string) => `Riesgo ${level}: ${String(score)} de 100`,
  levels: { LOW: "bajo", MEDIUM: "medio", HIGH: "alto", VERY_HIGH: "muy alto" } satisfies Record<RiskLevel, string>,
  loanWarning:
    "Este cliente tiene un riesgo muy alto con tu negocio. Puedes registrar el préstamo, pero revisa su historial antes.",
  factor: (factor: Factor): string => {
    switch (factor.code) {
      case "OVERDUE_DAYS":
        return `Tiene un préstamo con ${String(factor.value)} días de atraso.`;
      case "OVERDUE_SHARE":
        return `El ${String(factor.value)} % de su saldo está vencido.`;
      case "MULTIPLE_LOANS_IN_ARREARS":
        return `Tiene ${String(factor.value)} préstamos en mora a la vez.`;
      case "PAID_LOANS":
        return `Ya pagó ${String(factor.value)} ${factor.value === 1 ? "préstamo" : "préstamos"} (resta riesgo).`;
    }
  },
} as const;
