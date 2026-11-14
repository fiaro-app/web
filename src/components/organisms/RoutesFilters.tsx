import { FilterActions } from '@/components/molecules/FilterActions';
import { FilterDateRange } from '@/components/molecules/FilterDateRange';
import { FilterForm } from '@/components/molecules/FilterForm';
import { FilterSelectField } from '@/components/molecules/FilterSelectField';
import { ROUTES_TEXT } from '@/content/routes';
import type { RouteCollectorOption } from '@/features/routes/get-routes.server';
import { EMPTY_ROUTE_FILTERS, type RouteFilters } from '@/features/routes/route-filters';

export interface RoutesFiltersProps {
  readonly filters: RouteFilters;
  readonly collectors: readonly RouteCollectorOption[];
}

/** Filtros del registro de rutas (fechas y cobrador). Formulario GET: los filtros viajan en la URL. Solo presentación. */
export function RoutesFilters({ filters, collectors }: Readonly<RoutesFiltersProps>) {
  const text = ROUTES_TEXT.filters;
  const isFiltered = JSON.stringify(filters) !== JSON.stringify(EMPTY_ROUTE_FILTERS);

  return (
    <FilterForm action="/rutas" aria-label={text.label} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-4">
        <FilterDateRange from={filters.from} to={filters.to} fromLabel={text.from} toLabel={text.to} />
        <FilterSelectField
          name="cobrador"
          label={text.collector}
          defaultValue={filters.collectorId}
          allLabel={text.allCollectors}
          options={collectors.map((collector) => ({ value: collector.id, label: collector.name }))}
        />
        <FilterActions applyLabel={text.apply} clearLabel={text.clear} clearHref="/rutas" isFiltered={isFiltered} />
      </div>
      <p className="text-caption text-foreground/70">{text.periodHint}</p>
    </FilterForm>
  );
}
