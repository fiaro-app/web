import { StateIcon } from '@/components/atoms/StateIcon';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { FilterPillLink } from '@/components/atoms/FilterPillLink';
import { Text } from '@/components/atoms/Text';
import { EmptyState } from '@/components/molecules/EmptyState';
import { FilterForm } from '@/components/molecules/FilterForm';
import { FilterSubmitButton } from '@/components/molecules/FilterSubmitButton';
import { PaginationNav } from '@/components/molecules/PaginationNav';
import { SearchInput } from '@/components/molecules/SearchInput';
import { StickyToolbar } from '@/components/molecules/StickyToolbar';
import { LoansTable } from '@/components/organisms/LoansTable';
import { LOANS_TEXT } from '@/content/loans';
import { LOAN_STATUS_FILTERS } from '@/features/loans/status-filter';
import type { LoansViewModel } from '@/features/loans/loans-view-model';
import { pageHref } from '@/lib/pagination';

export interface LoansViewProps {
  readonly loans: LoansViewModel;
  /** Puede registrar préstamos (Owner o Lender). */
  readonly canManage?: boolean;
}

interface LoansEmptyStateProps {
  readonly search: string;
  readonly status: LoansViewModel['status'];
  readonly canManage: boolean;
}

/**
 * Estado vacío: sin resultados para la búsqueda, sin préstamos en el estado filtrado (ambos con
 * un enlace para limpiar) o cartera sin préstamos (con acción de registrar si puede).
 */
function LoansEmptyState({ search, status, canManage }: Readonly<LoansEmptyStateProps>) {
  if (search !== '' || status !== null) {
    const hasSearch = search !== '';
    return (
      <EmptyState
        icon={<StateIcon name="search" />}
        {...(hasSearch ? LOANS_TEXT.noResults(search) : LOANS_TEXT.emptyFiltered)}
        action={
          <ButtonLink href="/prestamos" variant="outline">
            {hasSearch ? LOANS_TEXT.search.clear : LOANS_TEXT.filters.all}
          </ButtonLink>
        }
      />
    );
  }

  return (
    <EmptyState
      icon={<StateIcon name="wallet" />}
      {...LOANS_TEXT.empty}
      action={canManage ? <ButtonLink href="/prestamos/nuevo">{LOANS_TEXT.newLoan}</ButtonLink> : undefined}
    />
  );
}

/**
 * Préstamos: título, acción de registrar, búsqueda por cliente (formulario GET `?q=`), filtro por
 * estado (enlaces `?estado=`) y tabla. Solo presentación.
 */
export function LoansView({ loans, canManage = true }: Readonly<LoansViewProps>) {
  const { rows, total, page, pageSize, status, search } = loans;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const hasSearch = search !== '';

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3 max-sm:flex-col max-sm:items-stretch max-sm:[&>a]:w-full">
        <Text variant="title" as="h1" weight="bold" className="text-foreground">
          {LOANS_TEXT.title}
        </Text>
        {canManage && <ButtonLink href="/prestamos/nuevo">{LOANS_TEXT.newLoan}</ButtonLink>}
      </header>

      <StickyToolbar>
        <FilterForm action="/prestamos" role="search" aria-label={LOANS_TEXT.search.label} className="flex max-w-xl gap-3">
          {status !== null && <input type="hidden" name="estado" value={status} />}
          <SearchInput name="q" defaultValue={search} placeholder={LOANS_TEXT.search.placeholder} className="flex-1" />
          <FilterSubmitButton size="sm" className="h-11">
            {LOANS_TEXT.search.submit}
          </FilterSubmitButton>
          {hasSearch && (
            <ButtonLink href={pageHref('/prestamos', 1, { estado: status ?? undefined })} variant="text" size="sm" className="h-11">
              {LOANS_TEXT.search.clear}
            </ButtonLink>
          )}
        </FilterForm>

        <nav aria-label={LOANS_TEXT.filters.label} className="flex flex-wrap gap-2">
          <FilterPillLink href={pageHref('/prestamos', 1, { q: search })} selected={status === null}>
            {LOANS_TEXT.filters.all}
          </FilterPillLink>
          {LOAN_STATUS_FILTERS.map((filter) => (
            <FilterPillLink key={filter} href={pageHref('/prestamos', 1, { estado: filter, q: search })} selected={status === filter}>
              {LOANS_TEXT.status[filter]}
            </FilterPillLink>
          ))}
        </nav>
      </StickyToolbar>

      {rows.length === 0 ? (
        <LoansEmptyState search={search} status={status} canManage={canManage} />
      ) : (
        <>
          <LoansTable rows={rows} />
          <PaginationNav
            page={page}
            pages={pages}
            summary={LOANS_TEXT.pagination.summary(page, pages, total)}
            hrefFor={(target) => pageHref('/prestamos', target, { estado: status ?? undefined, q: search })}
          />
        </>
      )}
    </>
  );
}
