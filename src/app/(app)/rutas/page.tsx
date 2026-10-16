import type { Metadata } from 'next';
import { StateIcon } from '@/components/atoms/StateIcon';
import { EmptyState } from '@/components/molecules/EmptyState';
import { RoutesView } from '@/components/organisms/RoutesView';
import { ROUTES_TEXT } from '@/content/routes';
import { getRoutes } from '@/features/routes/get-routes.server';
import { parseRouteFilters } from '@/features/routes/route-filters';
import { parsePageParam } from '@/lib/pagination';

export const metadata: Metadata = { title: 'Registro de rutas' };

/** Registro de rutas: trae la página y los filtros pedidos en el servidor y los pinta. */
export default async function RoutesPage({ searchParams }: Readonly<PageProps<'/rutas'>>) {
  const params = await searchParams;
  const filters = parseRouteFilters(params);
  const result = await getRoutes(filters, parsePageParam(params.pagina));

  if (result.status === 'forbidden') {
    return <EmptyState icon={<StateIcon name="lock" />} {...ROUTES_TEXT.forbidden} />;
  }
  return <RoutesView routes={result.routes} filters={filters} collectors={result.collectors} />;
}
