import { StateIcon } from '@/components/atoms/StateIcon';
import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';
import { LoansView } from '@/components/organisms/LoansView';
import { LOANS_TEXT } from '@/content/loans';
import { getAccess } from '@/features/app-shell/get-access.server';
import { getLoans } from '@/features/loans/get-loans.server';
import { parseStatusParam } from '@/features/loans/status-filter';
import { parsePageParam, parseSearchParam } from '@/lib/pagination';

export const metadata: Metadata = { title: 'Préstamos' };

/** Préstamos: trae la página, el filtro de estado y la búsqueda pedidos en el servidor y los pinta. */
export default async function LoansPage({ searchParams }: PageProps<'/prestamos'>) {
  const { pagina, estado, q } = await searchParams;
  const [result, { canManage }] = await Promise.all([
    getLoans(parsePageParam(pagina), parseStatusParam(estado), parseSearchParam(q)),
    getAccess(),
  ]);

  if (result.status === 'forbidden') {
    return <EmptyState icon={<StateIcon name="lock" />} {...LOANS_TEXT.forbidden} />;
  }
  return <LoansView loans={result.loans} canManage={canManage} />;
}
