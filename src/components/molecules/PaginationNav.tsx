import { ButtonLink } from '@/components/atoms/ButtonLink';

export interface PaginationNavProps {
  readonly page: number;
  readonly pages: number;
  /** Texto "Página 1 de 3 · 45 cobradores", ya armado por quien lo usa. */
  readonly summary: string;
  /** Dirección de una página (conserva los filtros activos). */
  readonly hrefFor: (page: number) => string;
  readonly previousLabel?: string;
  readonly nextLabel?: string;
}

/** Navegación entre páginas de un listado: resumen y enlaces "Anterior" / "Siguiente". */
export function PaginationNav({
  page,
  pages,
  summary,
  hrefFor,
  previousLabel = 'Anterior',
  nextLabel = 'Siguiente',
}: Readonly<PaginationNavProps>) {
  return (
    <nav aria-label="Paginación" className="flex flex-wrap items-center justify-between gap-3 text-label text-foreground/70">
      <span>{summary}</span>
      <span className="flex gap-3">
        {page > 1 && (
          <ButtonLink variant="outline" size="sm" href={hrefFor(page - 1)}>
            {previousLabel}
          </ButtonLink>
        )}
        {page < pages && (
          <ButtonLink variant="outline" size="sm" href={hrefFor(page + 1)}>
            {nextLabel}
          </ButtonLink>
        )}
      </span>
    </nav>
  );
}
