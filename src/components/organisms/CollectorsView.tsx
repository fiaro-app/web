import { StateIcon } from '@/components/atoms/StateIcon';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Text } from '@/components/atoms/Text';
import { EmptyState } from '@/components/molecules/EmptyState';
import { PaginationNav } from '@/components/molecules/PaginationNav';
import { CollectorsTable } from '@/components/organisms/CollectorsTable';
import { COLLECTORS_TEXT } from '@/content/collectors';
import { pageHref } from '@/lib/pagination';
import type { CollectorsViewModel } from '@/features/collectors/collectors-view-model';

export interface CollectorsViewProps {
  readonly collectors: CollectorsViewModel;
}

/** Cobradores (`Screen / Web / Cobradores`): título, acción de registrar y la tabla. Solo presentación. */
export function CollectorsView({ collectors }: Readonly<CollectorsViewProps>) {
  const { rows, total, page, pageSize } = collectors;
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3 max-sm:flex-col max-sm:items-stretch max-sm:[&>a]:w-full">
        <Text variant="title" as="h1" weight="bold" className="text-foreground">
          {COLLECTORS_TEXT.title}
        </Text>
        <ButtonLink href="/cobradores/nuevo">{COLLECTORS_TEXT.newCollector}</ButtonLink>
      </header>

      {rows.length === 0 ? (
        <EmptyState
          icon={<StateIcon name="users" />}
          title={COLLECTORS_TEXT.empty.title}
          description={COLLECTORS_TEXT.empty.description}
          action={<ButtonLink href="/cobradores/nuevo">{COLLECTORS_TEXT.form.submit}</ButtonLink>}
        />
      ) : (
        <>
          <CollectorsTable rows={rows} />
          <PaginationNav
            page={page}
            pages={pages}
            summary={COLLECTORS_TEXT.pagination.summary(page, pages, total)}
            hrefFor={(target) => pageHref('/cobradores', target)}
            previousLabel={COLLECTORS_TEXT.pagination.previous}
            nextLabel={COLLECTORS_TEXT.pagination.next}
          />
        </>
      )}
    </>
  );
}
