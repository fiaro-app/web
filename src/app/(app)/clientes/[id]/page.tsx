import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ClientForm } from '@/components/organisms/ClientForm';
import { CLIENTS_TEXT } from '@/content/clients';
import { getClient } from '@/features/clients/get-client.server';

export const metadata: Metadata = { title: 'Editar cliente' };

/** Editar cliente: trae el cliente en el servidor y lo entrega al formulario. */
export default async function EditClientPage({ params }: PageProps<'/clientes/[id]'>) {
  const { id } = await params;
  const result = await getClient(id);

  if (result.status === 'forbidden') {
    return <EmptyState className="max-w-md" icon="!" {...CLIENTS_TEXT.forbidden} />;
  }
  if (result.status === 'not-found') {
    return <EmptyState className="max-w-md" icon="?" {...CLIENTS_TEXT.notFound} />;
  }
  return <ClientForm client={result.client} />;
}
