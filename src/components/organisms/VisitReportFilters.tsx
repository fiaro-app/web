import { Button } from '@/components/atoms/Button';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { FormField } from '@/components/molecules/FormField';
import { VISITS_TEXT } from '@/content/visits';
import type { VisitReportCollectorOption } from '@/features/visits/get-visit-report.server';
import {
  EMPTY_VISIT_REPORT_FILTERS,
  VISIT_OUTCOME_FILTERS,
  type VisitReportFilters as Filters,
} from '@/features/visits/visit-report-filters';

export interface VisitReportFiltersProps {
  readonly filters: Filters;
  readonly collectors: readonly VisitReportCollectorOption[];
}

/**
 * Filtros de «Cobros del día» (fechas, cobrador y resultado). Es un formulario GET: los filtros viajan
 * en la URL (`?desde=&hasta=&cobrador=&resultado=`), así funciona sin JavaScript y se puede
 * compartir. Solo presentación.
 */
export function VisitReportFilters({ filters, collectors }: Readonly<VisitReportFiltersProps>) {
  const text = VISITS_TEXT.report.filters;
  const isFiltered = JSON.stringify(filters) !== JSON.stringify(EMPTY_VISIT_REPORT_FILTERS);

  return (
    <form action="/cobros" aria-label={text.label} className="flex flex-col gap-2">
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-44">
          <FormField label={text.from}>
            <Input name="desde" type="date" defaultValue={filters.from} />
          </FormField>
        </div>
        <div className="w-44">
          <FormField label={text.to}>
            <Input name="hasta" type="date" defaultValue={filters.to} />
          </FormField>
        </div>
        <div className="w-56">
          <FormField label={text.collector}>
            <Select name="cobrador" defaultValue={filters.collectorId}>
              <option value="">{text.allCollectors}</option>
              {collectors.map((collector) => (
                <option key={collector.id} value={collector.id}>
                  {collector.name}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
        <div className="w-56">
          <FormField label={text.outcome}>
            <Select name="resultado" defaultValue={filters.outcome}>
              <option value="">{text.allOutcomes}</option>
              {VISIT_OUTCOME_FILTERS.map((outcome) => (
                <option key={outcome} value={outcome}>
                  {VISITS_TEXT.outcome[outcome]}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
        <div className="flex gap-3">
          <Button type="submit" variant="outline" size="sm" className="h-11">
            {text.apply}
          </Button>
          {isFiltered && (
            <ButtonLink href="/cobros" variant="text" size="sm" className="h-11">
              {text.clear}
            </ButtonLink>
          )}
        </div>
      </div>
      <p className="text-caption text-foreground/70">{text.periodHint}</p>
    </form>
  );
}
