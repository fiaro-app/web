import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ClientForm } from '@/components/organisms/ClientForm';
import { ClientLoans } from '@/components/organisms/ClientLoans';
import { CLIENTS_TEXT } from '@/content/clients';
import { getClient } from '@/features/clients/get-client.server';
import { getClientLoans } from '@/features/loans/get-client-loans.server';

export const metadata: Metadata = { title: 'Editar cliente' };

/** Ficha del cliente: su formulario de edición y sus préstamos, traídos en el servidor. */
export default async function EditClientPage({ params }: PageProps<'/clientes/[id]'>) {
  const { id } = await params;
  const result = await getClient(id);

  if (result.status === 'forbidden') {
    return <EmptyState className="max-w-md" icon="!" {...CLIENTS_TEXT.forbidden} />;
  }
  if (result.status === 'not-found') {
    return <EmptyState className="max-w-md" icon="?" {...CLIENTS_TEXT.notFound} />;
  }
  const loans = await getClientLoans(result.client.id, result.client.fullName);
  return (
    <>
      <ClientForm client={result.client} />
      <ClientLoans clientId={result.client.id} loans={loans} />
    </>
  );
}
