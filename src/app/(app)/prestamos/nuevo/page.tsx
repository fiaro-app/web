import type { Metadata } from 'next';
import { StateIcon } from '@/components/atoms/StateIcon';
import { EmptyState } from '@/components/molecules/EmptyState';
import { getAccess } from '@/features/app-shell/get-access.server';
import { FormWithAside } from '@/components/molecules/FormWithAside';
import { LoanForm } from '@/components/organisms/LoanForm';
import { LOANS_TEXT } from '@/content/loans';
import { getClientOptions } from '@/features/loans/get-client-names.server';
import { getCollectorOptions } from '@/features/loans/get-collector-options.server';
import { parseInitialClient } from '@/features/loans/initial-client';

export const metadata: Metadata = { title: 'Registrar préstamo' };

/** Registrar préstamo: trae los clientes y los cobradores elegibles en el servidor. */
export default async function NewLoanPage({ searchParams }: PageProps<'/prestamos/nuevo'>) {
  if (!(await getAccess()).canManage) return <EmptyState icon={<StateIcon name="lock" />} {...LOANS_TEXT.forbidden} />;
  const { cliente } = await searchParams;
  const [clients, collectors] = await Promise.all([getClientOptions(), getCollectorOptions()]);
  const loanForm = <LoanForm clients={clients} collectors={collectors} initialClientId={parseInitialClient(cliente)} />;
  // Sin clientes la vista muestra el estado vacío a página completa, sin panel lateral.
  return clients.length > 0 ? <FormWithAside aside={LOANS_TEXT.form.aside}>{loanForm}</FormWithAside> : loanForm;
}
