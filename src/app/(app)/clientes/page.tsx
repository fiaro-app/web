import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ClientsView } from '@/components/organisms/ClientsView';
import { CLIENTS_TEXT } from '@/content/clients';
import { getClients } from '@/features/clients/get-clients.server';
import { parsePageParam, parseSearchParam } from '@/lib/pagination';

export const metadata: Metadata = { title: 'Clientes' };

/** Clientes: trae la página y la búsqueda pedidas en el servidor y las pinta. */
export default async function ClientsPage({ searchParams }: PageProps<'/clientes'>) {
  const { pagina, q } = await searchParams;
  const result = await getClients(parsePageParam(pagina), parseSearchParam(q));

  if (result.status === 'forbidden') {
    return <EmptyState className="max-w-md" icon="!" {...CLIENTS_TEXT.forbidden} />;
  }
  return <ClientsView clients={result.clients} />;
}
