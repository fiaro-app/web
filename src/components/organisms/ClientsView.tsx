import { StateIcon } from '@/components/atoms/StateIcon';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Text } from '@/components/atoms/Text';
import { EmptyState } from '@/components/molecules/EmptyState';
import { FilterForm } from '@/components/molecules/FilterForm';
import { FilterSubmitButton } from '@/components/molecules/FilterSubmitButton';
import { PaginationNav } from '@/components/molecules/PaginationNav';
import { SearchInput } from '@/components/molecules/SearchInput';
import { ClientsTable } from '@/components/organisms/ClientsTable';
import { CLIENTS_TEXT } from '@/content/clients';
import type { ClientsViewModel } from '@/features/clients/clients-view-model';
import { pageHref } from '@/lib/pagination';

export interface ClientsViewProps {
  readonly clients: ClientsViewModel;
  /** Puede registrar y editar clientes (Owner o Lender). */
  readonly canManage?: boolean;
}

interface ClientsEmptyStateProps {
  readonly search: string;
  readonly canManage: boolean;
}

/** Estado vacío: sin resultados para la búsqueda o cartera sin clientes (con acción de registrar si puede). */
function ClientsEmptyState({ search, canManage }: Readonly<ClientsEmptyStateProps>) {
  if (search !== '') {
    return (
      <EmptyState
        icon={<StateIcon name="search" />}
        {...CLIENTS_TEXT.noResults(search)}
        action={
          <ButtonLink href="/clientes" variant="outline">
            {CLIENTS_TEXT.search.clear}
          </ButtonLink>
        }
      />
    );
  }

  return (
    <EmptyState
      icon={<StateIcon name="user-plus" />}
      {...CLIENTS_TEXT.empty}
      action={canManage ? <ButtonLink href="/clientes/nuevo">{CLIENTS_TEXT.form.createTitle}</ButtonLink> : undefined}
    />
  );
}

/**
 * Clientes: título, acción de registrar, búsqueda y tabla. La búsqueda es un formulario GET
 * (`?q=`): funciona sin JavaScript y la URL queda compartible. Solo presentación.
 */
export function ClientsView({ clients, canManage = true }: Readonly<ClientsViewProps>) {
  const { rows, total, page, pageSize, search } = clients;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const hasSearch = search !== '';

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3 max-sm:flex-col max-sm:items-stretch max-sm:[&>a]:w-full">
        <Text variant="title" as="h1" weight="bold" className="text-foreground">
          {CLIENTS_TEXT.title}
        </Text>
        {canManage && <ButtonLink href="/clientes/nuevo">{CLIENTS_TEXT.newClient}</ButtonLink>}
      </header>

      <FilterForm action="/clientes" role="search" className="flex max-w-xl gap-3">
        <SearchInput name="q" defaultValue={search} placeholder={CLIENTS_TEXT.search.placeholder} className="flex-1" />
        <FilterSubmitButton size="sm" className="h-11">
          {CLIENTS_TEXT.search.submit}
        </FilterSubmitButton>
        {hasSearch && (
          <ButtonLink href="/clientes" variant="text" size="sm" className="h-11">
            {CLIENTS_TEXT.search.clear}
          </ButtonLink>
        )}
      </FilterForm>

      {rows.length === 0 ? (
        <ClientsEmptyState search={search} canManage={canManage} />
      ) : (
        <>
          <ClientsTable rows={rows} canManage={canManage} />
          <PaginationNav
            page={page}
            pages={pages}
            summary={CLIENTS_TEXT.pagination.summary(page, pages, total)}
            hrefFor={(target) => pageHref('/clientes', target, { q: search })}
          />
        </>
      )}
    </>
  );
}
