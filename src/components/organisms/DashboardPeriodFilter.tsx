import { FilterForm } from '@/components/molecules/FilterForm';
import { FilterActions } from '@/components/molecules/FilterActions';
import { FilterDateRange } from '@/components/molecules/FilterDateRange';
import { DASHBOARD_TEXT } from '@/content/dashboard';
import type { DashboardRange } from '@/features/dashboard/dashboard-range';

/**
 * Período de las cifras de cobro del Resumen. Es un formulario GET (`?desde=&hasta=`): funciona sin
 * JavaScript y se puede compartir. Sin fechas se muestra solo hoy. Solo presentación.
 */
export function DashboardPeriodFilter({ range }: Readonly<{ range: DashboardRange }>) {
  const text = DASHBOARD_TEXT.period;

  return (
    <FilterForm action="/resumen" aria-label={text.label} className="flex flex-col gap-2">
      <div className="flex flex-wrap items-end gap-4">
        <FilterDateRange from={range.from} to={range.to} fromLabel={text.from} toLabel={text.to} />
        <FilterActions applyLabel={text.apply} clearLabel={text.clear} clearHref="/resumen" isFiltered={range.from !== ''} />
      </div>
      <p className="text-caption text-foreground/70">{text.hint}</p>
    </FilterForm>
  );
}
