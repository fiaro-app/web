import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';
import { LoanDetail } from '@/components/organisms/LoanDetail';
import { LoanVisits } from '@/components/organisms/LoanVisits';
import { LOANS_TEXT } from '@/content/loans';
import { getLoan } from '@/features/loans/get-loan.server';
import { getLoanVisits } from '@/features/visits/get-visits.server';

export const metadata: Metadata = { title: 'Préstamo' };

/** Detalle de un préstamo: trae el préstamo en el servidor y lo entrega a la vista. */
export default async function LoanPage({ params }: PageProps<'/prestamos/[id]'>) {
  const { id } = await params;
  const result = await getLoan(id);

  if (result.status === 'forbidden') {
    return <EmptyState icon="!" {...LOANS_TEXT.forbidden} />;
  }
  if (result.status === 'not-found') {
    return <EmptyState icon="?" {...LOANS_TEXT.notFound} />;
  }
  const visits = await getLoanVisits(id);
  return (
    <>
      <LoanDetail loan={result.loan} collectors={result.collectorOptions} />
      <LoanVisits visits={visits} />
    </>
  );
}
