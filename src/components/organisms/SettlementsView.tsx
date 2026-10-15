import { RememberList } from '@/components/molecules/BackLink';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { StateIcon } from '@/components/atoms/StateIcon';
import { FilterPillLink } from '@/components/atoms/FilterPillLink';
import { Text } from '@/components/atoms/Text';
import { EmptyState } from '@/components/molecules/EmptyState';
import { PaginationNav } from '@/components/molecules/PaginationNav';
import { StickyToolbar } from '@/components/molecules/StickyToolbar';
import { SettlementFilters } from '@/components/organisms/SettlementFilters';
import { SettlementsTable } from '@/components/organisms/SettlementsTable';
import { SETTLEMENTS_TEXT } from '@/content/settlements';
import type { SettlementFilterOptions } from '@/features/settlements/get-settlements.server';
import { EMPTY_SETTLEMENT_FILTERS } from '@/features/settlements/settlement-filters';
import {
  DEFAULT_SETTLEMENT_STATUS,
  SETTLEMENT_STATUS_FILTERS,
  settlementStatusParam,
} from '@/features/settlements/status-filter';
import type { SettlementsViewModel } from '@/features/settlements/settlements-view-model';
import { pageHref } from '@/lib/pagination';

export interface SettlementsViewProps {
  readonly settlements: SettlementsViewModel;
  /** Lo que se puede elegir en los filtros; vacío si no se pudo traer. */
  readonly options?: SettlementFilterOptions;
}

/** Estado vacío: sin resultados para los filtros (con enlace para quitarlos) o sin cuadres. */
function SettlementsEmptyState({ isFiltered }: Readonly<{ readonly isFiltered: boolean }>) {
  if (isFiltered) {
    return (
      <EmptyState
        icon={<StateIcon name="search" />}
        {...SETTLEMENTS_TEXT.emptyFiltered}
        action={
          <ButtonLink href="/cuadres" variant="outline">
            {SETTLEMENTS_TEXT.filters.all}
          </ButtonLink>
        }
      />
    );
  }

  return <EmptyState icon={<StateIcon name="clipboard" />} {...SETTLEMENTS_TEXT.empty} />;
}

/** Cuadres: título, filtro por estado (enlaces `?estado=`), filtros de fecha, cobrador y cartera, y tabla. Solo presentación. */
export function SettlementsView({ settlements, options = { collectors: [], portfolios: [] } }: Readonly<SettlementsViewProps>) {
  const { rows, total, page, pageSize, status, filters } = settlements;
  const isFiltered = status !== DEFAULT_SETTLEMENT_STATUS || JSON.stringify(filters) !== JSON.stringify(EMPTY_SETTLEMENT_FILTERS);
  const hrefFilters = { desde: filters.from, hasta: filters.to, cobrador: filters.collectorId, cartera: filters.portfolioId };
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <RememberList path="/cuadres" />
      <Text variant="title" as="h1" weight="bold" className="text-foreground">
        {SETTLEMENTS_TEXT.title}
      </Text>

      <StickyToolbar className="max-md:static">
        <nav aria-label={SETTLEMENTS_TEXT.filters.label} className="flex flex-wrap gap-2">
          {SETTLEMENT_STATUS_FILTERS.map((filter) => (
            <FilterPillLink key={filter} href={pageHref('/cuadres', 1, { ...hrefFilters, estado: filter })} selected={status === filter}>
              {SETTLEMENTS_TEXT.status[filter]}
            </FilterPillLink>
          ))}
          <FilterPillLink href={pageHref('/cuadres', 1, { ...hrefFilters, estado: settlementStatusParam(null) })} selected={status === null}>
            {SETTLEMENTS_TEXT.filters.all}
          </FilterPillLink>
        </nav>

        <SettlementFilters filters={filters} options={options} status={status} />
      </StickyToolbar>

      {rows.length === 0 ? (
        <SettlementsEmptyState isFiltered={isFiltered} />
      ) : (
        <>
          <SettlementsTable rows={rows} />
          <PaginationNav
            page={page}
            pages={pages}
            summary={SETTLEMENTS_TEXT.pagination.summary(page, pages, total)}
            hrefFor={(target) => pageHref('/cuadres', target, { ...hrefFilters, estado: settlementStatusParam(status) })}
          />
        </>
      )}
    </>
  );
}
