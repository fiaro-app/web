import { ButtonLink } from '@/components/atoms/ButtonLink';
import { StateIcon } from '@/components/atoms/StateIcon';
import { Text } from '@/components/atoms/Text';
import { EmptyState } from '@/components/molecules/EmptyState';
import { Alert } from '@/components/molecules/Alert';
import { PaginationNav } from '@/components/molecules/PaginationNav';
import { StickyToolbar } from '@/components/molecules/StickyToolbar';
import { VisitReportFilters } from '@/components/organisms/VisitReportFilters';
import { VisitReportTable } from '@/components/organisms/VisitReportTable';
import { VISITS_TEXT } from '@/content/visits';
import type { VisitReportCollectorOption } from '@/features/visits/get-visit-report.server';
import { EMPTY_VISIT_REPORT_FILTERS, type VisitReportFilters as Filters } from '@/features/visits/visit-report-filters';
import type { VisitReportViewModel } from '@/features/visits/visits-view-model';
import { pageHref } from '@/lib/pagination';

export interface VisitReportViewProps {
  readonly report: VisitReportViewModel;
  readonly filters: Filters;
  readonly collectors: readonly VisitReportCollectorOption[];
}

/** Texto del rango que la API resolvió: hoy, un día o un período. */
function describeRange(report: VisitReportViewModel, filters: Filters): string {
  const text = VISITS_TEXT.report;
  if (filters.from === '') return text.rangeToday(report.rangeFrom);
  return report.rangeFrom === report.rangeTo ? text.rangeDay(report.rangeFrom) : text.range(report.rangeFrom, report.rangeTo);
}

/** Estado vacío: sin resultados para los filtros (con enlace para limpiarlos) o sin cobros en el día. */
function VisitReportEmptyState({ isFiltered }: Readonly<{ readonly isFiltered: boolean }>) {
  if (isFiltered) {
    return (
      <EmptyState
        icon={<StateIcon name="search" />}
        {...VISITS_TEXT.report.emptyFiltered}
        action={
          <ButtonLink href="/cobros" variant="outline">
            {VISITS_TEXT.report.filters.clear}
          </ButtonLink>
        }
      />
    );
  }

  return <EmptyState icon={<StateIcon name="wallet" />} {...VISITS_TEXT.report.empty} />;
}

/** Cobros del día (`Screen / Web / Cobros del día`): título, filtros, tabla y paginación. Solo presentación. */
export function VisitReportView({ report, filters, collectors }: Readonly<VisitReportViewProps>) {
  const text = VISITS_TEXT.report;
  const { rows, total, page, pageSize } = report;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const isFiltered = JSON.stringify(filters) !== JSON.stringify(EMPTY_VISIT_REPORT_FILTERS);
  const hrefFilters = { desde: filters.from, hasta: filters.to, cobrador: filters.collectorId, resultado: filters.outcome, q: filters.search };

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
        <VisitReportFilters filters={filters} collectors={collectors} />
      </StickyToolbar>

      <p className="text-label font-semibold text-foreground">{describeRange(report, filters)}</p>
      {report.searchTruncated && <Alert tone="info">{text.searchTruncated}</Alert>}

      {rows.length === 0 ? (
        <VisitReportEmptyState isFiltered={isFiltered} />
      ) : (
        <>
          <VisitReportTable rows={rows} />
          <PaginationNav
            page={page}
            pages={pages}
            summary={text.pagination.summary(page, pages, total)}
            hrefFor={(target) => pageHref('/cobros', target, hrefFilters)}
          />
        </>
      )}
    </>
  );
}
