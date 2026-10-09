import { statsEndpoints } from '@/features/stats/endpoints';
import { toStatsBody, type StatsFilters } from '@/features/stats/stats-filters';
import { callEndpointForFile, type DownloadedFile } from '@/lib/api';

/** Nombre del archivo si la API no sugiere uno. */
export const DEFAULT_STATS_FILENAME = 'estadisticas.pdf';

/** Pide el PDF de las estadísticas con los mismos filtros que la pantalla. */
export async function exportStatsPdf(filters: StatsFilters): Promise<{ readonly blob: Blob; readonly filename: string }> {
  const file: DownloadedFile = await callEndpointForFile(statsEndpoints.exportPdf, {
    body: { ...toStatsBody(filters), format: 'pdf' },
  });
  return { blob: file.blob, filename: file.filename ?? DEFAULT_STATS_FILENAME };
}
