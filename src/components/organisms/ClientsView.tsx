import { Button } from '@/components/atoms/Button';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Text } from '@/components/atoms/Text';
import { EmptyState } from '@/components/molecules/EmptyState';
import { PaginationNav } from '@/components/molecules/PaginationNav';
import { SearchInput } from '@/components/molecules/SearchInput';
import { ClientsTable } from '@/components/organisms/ClientsTable';
import { CLIENTS_TEXT } from '@/content/clients';
import type { ClientsViewModel } from '@/features/clients/clients-view-model';
import { pageHref } from '@/lib/pagination';

export interface ClientsViewProps {
  readonly clients: ClientsViewModel;
}

/**
 * Clientes: título, acción de registrar, búsqueda y tabla. La búsqueda es un formulario GET
 * (`?q=`): funciona sin JavaScript y la URL queda compartible. Solo presentación.
 */
export function ClientsView({ clients }: Readonly<ClientsViewProps>) {
  const { rows, total, page, pageSize, search } = clients;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const hasSearch = search !== '';

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Text variant="title" as="h1" weight="bold" className="text-foreground">
          {CLIENTS_TEXT.title}
        </Text>
        <ButtonLink href="/clientes/nuevo">{CLIENTS_TEXT.newClient}</ButtonLink>
      </header>

      <form action="/clientes" role="search" className="flex max-w-xl gap-3">
        <SearchInput name="q" defaultValue={search} placeholder={CLIENTS_TEXT.search.placeholder} className="flex-1" />
        <Button type="submit" variant="outline" size="sm" className="h-11">
          {CLIENTS_TEXT.search.submit}
        </Button>
        {hasSearch && (
          <ButtonLink href="/clientes" variant="text" size="sm" className="h-11">
            {CLIENTS_TEXT.search.clear}
          </ButtonLink>
        )}
      </form>

      {rows.length === 0 ? (
        <EmptyState
          className="max-w-md"
          icon="◔"
          {...(hasSearch ? CLIENTS_TEXT.noResults(search) : CLIENTS_TEXT.empty)}
        />
      ) : (
        <>
          <ClientsTable rows={rows} />
          <PaginationNav
            page={page}
            pages={pages}
            summary={CLIENTS_TEXT.pagination.summary(page, pages, total)}
            hrefFor={(target) => pageHref('/clientes', target, search)}
          />
        </>
      )}
    </>
  );
}
