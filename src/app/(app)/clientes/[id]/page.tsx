import { StateIcon } from '@/components/atoms/StateIcon';
import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ClientForm } from '@/components/organisms/ClientForm';
import { ClientRiskCard } from '@/components/organisms/ClientRiskCard';
import { PrivateImage } from '@/components/organisms/PrivateImage';
import { ClientLoans } from '@/components/organisms/ClientLoans';
import { CLIENTS_TEXT } from '@/content/clients';
import { ATTACHMENTS_TEXT } from '@/content/attachments';
import { getAccess } from '@/features/app-shell/get-access.server';
import { getClient } from '@/features/clients/get-client.server';
import { getClientsRisk } from '@/features/risk/get-clients-risk.server';
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
  const [loans, risks] = await Promise.all([getClientLoans(result.client.id), getClientsRisk([result.client.id])]);
  const risk = risks.get(result.client.id);
  return (
    <>
      <ClientForm client={result.client} />
      <PrivateImage
        target="clientPhoto"
        id={result.client.id}
        canEdit
        title={ATTACHMENTS_TEXT.clientPhoto.title}
        description={ATTACHMENTS_TEXT.clientPhoto.description}
        alt={ATTACHMENTS_TEXT.clientPhoto.alt(result.client.fullName)}
        none={ATTACHMENTS_TEXT.clientPhoto.none}
      />
      {risk && <ClientRiskCard risk={risk} />}
      <ClientLoans clientId={result.client.id} loans={loans} />
    </>
  );
}
