import type { Metadata } from 'next';
import { LoanForm } from '@/components/organisms/LoanForm';
import { getClientOptions } from '@/features/loans/get-client-names.server';

export const metadata: Metadata = { title: 'Registrar préstamo' };

/** Registrar préstamo: trae los clientes elegibles en el servidor. */
export default async function NewLoanPage() {
  return <LoanForm clients={await getClientOptions()} />;
}
