import { FilterActions } from '@/components/molecules/FilterActions';
import { FilterDateRange } from '@/components/molecules/FilterDateRange';
import { FilterSelectField } from '@/components/molecules/FilterSelectField';
import { SETTLEMENTS_TEXT } from '@/content/settlements';
import type { SettlementFilterOptions } from '@/features/settlements/get-settlements.server';
import { EMPTY_SETTLEMENT_FILTERS, type SettlementFilters as Filters } from '@/features/settlements/settlement-filters';

export interface SettlementFiltersProps {
  readonly filters: Filters;
  readonly options: SettlementFilterOptions;
  /** Estado activo (`PENDING`…): viaja oculto para que filtrar por fecha no lo pierda. */
  readonly status: string | null;
}

/**
 * Filtros de «Cuadres» (fechas, cobrador y cartera). Es un formulario GET: viajan en la URL
 * (`?desde=&hasta=&cobrador=&cartera=`) junto con el estado, así funciona sin JavaScript y se puede
 * compartir. Solo presentación.
 */
export function SettlementFilters({ filters, options, status }: Readonly<SettlementFiltersProps>) {
  const text = SETTLEMENTS_TEXT.filters;
  const isFiltered = JSON.stringify(filters) !== JSON.stringify(EMPTY_SETTLEMENT_FILTERS);

  return (
    <form action="/cuadres" aria-label={text.form} className="flex flex-col gap-2">
      {status && <input type="hidden" name="estado" value={status} />}
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
        <FilterActions
          applyLabel={text.apply}
          clearLabel={text.clear}
          clearHref={status ? `/cuadres?estado=${status}` : '/cuadres'}
          isFiltered={isFiltered}
        />
      </div>
      <p className="text-caption text-foreground/70">{text.dateHint}</p>
    </form>
  );
}
