import { FilterForm } from '@/components/molecules/FilterForm';
import { FilterActions } from '@/components/molecules/FilterActions';
import { FilterDateRange } from '@/components/molecules/FilterDateRange';
import { SearchInput } from '@/components/molecules/SearchInput';
import { FilterSelectField } from '@/components/molecules/FilterSelectField';
import { VISITS_TEXT } from '@/content/visits';
import type { VisitReportCollectorOption } from '@/features/visits/get-visit-report.server';
import { EMPTY_VISIT_REPORT_FILTERS, VISIT_OUTCOME_FILTERS, type VisitReportFilters as Filters } from '@/features/visits/visit-report-filters';

export interface VisitReportFiltersProps {
  readonly filters: Filters;
  readonly collectors: readonly VisitReportCollectorOption[];
}

/**
 * Filtros de «Cobros del día» (búsqueda, fechas, cobrador y resultado). Es un formulario GET: los filtros viajan
 * en la URL (`?q=&desde=&hasta=&cobrador=&resultado=`), así funciona sin JavaScript y se puede
 * compartir. Solo presentación.
 */
export function VisitReportFilters({ filters, collectors }: Readonly<VisitReportFiltersProps>) {
  const text = VISITS_TEXT.report.filters;
  const isFiltered = JSON.stringify(filters) !== JSON.stringify(EMPTY_VISIT_REPORT_FILTERS);

  return (
    <FilterForm action="/cobros" aria-label={text.label} className="flex flex-col gap-4">
      {/* Arriba la búsqueda; abajo las opciones con «Aplicar» (un solo botón para todo el filtro). */}
      <label className="flex max-w-xl flex-col gap-1.5 text-label font-medium">
        {text.search}
        <SearchInput name="q" defaultValue={filters.search} placeholder={text.searchPlaceholder} />
      </label>
      <div className="flex flex-wrap items-end gap-4">
        <FilterDateRange from={filters.from} to={filters.to} fromLabel={text.from} toLabel={text.to} />
        <FilterSelectField
          name="cobrador"
          label={text.collector}
          defaultValue={filters.collectorId}
          allLabel={text.allCollectors}
          options={collectors.map((collector) => ({ value: collector.id, label: collector.name }))}
        />
        <FilterSelectField
          name="resultado"
          label={text.outcome}
          defaultValue={filters.outcome}
          allLabel={text.allOutcomes}
          options={VISIT_OUTCOME_FILTERS.map((outcome) => ({ value: outcome, label: VISITS_TEXT.outcome[outcome] }))}
        />
        <FilterActions applyLabel={text.apply} clearLabel={text.clear} clearHref="/cobros" isFiltered={isFiltered} />
      </div>
      <p className="text-caption text-foreground/70">{text.periodHint}</p>
    </FilterForm>
  );
}
