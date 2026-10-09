import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Text } from '@/components/atoms/Text';
import { EmptyState } from '@/components/molecules/EmptyState';
import { CollectorsTable } from '@/components/organisms/CollectorsTable';
import { COLLECTORS_TEXT } from '@/content/collectors';
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
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Text variant="title" as="h1" weight="bold" className="text-foreground">
          {COLLECTORS_TEXT.title}
        </Text>
        <ButtonLink href="/cobradores/nuevo">{COLLECTORS_TEXT.newCollector}</ButtonLink>
      </header>

      {rows.length === 0 ? (
        <EmptyState
          className="max-w-md"
          icon="◔"
          title={COLLECTORS_TEXT.empty.title}
          description={COLLECTORS_TEXT.empty.description}
        />
      ) : (
        <>
          <CollectorsTable rows={rows} />
          <nav aria-label="Paginación" className="flex flex-wrap items-center justify-between gap-3 text-label text-foreground/70">
            <span>{COLLECTORS_TEXT.pagination.summary(page, pages, total)}</span>
            <span className="flex gap-3">
              {page > 1 && (
                <ButtonLink variant="outline" size="sm" href={`/cobradores?pagina=${String(page - 1)}`}>
                  {COLLECTORS_TEXT.pagination.previous}
                </ButtonLink>
              )}
              {page < pages && (
                <ButtonLink variant="outline" size="sm" href={`/cobradores?pagina=${String(page + 1)}`}>
                  {COLLECTORS_TEXT.pagination.next}
                </ButtonLink>
              )}
            </span>
          </nav>
        </>
      )}
    </>
  );
}
