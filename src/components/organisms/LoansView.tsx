import { StateIcon } from "@/components/atoms/StateIcon";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { FilterPillLink } from "@/components/atoms/FilterPillLink";
import { Text } from "@/components/atoms/Text";
import { EmptyState } from "@/components/molecules/EmptyState";
import { PaginationNav } from "@/components/molecules/PaginationNav";
import { LoansTable } from "@/components/organisms/LoansTable";
import { LOANS_TEXT } from "@/content/loans";
import { LOAN_STATUS_FILTERS } from "@/features/loans/status-filter";
import type { LoansViewModel } from "@/features/loans/loans-view-model";
import { pageHref } from "@/lib/pagination";

export interface LoansViewProps {
  readonly loans: LoansViewModel;
}

/**
 * Préstamos: título, acción de registrar, filtro por estado (enlaces `?estado=`) y tabla.
 * Solo presentación.
 */
export function LoansView({ loans }: Readonly<LoansViewProps>) {
  const { rows, total, page, pageSize, status } = loans;
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3 max-sm:flex-col max-sm:items-stretch max-sm:[&>a]:w-full">
        <Text variant="title" as="h1" weight="bold" className="text-foreground">
          {LOANS_TEXT.title}
        </Text>
        <ButtonLink href="/prestamos/nuevo">{LOANS_TEXT.newLoan}</ButtonLink>
      </header>

      <nav
        aria-label={LOANS_TEXT.filters.label}
        className="flex flex-wrap gap-2"
      >
        <FilterPillLink href="/prestamos" selected={status === null}>
          {LOANS_TEXT.filters.all}
        </FilterPillLink>
        {LOAN_STATUS_FILTERS.map((filter) => (
          <FilterPillLink
            key={filter}
            href={pageHref("/prestamos", 1, { estado: filter })}
            selected={status === filter}
          >
            {LOANS_TEXT.status[filter]}
          </FilterPillLink>
        ))}
      </nav>

      {rows.length === 0 ? (
        <EmptyState
          icon={<StateIcon name={status === null ? "wallet" : "search"} />}
          {...(status === null ? LOANS_TEXT.empty : LOANS_TEXT.emptyFiltered)}
          action={
            status === null ? (
              <ButtonLink href="/prestamos/nuevo">
                {LOANS_TEXT.newLoan}
              </ButtonLink>
            ) : (
              <ButtonLink href="/prestamos" variant="outline">
                {LOANS_TEXT.filters.all}
              </ButtonLink>
            )
          }
        />
      ) : (
        <>
          <LoansTable rows={rows} />
          <PaginationNav
            page={page}
            pages={pages}
            summary={LOANS_TEXT.pagination.summary(page, pages, total)}
            hrefFor={(target) =>
              pageHref("/prestamos", target, { estado: status ?? undefined })
            }
          />
        </>
      )}
    </>
  );
}
