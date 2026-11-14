import "server-only";
import { insightsEndpoints } from "@/features/insights/endpoints";
import {
  toInsightsViewModel,
  type InsightsViewModel,
} from "@/features/insights/insights-view-model";
import type { StatsFilters } from "@/features/stats/stats-filters";
import { callEndpointAsUser } from "@/lib/api/server-call";

/**
 * Las estadísticas de «Cómo va tu negocio» para el período de los filtros. Es un complemento de la
 * pantalla: si falla (API caída o aún sin esta ruta) devuelve `null` y el resto de Estadísticas se
 * pinta igual.
 */
export async function getInsights(
  filters: StatsFilters,
): Promise<InsightsViewModel | null> {
  try {
    const body =
      filters.from === ""
        ? {}
        : { dateRange: { from: filters.from, to: filters.to } };
    return toInsightsViewModel(
      await callEndpointAsUser(insightsEndpoints.get, { body }),
    );
  } catch {
    return null;
  }
}
