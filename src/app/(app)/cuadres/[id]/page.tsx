import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';
import { SettlementDetail } from '@/components/organisms/SettlementDetail';
import { SETTLEMENTS_TEXT } from '@/content/settlements';
import { getSettlement } from '@/features/settlements/get-settlement.server';

export const metadata: Metadata = { title: 'Cuadre' };

/** Detalle de un cuadre: trae el cuadre en el servidor y lo entrega a la vista. */
export default async function SettlementPage({ params }: PageProps<'/cuadres/[id]'>) {
  const { id } = await params;
  const result = await getSettlement(id);

  if (result.status === 'forbidden') {
    return <EmptyState icon="!" {...SETTLEMENTS_TEXT.forbidden} />;
  }
  if (result.status === 'not-found') {
    return <EmptyState icon="?" {...SETTLEMENTS_TEXT.notFound} />;
  }
  return <SettlementDetail settlement={result.settlement} />;
}
