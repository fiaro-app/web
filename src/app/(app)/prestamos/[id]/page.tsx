import { StateIcon } from '@/components/atoms/StateIcon';
import type { Metadata } from 'next';
import { Alert } from '@/components/molecules/Alert';
import { FormWithAside } from '@/components/molecules/FormWithAside';
import { EmptyState } from '@/components/molecules/EmptyState';
import { CollectionForm } from '@/components/organisms/CollectionForm';
import { LoanDetail } from '@/components/organisms/LoanDetail';
import { LoanInstallments } from '@/components/organisms/LoanInstallments';
import { LoanVisits } from '@/components/organisms/LoanVisits';
import { LOANS_TEXT } from '@/content/loans';
import { getAccess } from '@/features/app-shell/get-access.server';
import { getLoanInstallments } from '@/features/loans/get-installments.server';
import { getLoan } from '@/features/loans/get-loan.server';
import { summarizeInstallments, toInstallmentRows } from '@/features/loans/installments-view-model';
import { VISITS_TEXT } from '@/content/visits';
import { getLoanVisits } from '@/features/visits/get-visits.server';

export const metadata: Metadata = { title: 'Préstamo' };

/** Detalle de un préstamo: trae el préstamo en el servidor y lo entrega a la vista. */
export default async function LoanPage({ params }: PageProps<'/prestamos/[id]'>) {
  const { id } = await params;
  const result = await getLoan(id);

  if (result.status === 'forbidden') {
    return <EmptyState icon={<StateIcon name="lock" />} {...LOANS_TEXT.forbidden} />;
  }
  if (result.status === 'not-found') {
    return <EmptyState icon={<StateIcon name="search" />} {...LOANS_TEXT.notFound} />;
  }
  const [visits, installments, { canManage }] = await Promise.all([getLoanVisits(id), getLoanInstallments(id), getAccess()]);
  return (
    <>
      <FormWithAside aside={LOANS_TEXT.detailAside}>
        <div className="flex flex-col gap-8">
          <LoanDetail loan={result.loan} collectors={result.collectorOptions} canManage={canManage} />
          {result.collect === 'available' && <CollectionForm loanId={result.loan.id} installmentValue={result.loan.installmentValue} />}
          {result.collect === 'unassigned' && <Alert tone="info">{VISITS_TEXT.collect.notAssigned}</Alert>}
        </div>
      </FormWithAside>
      <LoanInstallments rows={toInstallmentRows(installments)} summary={summarizeInstallments(installments)} />
      <LoanVisits visits={visits} canManage={canManage} />
    </>
  );
}
