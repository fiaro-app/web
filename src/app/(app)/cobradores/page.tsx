import { StateIcon } from '@/components/atoms/StateIcon';
import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';
import { CollectorsView } from '@/components/organisms/CollectorsView';
import { COLLECTORS_TEXT } from '@/content/collectors';
import { getCollectors } from '@/features/collectors/get-collectors.server';
import { parsePageParam } from '@/lib/pagination';
import { parseCollectorStatusParam } from '@/features/collectors/status-filter';

export const metadata: Metadata = { title: 'Cobradores' };

/** Cobradores (`Screen / Web / Cobradores`): trae la página y el estado pedidos (`?estado=`) en el servidor y la pinta. */
export default async function CollectorsPage({ searchParams }: PageProps<'/cobradores'>) {
  const { pagina, estado } = await searchParams;
  const result = await getCollectors(parsePageParam(pagina), parseCollectorStatusParam(estado));

  if (result.status === 'forbidden') {
    return <EmptyState icon={<StateIcon name="lock" />} {...COLLECTORS_TEXT.forbidden} />;
  }
  return <CollectorsView collectors={result.collectors} />;
}
