import { Button } from '@/components/atoms/Button';
import { ButtonLink } from '@/components/atoms/ButtonLink';

export interface FilterActionsProps {
  readonly applyLabel: string;
  readonly clearLabel: string;
  /** Dónde lleva «Limpiar»: la misma pantalla sin filtros. */
  readonly clearHref: string;
  /** Solo se ofrece «Limpiar» si hay algún filtro puesto. */
  readonly isFiltered: boolean;
}

/** Botones «Aplicar» y «Limpiar» de un filtro de listado (formulario GET). Solo presentación. */
export function FilterActions({ applyLabel, clearLabel, clearHref, isFiltered }: Readonly<FilterActionsProps>) {
  return (
    <div className="flex gap-3">
      <Button type="submit" variant="outline" size="sm" className="h-11">
        {applyLabel}
      </Button>
      {isFiltered && (
        <ButtonLink href={clearHref} variant="text" size="sm" className="h-11">
          {clearLabel}
        </ButtonLink>
      )}
    </div>
  );
}
