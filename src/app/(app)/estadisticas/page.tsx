import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';
import { StatsView } from '@/components/organisms/StatsView';
import { STATS_TEXT } from '@/content/stats';
import { getStats } from '@/features/stats/get-stats.server';
import { parseStatsFilters } from '@/features/stats/stats-filters';

export const metadata: Metadata = { title: 'Estadísticas' };

/** Estadísticas: lee los filtros de la URL, trae los datos en el servidor y los pinta. */
export default async function StatsPage({ searchParams }: PageProps<'/estadisticas'>) {
  const filters = parseStatsFilters(await searchParams);
  const result = await getStats(filters);

  if (result.status === 'forbidden') {
    return <EmptyState icon="!" {...STATS_TEXT.forbidden} />;
  }
  return <StatsView stats={result.stats} filters={filters} options={result.options} />;
}
