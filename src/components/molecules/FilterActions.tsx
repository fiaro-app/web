import { ButtonLink } from '@/components/atoms/ButtonLink';
import { FilterSubmitButton } from '@/components/molecules/FilterSubmitButton';

export interface FilterActionsProps {
  readonly applyLabel: string;
  readonly clearLabel: string;
  /** Dónde lleva «Limpiar»: la misma pantalla sin filtros. */
  readonly clearHref: string;
  /** Solo se ofrece «Limpiar» si hay algún filtro puesto. */
  readonly isFiltered: boolean;
}

/** Botones «Aplicar» (sólido: es la acción principal y siempre se puede pulsar) y «Limpiar» de un filtro de listado (formulario GET). Solo presentación. */
export function FilterActions({ applyLabel, clearLabel, clearHref, isFiltered }: Readonly<FilterActionsProps>) {
  return (
    <div className="flex gap-3">
      <FilterSubmitButton size="sm" className="h-11">
        {applyLabel}
      </FilterSubmitButton>
      {isFiltered && (
        <ButtonLink href={clearHref} variant="text" size="sm" className="h-11">
          {clearLabel}
        </ButtonLink>
      )}
    </div>
  );
}
