import { StateIcon } from '@/components/atoms/StateIcon';
import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';
import { CollectorManage } from '@/components/organisms/CollectorManage';
import { CollectorPerformance } from '@/components/organisms/CollectorPerformance';
import { COLLECTORS_TEXT } from '@/content/collectors';
import { getCollector } from '@/features/collectors/get-collector.server';
import { getCollectorStats } from '@/features/collectors/get-collector-stats.server';
import { getPortfolioOptions } from '@/features/collectors/get-portfolio-options.server';

export const metadata: Metadata = { title: 'Gestionar cobrador' };

/** Gestionar cobrador: trae al cobrador y las carteras en el servidor. */
export default async function ManageCollectorPage({ params }: PageProps<'/cobradores/[id]'>) {
  const { id } = await params;
  const [result, portfolios] = await Promise.all([getCollector(id), getPortfolioOptions()]);

  if (result.status === 'forbidden') {
    return <EmptyState icon={<StateIcon name="lock" />} {...COLLECTORS_TEXT.forbidden} />;
  }
  if (result.status === 'not-found') {
    return <EmptyState icon={<StateIcon name="search" />} {...COLLECTORS_TEXT.manage.notFound} />;
  }
  const stats = await getCollectorStats(id);
  return (
    <>
      <CollectorManage collector={result.collector} portfolios={portfolios} />
      {stats && <CollectorPerformance stats={stats} />}
    </>
  );
}
