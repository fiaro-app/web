import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { FormField } from "@/components/molecules/FormField";
import { STATS_TEXT } from "@/content/stats";
import type { StatsFilterOptions } from "@/features/stats/get-stats.server";
import {
  EMPTY_STATS_FILTERS,
  type StatsFilters as Filters,
} from "@/features/stats/stats-filters";

export interface StatsFiltersProps {
  readonly filters: Filters;
  readonly options: StatsFilterOptions;
}

/**
 * Filtros de las estadísticas (período, cobrador y cartera). Es un formulario GET: los filtros
 * viajan en la URL (`?desde=&hasta=&cobrador=&cartera=`), así funciona sin JavaScript y se puede
 * compartir. Solo presentación.
 */
export function StatsFilters({
  filters,
  options,
}: Readonly<StatsFiltersProps>) {
  const text = STATS_TEXT.filters;
  const isFiltered =
    JSON.stringify(filters) !== JSON.stringify(EMPTY_STATS_FILTERS);

  return (
    <form
      action="/estadisticas"
      aria-label={text.label}
      className="flex flex-col gap-2"
    >
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
              {options.collectors.map((collector) => (
                <option key={collector.id} value={collector.id}>
                  {collector.name}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
        <div className="w-56">
          <FormField label={text.portfolio}>
            <Select name="cartera" defaultValue={filters.portfolioId}>
              <option value="">{text.allPortfolios}</option>
              {options.portfolios.map((portfolio) => (
                <option key={portfolio.id} value={portfolio.id}>
                  {portfolio.name}
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
            <ButtonLink
              href="/estadisticas"
              variant="text"
              size="sm"
              className="h-11"
            >
              {text.clear}
            </ButtonLink>
          )}
        </div>
      </div>
      <p className="text-caption text-foreground/70">{text.periodHint}</p>
    </form>
  );
}
