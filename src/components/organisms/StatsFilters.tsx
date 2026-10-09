import { FilterForm } from '@/components/molecules/FilterForm';
import { FilterActions } from '@/components/molecules/FilterActions';
import { FilterDateRange } from '@/components/molecules/FilterDateRange';
import { FilterSelectField } from '@/components/molecules/FilterSelectField';
import { STATS_TEXT } from '@/content/stats';
import type { StatsFilterOptions } from '@/features/stats/get-stats.server';
import { EMPTY_STATS_FILTERS, type StatsFilters as Filters } from '@/features/stats/stats-filters';

export interface StatsFiltersProps {
  readonly filters: Filters;
  readonly options: StatsFilterOptions;
}

/**
 * Filtros de las estadísticas (período, cobrador y cartera). Es un formulario GET: los filtros
 * viajan en la URL (`?desde=&hasta=&cobrador=&cartera=`), así funciona sin JavaScript y se puede
 * compartir. Solo presentación.
 */
export function StatsFilters({ filters, options }: Readonly<StatsFiltersProps>) {
  const text = STATS_TEXT.filters;
  const isFiltered = JSON.stringify(filters) !== JSON.stringify(EMPTY_STATS_FILTERS);

  return (
    <FilterForm action="/estadisticas" aria-label={text.label} className="flex flex-col gap-2">
      <div className="flex flex-wrap items-end gap-4">
        <FilterDateRange from={filters.from} to={filters.to} fromLabel={text.from} toLabel={text.to} />
        <FilterSelectField
          name="cobrador"
          label={text.collector}
          defaultValue={filters.collectorId}
          allLabel={text.allCollectors}
          options={options.collectors.map((collector) => ({ value: collector.id, label: collector.name }))}
        />
        <FilterSelectField
          name="cartera"
          label={text.portfolio}
          defaultValue={filters.portfolioId}
          allLabel={text.allPortfolios}
          options={options.portfolios.map((portfolio) => ({ value: portfolio.id, label: portfolio.name }))}
        />
        <FilterActions applyLabel={text.apply} clearLabel={text.clear} clearHref="/estadisticas" isFiltered={isFiltered} />
      </div>
      <p className="text-caption text-foreground/70">{text.periodHint}</p>
    </FilterForm>
  );
}
