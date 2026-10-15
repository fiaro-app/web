import { ButtonLink } from '@/components/atoms/ButtonLink';
import { LOANS_TEXT } from '@/content/loans';
import { StateIcon } from '@/components/atoms/StateIcon';
import type { ReactNode } from 'react';
import { Avatar } from '@/components/atoms/Avatar';
import { Text } from '@/components/atoms/Text';
import { EmptyState } from '@/components/molecules/EmptyState';
import { PaginationNav } from '@/components/molecules/PaginationNav';
import { Link } from '@/components/atoms/Link';
import { StatTile } from '@/components/molecules/StatTile';
import { StatsBucketRow } from '@/components/molecules/StatsBucketRow';
import { InsightsSection } from '@/components/organisms/InsightsSection';
import type { InsightsViewModel } from '@/features/insights/insights-view-model';
import { StatsExportButton } from '@/components/organisms/StatsExportButton';
import { StatsFilters } from '@/components/organisms/StatsFilters';
import { STATS_TEXT } from '@/content/stats';
import type { StatsFilterOptions } from '@/features/stats/get-stats.server';
import { statsHref, type StatsFilters as Filters } from '@/features/stats/stats-filters';
import type { StatsListPage, StatsViewModel } from '@/features/stats/stats-view-model';
import { cn } from '@/lib/cn';
import { FIGURE_TEXT_CLASSES } from '@/lib/tone';

export interface StatsViewProps {
  readonly stats: StatsViewModel;
  readonly filters: Filters;
  readonly options: StatsFilterOptions;
  /** «Cómo va tu negocio»; `null` si no se pudo traer (la pantalla se pinta igual). */
  readonly insights?: InsightsViewModel | null;
}

function Section({ id, title, children }: Readonly<{ id: string; title: string; children: ReactNode }>) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3 rounded-md bg-surface p-5">
      <h2 id={id} className="text-lg font-semibold text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Cuántas filas traen de entrada el ranking y el desempeño: si llegan todas, puede haber más. */
const INITIAL_LIST_SIZE = 5;

/**
 * Pie de una lista larga: con una página abierta, su paginación y la vuelta a las 5 primeras; si no,
 * «Ver todos» cuando la lista vino llena (puede haber más).
 */
function ListFooter({
  name,
  filters,
  listPage,
  shown,
  summary,
}: Readonly<{
  name: 'mora' | 'desempeno';
  filters: Filters;
  listPage: StatsListPage | undefined;
  shown: number;
  summary: (page: number, pages: number, total: number) => string;
}>) {
  const text = STATS_TEXT.lists;
  if (listPage === undefined) {
    return shown >= INITIAL_LIST_SIZE ? <Link href={statsHref(filters, { name, page: 1 })}>{text.seeAll}</Link> : null;
  }
  return (
    <div className="flex flex-col gap-2">
      <PaginationNav
        page={listPage.page}
        pages={listPage.pages}
        summary={summary(listPage.page, listPage.pages, listPage.total)}
        hrefFor={(target) => statsHref(filters, { name, page: target })}
        previousLabel={text.previous}
        nextLabel={text.next}
      />
      <Link href={statsHref(filters)}>{text.showLess}</Link>
    </div>
  );
}

/** Estadísticas: filtros, indicadores, mora por antigüedad, mayor mora y desempeño por cobrador. Solo presentación. */
export function StatsView({ stats, filters, options, insights = null }: Readonly<StatsViewProps>) {
  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3 max-sm:flex-col max-sm:items-stretch max-sm:[&>a]:w-full">
        <div className="flex flex-col gap-1">
          <Text variant="title" as="h1" weight="bold" className="text-foreground">
            {STATS_TEXT.title}
          </Text>
          <Text variant="label" className="text-foreground/70">
            {STATS_TEXT.period(stats.period)}
          </Text>
        </div>
        <StatsExportButton filters={filters} />
      </header>

      <StatsFilters filters={filters} options={options} />

      {insights && <InsightsSection insights={insights} />}

      {stats.isEmpty ? (
        <EmptyState
          icon={<StateIcon name="chart" />}
          {...STATS_TEXT.empty}
          action={<ButtonLink href="/prestamos/nuevo">{LOANS_TEXT.newLoan}</ButtonLink>}
        />
      ) : (
        <>
          <section aria-label="Indicadores" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {stats.kpis.map((kpi) => (
              <StatTile key={kpi.id} label={kpi.label} value={kpi.value} tone={kpi.tone} trend={kpi.trend} />
            ))}
          </section>

          <div className="grid gap-4 xl:grid-cols-2">
            <Section id="arrears-title" title={STATS_TEXT.sections.arrears}>
              {stats.arrearsByAge.map((bucket) => (
                <StatsBucketRow key={bucket.label} bucket={bucket} />
              ))}
            </Section>

            <Section id="top-arrears-title" title={STATS_TEXT.sections.topArrears}>
              {stats.topArrears.length === 0 ? (
                <p className="text-label text-foreground/70">{STATS_TEXT.noTopArrears}</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {stats.topArrears.map((entry) => (
                    <li key={entry.clientId} className="flex items-center gap-3">
                      <Avatar name={entry.name} />
                      <div className="flex flex-1 flex-col text-label">
                        <span className="font-medium">{entry.name}</span>
                        <span className="text-foreground/70">{entry.days}</span>
                      </div>
                      <span className="font-semibold text-destructive">{entry.amount}</span>
                    </li>
                  ))}
                </ul>
              )}
              <ListFooter
                name="mora"
                filters={filters}
                listPage={stats.topArrearsPage}
                shown={stats.topArrears.length}
                summary={STATS_TEXT.lists.arrearsSummary}
              />
            </Section>
          </div>

          <Section id="collectors-title" title={STATS_TEXT.sections.collectors}>
            {stats.collectors.length === 0 ? (
              <p className="text-label text-foreground/70">{STATS_TEXT.noCollectors}</p>
            ) : (
              <ul className="flex flex-col divide-y divide-foreground/8">
                {stats.collectors.map((collector) => (
                  <li key={collector.collectorId} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <Avatar name={collector.name} />
                      <div className="flex flex-col text-label">
                        <span className="font-medium">{collector.name}</span>
                        <span className={cn('font-medium', FIGURE_TEXT_CLASSES[collector.effectivenessTone])}>
                          {STATS_TEXT.collectorLine(collector.portfolioName, collector.effectiveness)}
                        </span>
                      </div>
                    </div>
                    <span className="text-label text-foreground/70">{STATS_TEXT.collectorOverdue(collector.overdue)}</span>
                  </li>
                ))}
              </ul>
            )}
            <ListFooter
              name="desempeno"
              filters={filters}
              listPage={stats.collectorsPage}
              shown={stats.collectors.length}
              summary={STATS_TEXT.lists.collectorsSummary}
            />
          </Section>
        </>
      )}
    </>
  );
}
