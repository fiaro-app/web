import { StateIcon } from '@/components/atoms/StateIcon';
import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';
import { LoansView } from '@/components/organisms/LoansView';
import { LOANS_TEXT } from '@/content/loans';
import { getLoans } from '@/features/loans/get-loans.server';
import { parseStatusParam } from '@/features/loans/status-filter';
import { parsePageParam } from '@/lib/pagination';

export const metadata: Metadata = { title: 'Préstamos' };

/** Préstamos: trae la página y el filtro de estado pedidos en el servidor y los pinta. */
export default async function LoansPage({ searchParams }: PageProps<'/prestamos'>) {
  const { pagina, estado } = await searchParams;
  const result = await getLoans(parsePageParam(pagina), parseStatusParam(estado));

  if (result.status === 'forbidden') {
    return <EmptyState icon={<StateIcon name="lock" />} {...LOANS_TEXT.forbidden} />;
  }
  return <LoansView loans={result.loans} />;
}
