import type { Metadata } from 'next';
import { LoanForm } from '@/components/organisms/LoanForm';
import { getClientOptions } from '@/features/loans/get-client-names.server';
import { getCollectorOptions } from '@/features/loans/get-collector-options.server';

export const metadata: Metadata = { title: 'Registrar préstamo' };

/** Registrar préstamo: trae los clientes y los cobradores elegibles en el servidor. */
export default async function NewLoanPage() {
  const [clients, collectors] = await Promise.all([getClientOptions(), getCollectorOptions()]);
  return <LoanForm clients={clients} collectors={collectors} />;
}
