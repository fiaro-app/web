import { StateIcon } from '@/components/atoms/StateIcon';
import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';
import { LoanRequestsView } from '@/components/organisms/LoanRequestsView';
import { LOAN_REQUESTS_TEXT } from '@/content/loan-requests';
import { getLoanRequests } from '@/features/loan-requests/get-loan-requests.server';
import { parseLoanRequestStatusParam } from '@/features/loan-requests/status-filter';
import { parsePageParam } from '@/lib/pagination';

export const metadata: Metadata = { title: 'Solicitudes' };

/** Solicitudes de préstamo de los cobradores: trae la página y el filtro de estado pedidos en el servidor y los pinta. */
export default async function LoanRequestsPage({ searchParams }: PageProps<'/solicitudes'>) {
  const params = await searchParams;
  const result = await getLoanRequests(parsePageParam(params.pagina), parseLoanRequestStatusParam(params.estado));

  if (result.status === 'forbidden') {
    return <EmptyState icon={<StateIcon name="lock" />} {...LOAN_REQUESTS_TEXT.forbidden} />;
  }
  return <LoanRequestsView requests={result.requests} />;
}
