import { StateIcon } from '@/components/atoms/StateIcon';
import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';
import { StatsView } from '@/components/organisms/StatsView';
import { STATS_TEXT } from '@/content/stats';
import { getInsights } from '@/features/insights/get-insights.server';
import { getSubscription } from '@/features/subscription/get-subscription.server';
import { getStats } from '@/features/stats/get-stats.server';
import { parseStatsFilters, parseStatsListPages } from '@/features/stats/stats-filters';

export const metadata: Metadata = { title: 'Estadísticas' };

/**
 * Estadísticas: con el plan Individual solo trae los indicadores (sin las listas ni «Cómo va tu negocio», que la API
 * negaría con `PLAN_FEATURE_UNAVAILABLE`) y ofrece subir de plan (D-151 de la API). Lee los filtros y las páginas de las listas largas (`?mora=`, `?desempeno=`) de la URL, trae los datos en el servidor y los pinta. */
export default async function StatsPage({ searchParams }: PageProps<'/estadisticas'>) {
  const params = await searchParams;
  const filters = parseStatsFilters(params);
  const advanced = (await getSubscription())?.advancedStats ?? true;
  const [result, insights] = await Promise.all([
    advanced ? getStats(filters, parseStatsListPages(params)) : getStats(filters),
    advanced ? getInsights(filters) : null,
  ]);

  if (result.status === 'forbidden') {
    return <EmptyState icon={<StateIcon name="lock" />} {...STATS_TEXT.forbidden} />;
  }
  return <StatsView stats={result.stats} filters={filters} options={result.options} insights={insights} advanced={advanced} />;
}
