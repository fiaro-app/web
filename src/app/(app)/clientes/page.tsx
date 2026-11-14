import { StateIcon } from '@/components/atoms/StateIcon';
import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ClientsView } from '@/components/organisms/ClientsView';
import { CLIENTS_TEXT } from '@/content/clients';
import { getAccess } from '@/features/app-shell/get-access.server';
import { getClients } from '@/features/clients/get-clients.server';
import { getClientsRisk } from '@/features/risk/get-clients-risk.server';
import { parsePageParam, parseSearchParam } from '@/lib/pagination';

export const metadata: Metadata = { title: 'Clientes' };

/** Clientes: trae la página y la búsqueda pedidas en el servidor y las pinta. */
export default async function ClientsPage({ searchParams }: PageProps<'/clientes'>) {
  const { pagina, q } = await searchParams;
  const [result, { canManage }] = await Promise.all([getClients(parsePageParam(pagina), parseSearchParam(q)), getAccess()]);

  if (result.status === 'forbidden') {
    return <EmptyState icon={<StateIcon name="lock" />} {...CLIENTS_TEXT.forbidden} />;
  }
  const risks = canManage ? await getClientsRisk(result.clients.rows.map((row) => row.id)) : new Map();
  const rows = result.clients.rows.map((row) => ({ ...row, risk: risks.get(row.id) }));
  return <ClientsView clients={{ ...result.clients, rows }} canManage={canManage} />;
}
