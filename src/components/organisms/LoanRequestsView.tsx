import { StateIcon } from '@/components/atoms/StateIcon';
import { FilterPillLink } from '@/components/atoms/FilterPillLink';
import { Text } from '@/components/atoms/Text';
import { RememberList } from '@/components/molecules/BackLink';
import { EmptyState } from '@/components/molecules/EmptyState';
import { PaginationNav } from '@/components/molecules/PaginationNav';
import { LoanRequestCard } from '@/components/organisms/LoanRequestCard';
import { LOAN_REQUESTS_TEXT } from '@/content/loan-requests';
import { LOAN_REQUEST_STATUSES } from '@/features/loan-requests/endpoints';
import type { LoanRequestsViewModel } from '@/features/loan-requests/loan-requests-view-model';
import { loanRequestStatusParam } from '@/features/loan-requests/status-filter';
import { pageHref } from '@/lib/pagination';

/** Solicitudes: título, filtro por estado (enlaces `?estado=`) y una tarjeta por solicitud. Solo presentación. */
export function LoanRequestsView({ requests }: Readonly<{ requests: LoanRequestsViewModel }>) {
  const { rows, total, page, pageSize, status } = requests;
  const text = LOAN_REQUESTS_TEXT;
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <RememberList path="/solicitudes" />
      <div className="flex flex-col gap-1">
        <Text variant="title" as="h1" weight="bold" className="text-foreground">
          {text.title}
        </Text>
        <Text variant="label" className="text-foreground/70">
          {text.subtitle}
        </Text>
      </div>

      <nav aria-label={text.filters.label} className="flex flex-wrap gap-2">
        {LOAN_REQUEST_STATUSES.map((filter) => (
          <FilterPillLink key={filter} href={pageHref('/solicitudes', 1, { estado: filter })} selected={status === filter}>
            {text.status[filter]}
          </FilterPillLink>
        ))}
        <FilterPillLink href={pageHref('/solicitudes', 1, { estado: loanRequestStatusParam(null) })} selected={status === null}>
          {text.filters.all}
        </FilterPillLink>
      </nav>

      {rows.length === 0 ? (
        <EmptyState icon={<StateIcon name="clipboard" />} {...text.empty} />
      ) : (
        <>
          <div className="flex max-w-2xl flex-col gap-4">
            {rows.map((row) => (
              <LoanRequestCard key={row.id} row={row} />
            ))}
          </div>
          <PaginationNav
            page={page}
            pages={pages}
            summary={text.pagination.summary(page, pages, total)}
            hrefFor={(target) => pageHref('/solicitudes', target, { estado: loanRequestStatusParam(status) })}
          />
        </>
      )}
    </>
  );
}
