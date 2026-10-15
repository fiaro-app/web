import { StateIcon } from '@/components/atoms/StateIcon';
import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';
import { StatsView } from '@/components/organisms/StatsView';
import { STATS_TEXT } from '@/content/stats';
import { getInsights } from '@/features/insights/get-insights.server';
import { getStats } from '@/features/stats/get-stats.server';
import { parseStatsFilters, parseStatsListPages } from '@/features/stats/stats-filters';

export const metadata: Metadata = { title: 'Estadísticas' };

/** Estadísticas: lee los filtros y las páginas de las listas largas (`?mora=`, `?desempeno=`) de la URL, trae los datos en el servidor y los pinta. */
export default async function StatsPage({ searchParams }: PageProps<'/estadisticas'>) {
  const params = await searchParams;
  const filters = parseStatsFilters(params);
  const [result, insights] = await Promise.all([getStats(filters, parseStatsListPages(params)), getInsights(filters)]);

  if (result.status === 'forbidden') {
    return <EmptyState icon={<StateIcon name="lock" />} {...STATS_TEXT.forbidden} />;
  }
  return <StatsView stats={result.stats} filters={filters} options={result.options} insights={insights} />;
}
