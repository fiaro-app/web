import { StateIcon } from '@/components/atoms/StateIcon';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { FilterPillLink } from '@/components/atoms/FilterPillLink';
import { Text } from '@/components/atoms/Text';
import { EmptyState } from '@/components/molecules/EmptyState';
import { PaginationNav } from '@/components/molecules/PaginationNav';
import { CollectorsTable } from '@/components/organisms/CollectorsTable';
import { COLLECTORS_TEXT } from '@/content/collectors';
import { pageHref } from '@/lib/pagination';
import type { CollectorsViewModel } from '@/features/collectors/collectors-view-model';
import { COLLECTOR_STATUS_FILTERS } from '@/features/collectors/status-filter';

export interface CollectorsViewProps {
  readonly collectors: CollectorsViewModel;
}

/** Cobradores (`Screen / Web / Cobradores`): título, acción de registrar, filtro de estado y la tabla. Solo presentación. */
export function CollectorsView({ collectors }: Readonly<CollectorsViewProps>) {
  const { rows, total, page, pageSize, filter = 'activos' } = collectors;
  const empty = filter === 'activos' && total === 0 ? COLLECTORS_TEXT.empty : COLLECTORS_TEXT.emptyFiltered;
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3 max-sm:flex-col max-sm:items-stretch max-sm:[&>a]:w-full">
        <Text variant="title" as="h1" weight="bold" className="text-foreground">
          {COLLECTORS_TEXT.title}
        </Text>
        <ButtonLink href="/cobradores/nuevo">{COLLECTORS_TEXT.newCollector}</ButtonLink>
      </header>

      <nav aria-label={COLLECTORS_TEXT.statusFilter.label} className="flex flex-wrap gap-2">
        {COLLECTOR_STATUS_FILTERS.map((option) => (
          <FilterPillLink key={option} href={pageHref('/cobradores', 1, { estado: option === 'activos' ? undefined : option })} selected={filter === option}>
            {COLLECTORS_TEXT.statusFilter[option]}
          </FilterPillLink>
        ))}
      </nav>

      {rows.length === 0 ? (
        <EmptyState
          icon={<StateIcon name="users" />}
          title={empty.title}
          description={empty.description}
          action={<ButtonLink href="/cobradores/nuevo">{COLLECTORS_TEXT.form.submit}</ButtonLink>}
        />
      ) : (
        <>
          <CollectorsTable rows={rows} />
          <PaginationNav
            page={page}
            pages={pages}
            summary={COLLECTORS_TEXT.pagination.summary(page, pages, total)}
            hrefFor={(target) => pageHref('/cobradores', target, { estado: filter === 'activos' ? undefined : filter })}
            previousLabel={COLLECTORS_TEXT.pagination.previous}
            nextLabel={COLLECTORS_TEXT.pagination.next}
          />
        </>
      )}
    </>
  );
}
