import { defineEndpoint } from "@fiaro-app/contracts";
import { z } from "zod";

export const RISK_LEVELS = ["LOW", "MEDIUM", "HIGH", "VERY_HIGH"] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

/** Lo que pesa en el puntaje; cada código tiene su texto en `content/risk.ts`. */
export const RISK_FACTOR_CODES = [
  "OVERDUE_DAYS",
  "OVERDUE_SHARE",
  "MULTIPLE_LOANS_IN_ARREARS",
  "PAID_LOANS",
] as const;

const ClientRiskSchema = z.object({
  clientId: z.string(),
  score: z.int().min(0).max(100),
  level: z.enum(RISK_LEVELS),
  loansCount: z.int().nonnegative(),
  factors: z.array(
    z.object({
      code: z.enum(RISK_FACTOR_CODES),
      points: z.int(),
      value: z.int().nonnegative(),
    }),
  ),
});
export type ClientRisk = z.infer<typeof ClientRiskSchema>;

/** `@fiaro-app/contracts` aún no publica este endpoint: mismo patrón que `features/insights/endpoints.ts`. */
export const riskEndpoints = {
  clients: defineEndpoint({
    method: "QUERY",
    path: "/lenders/me/clients/risk",
    summary: "El riesgo (puntaje, nivel y factores) de hasta 50 clientes del negocio (D-137 de la API).",
    body: z.strictObject({ clientIds: z.array(z.string()).min(1).max(50) }),
    response: z.object({ data: z.array(ClientRiskSchema) }),
  }),
} as const;
