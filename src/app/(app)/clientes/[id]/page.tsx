import { StateIcon } from '@/components/atoms/StateIcon';
import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ClientForm } from '@/components/organisms/ClientForm';
import { ClientLoans } from '@/components/organisms/ClientLoans';
import { CLIENTS_TEXT } from '@/content/clients';
import { getAccess } from '@/features/app-shell/get-access.server';
import { getClient } from '@/features/clients/get-client.server';
import { getClientLoans } from '@/features/loans/get-client-loans.server';

export const metadata: Metadata = { title: 'Editar cliente' };

/** Ficha del cliente: su formulario de edición y sus préstamos, traídos en el servidor. */
export default async function EditClientPage({ params }: PageProps<'/clientes/[id]'>) {
  const { id } = await params;
  const [result, { canManage }] = await Promise.all([getClient(id), getAccess()]);

  if (result.status === 'forbidden') {
    return <EmptyState icon={<StateIcon name="lock" />} {...CLIENTS_TEXT.forbidden} />;
  }
  if (result.status === 'not-found') {
    return <EmptyState icon={<StateIcon name="search" />} {...CLIENTS_TEXT.notFound} />;
  }
  // Editar clientes y registrarles préstamos es de quien administra el negocio.
  if (!canManage) return <EmptyState icon={<StateIcon name="lock" />} {...CLIENTS_TEXT.forbidden} />;
  const loans = await getClientLoans(result.client.id, result.client.fullName);
  return (
    <>
      <ClientForm client={result.client} />
      <ClientLoans clientId={result.client.id} loans={loans} />
    </>
  );
}
