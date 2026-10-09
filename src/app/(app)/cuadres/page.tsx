import { StateIcon } from '@/components/atoms/StateIcon';
import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';
import { SettlementsView } from '@/components/organisms/SettlementsView';
import { SETTLEMENTS_TEXT } from '@/content/settlements';
import { parseSettlementFilters } from '@/features/settlements/settlement-filters';
import { getSettlements } from '@/features/settlements/get-settlements.server';
import { parseSettlementStatusParam } from '@/features/settlements/status-filter';
import { parsePageParam } from '@/lib/pagination';

export const metadata: Metadata = { title: 'Cuadres' };

/** Cuadres: trae la página y el filtro de estado pedidos en el servidor y los pinta. */
export default async function SettlementsPage({ searchParams }: PageProps<'/cuadres'>) {
  const params = await searchParams;
  const result = await getSettlements(
    parsePageParam(params.pagina),
    parseSettlementStatusParam(params.estado),
    parseSettlementFilters(params),
  );

  if (result.status === 'forbidden') {
    return <EmptyState icon={<StateIcon name="lock" />} {...SETTLEMENTS_TEXT.forbidden} />;
  }
  return <SettlementsView settlements={result.settlements} options={result.options} />;
}
