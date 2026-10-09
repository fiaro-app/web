import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';
import { LoanDetail } from '@/components/organisms/LoanDetail';
import { LOANS_TEXT } from '@/content/loans';
import { getLoan } from '@/features/loans/get-loan.server';

export const metadata: Metadata = { title: 'Préstamo' };

/** Detalle de un préstamo: trae el préstamo en el servidor y lo entrega a la vista. */
export default async function LoanPage({ params }: PageProps<'/prestamos/[id]'>) {
  const { id } = await params;
  const result = await getLoan(id);

  if (result.status === 'forbidden') {
    return <EmptyState className="max-w-md" icon="!" {...LOANS_TEXT.forbidden} />;
  }
  if (result.status === 'not-found') {
    return <EmptyState className="max-w-md" icon="?" {...LOANS_TEXT.notFound} />;
  }
  return <LoanDetail loan={result.loan} />;
}
