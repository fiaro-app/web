import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';
import { SettlementsView } from '@/components/organisms/SettlementsView';
import { SETTLEMENTS_TEXT } from '@/content/settlements';
import { getSettlements } from '@/features/settlements/get-settlements.server';
import { parseSettlementStatusParam } from '@/features/settlements/status-filter';
import { parsePageParam } from '@/lib/pagination';

export const metadata: Metadata = { title: 'Cuadres' };

/** Cuadres: trae la página y el filtro de estado pedidos en el servidor y los pinta. */
export default async function SettlementsPage({ searchParams }: PageProps<'/cuadres'>) {
  const { pagina, estado } = await searchParams;
  const result = await getSettlements(parsePageParam(pagina), parseSettlementStatusParam(estado));

  if (result.status === 'forbidden') {
    return <EmptyState className="max-w-md" icon="!" {...SETTLEMENTS_TEXT.forbidden} />;
  }
  return <SettlementsView settlements={result.settlements} />;
}
