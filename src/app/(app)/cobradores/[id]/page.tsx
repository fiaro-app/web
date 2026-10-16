import { StateIcon } from '@/components/atoms/StateIcon';
import type { Metadata } from 'next';
import { FormWithAside } from '@/components/molecules/FormWithAside';
import { EmptyState } from '@/components/molecules/EmptyState';
import { CollectorManage } from '@/components/organisms/CollectorManage';
import { CollectorPerformance } from '@/components/organisms/CollectorPerformance';
import { COLLECTORS_TEXT } from '@/content/collectors';
import { getAccess } from '@/features/app-shell/get-access.server';
import { getCollector } from '@/features/collectors/get-collector.server';
import { getCollectorHandover } from '@/features/collectors/get-collector-handover.server';
import { getCollectorStats } from '@/features/collectors/get-collector-stats.server';
import { getPortfolioOptions } from '@/features/collectors/get-portfolio-options.server';

export const metadata: Metadata = { title: 'Gestionar cobrador' };

/** Gestionar cobrador: trae al cobrador y las carteras en el servidor. */
export default async function ManageCollectorPage({ params }: PageProps<'/cobradores/[id]'>) {
  const { id } = await params;
  const [result, portfolios, access] = await Promise.all([getCollector(id), getPortfolioOptions(), getAccess()]);

  if (result.status === 'forbidden') {
    return <EmptyState icon={<StateIcon name="lock" />} {...COLLECTORS_TEXT.forbidden} />;
  }
  if (result.status === 'not-found') {
    return <EmptyState icon={<StateIcon name="search" />} {...COLLECTORS_TEXT.manage.notFound} />;
  }
  const [stats, handover] = await Promise.all([
    getCollectorStats(id),
    // La baja exige pasar sus préstamos activos a otro cobrador: solo se revisan si sigue activo.
    result.collector.active ? getCollectorHandover(id) : Promise.resolve({ loans: [], destinations: [] }),
  ]);
  return (
    <FormWithAside aside={COLLECTORS_TEXT.manageAside} belowAside={stats && <CollectorPerformance stats={stats} />}>
      <CollectorManage collector={result.collector} portfolios={portfolios} handover={handover} isSelf={access.membershipId === id} />
    </FormWithAside>
  );
}
