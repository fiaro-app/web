import { ButtonLink } from '@/components/atoms/ButtonLink';
import { StateIcon } from '@/components/atoms/StateIcon';
import { Text } from '@/components/atoms/Text';
import { EmptyState } from '@/components/molecules/EmptyState';
import { PaginationNav } from '@/components/molecules/PaginationNav';
import { StickyToolbar } from '@/components/molecules/StickyToolbar';
import { RoutesFilters } from '@/components/organisms/RoutesFilters';
import { RoutesTable } from '@/components/organisms/RoutesTable';
import { ROUTES_TEXT } from '@/content/routes';
import type { RouteCollectorOption } from '@/features/routes/get-routes.server';
import { EMPTY_ROUTE_FILTERS, type RouteFilters } from '@/features/routes/route-filters';
import { describeRouteRange, type RoutesViewModel } from '@/features/routes/routes-view-model';
import { pageHref } from '@/lib/pagination';

export interface RoutesViewProps {
  readonly routes: RoutesViewModel;
  readonly filters: RouteFilters;
  readonly collectors: readonly RouteCollectorOption[];
}

/** Estado vacío: sin resultados para los filtros (con enlace para limpiarlos) o sin rutas en el día. */
function RoutesEmptyState({ isFiltered }: Readonly<{ isFiltered: boolean }>) {
  if (isFiltered) {
    return (
      <EmptyState
        icon={<StateIcon name="search" />}
        {...ROUTES_TEXT.emptyFiltered}
        action={
          <ButtonLink href="/rutas" variant="outline">
            {ROUTES_TEXT.filters.clear}
          </ButtonLink>
        }
      />
    );
  }
  return <EmptyState icon={<StateIcon name="chart" />} {...ROUTES_TEXT.empty} />;
}

/** Registro de rutas: título, filtros, el rango consultado, la tabla y la paginación. Solo presentación. */
export function RoutesView({ routes, filters, collectors }: Readonly<RoutesViewProps>) {
  const text = ROUTES_TEXT;
  const { rows, total, page, pageSize } = routes;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const isFiltered = JSON.stringify(filters) !== JSON.stringify(EMPTY_ROUTE_FILTERS);
  const hrefFilters = { desde: filters.from, hasta: filters.to, cobrador: filters.collectorId };

  return (
    <>
      <div className="flex flex-col gap-1">
        <Text variant="title" as="h1" weight="bold" className="text-foreground">
          {text.title}
        </Text>
        <Text variant="label" className="text-foreground/70">
          {text.subtitle}
        </Text>
      </div>

      <StickyToolbar className="max-md:static">
        <RoutesFilters filters={filters} collectors={collectors} />
      </StickyToolbar>

      <p className="text-label font-semibold text-foreground">{describeRouteRange(routes, filters)}</p>

      {rows.length === 0 ? (
        <RoutesEmptyState isFiltered={isFiltered} />
      ) : (
        <>
          <RoutesTable rows={rows} />
          <Text variant="caption" className="text-foreground/70">
            {text.hint}
          </Text>
          <PaginationNav
            page={page}
            pages={pages}
            summary={text.pagination.summary(page, pages, total)}
            hrefFor={(target) => pageHref('/rutas', target, hrefFilters)}
          />
        </>
      )}
    </>
  );
}
