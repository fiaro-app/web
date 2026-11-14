import { StateIcon } from '@/components/atoms/StateIcon';
import type { Metadata } from 'next';
import { FormWithAside } from '@/components/molecules/FormWithAside';
import { EmptyState } from '@/components/molecules/EmptyState';
import { SettlementDetail } from '@/components/organisms/SettlementDetail';
import { SETTLEMENTS_TEXT } from '@/content/settlements';
import { getAccess } from '@/features/app-shell/get-access.server';
import { getSettlement } from '@/features/settlements/get-settlement.server';

export const metadata: Metadata = { title: 'Cuadre' };

/** Detalle de un cuadre: trae el cuadre en el servidor y lo entrega a la vista. */
export default async function SettlementPage({ params }: PageProps<'/cuadres/[id]'>) {
  const { id } = await params;
  const [result, { canManage }] = await Promise.all([getSettlement(id), getAccess()]);

  if (result.status === 'forbidden') {
    return <EmptyState icon={<StateIcon name="lock" />} {...SETTLEMENTS_TEXT.forbidden} />;
  }
  if (result.status === 'not-found') {
    return <EmptyState icon={<StateIcon name="search" />} {...SETTLEMENTS_TEXT.notFound} />;
  }
  return (
    <FormWithAside aside={SETTLEMENTS_TEXT.detailAside}>
      <SettlementDetail settlement={result.settlement} canManage={canManage} />
    </FormWithAside>
  );
}
