import { StateIcon } from '@/components/atoms/StateIcon';
import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ClientsView } from '@/components/organisms/ClientsView';
import { CLIENTS_TEXT } from '@/content/clients';
import { getAccess } from '@/features/app-shell/get-access.server';
import { getClients } from '@/features/clients/get-clients.server';
import { parsePageParam, parseSearchParam } from '@/lib/pagination';

export const metadata: Metadata = { title: 'Clientes' };

/** Clientes: trae la página y la búsqueda pedidas en el servidor y las pinta. */
export default async function ClientsPage({ searchParams }: PageProps<'/clientes'>) {
  const { pagina, q } = await searchParams;
  const [result, { canManage }] = await Promise.all([getClients(parsePageParam(pagina), parseSearchParam(q)), getAccess()]);

  if (result.status === 'forbidden') {
    return <EmptyState icon={<StateIcon name="lock" />} {...CLIENTS_TEXT.forbidden} />;
  }
  return <ClientsView clients={result.clients} canManage={canManage} />;
}
