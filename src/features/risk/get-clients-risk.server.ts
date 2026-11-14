import "server-only";
import { riskEndpoints } from "@/features/risk/endpoints";
import { toRiskView, type RiskView } from "@/features/risk/risk-view-model";
import { callEndpointAsUser } from "@/lib/api/server-call";

/**
 * El riesgo de los clientes dados, por id. Es un complemento de la pantalla: si falla (API caída,
 * sin permiso o aún sin esta ruta) devuelve un mapa vacío y la pantalla se pinta sin medidor.
 */
export async function getClientsRisk(clientIds: readonly string[]): Promise<ReadonlyMap<string, RiskView>> {
  if (clientIds.length === 0) return new Map();
  try {
    const { data } = await callEndpointAsUser(riskEndpoints.clients, { body: { clientIds: [...clientIds] } });
    return new Map(data.map((risk) => [risk.clientId, toRiskView(risk)]));
  } catch {
    return new Map();
  }
}
