import 'server-only';
import { toCollectorsTodayViewModel, type CollectorsTodayViewModel } from '@/features/collectors-today/collectors-today-view-model';
import { collectorsTodayEndpoints } from '@/features/collectors-today/endpoints';
import { callEndpointAsUser } from '@/lib/api/server-call';

/**
 * Cómo va hoy la ruta de cada cobrador. Es un complemento del resumen: si falla (API caída o aún sin
 * esta ruta), el resumen se pinta igual, sin la sección, en vez de caerse entero.
 */
export async function getCollectorsToday(): Promise<CollectorsTodayViewModel | null> {
  try {
    return toCollectorsTodayViewModel(await callEndpointAsUser(collectorsTodayEndpoints.today, {}));
  } catch {
    return null;
  }
}
