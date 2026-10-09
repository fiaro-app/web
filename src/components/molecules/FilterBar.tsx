import { FilterPill } from '@/components/atoms/FilterPill';
import { Select } from '@/components/atoms/Select';
import { SearchInput } from '@/components/molecules/SearchInput';
import { cn } from '@/lib/cn';

export interface FilterOption {
  readonly value: string;
  readonly label: string;
}

export interface SelectFilter {
  /** Texto de la opción "sin filtro" y nombre accesible del desplegable (p. ej. "Cobrador"). */
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly options: readonly FilterOption[];
}

export interface FilterBarProps {
  readonly search: {
    readonly value: string;
    readonly onChange: (value: string) => void;
    readonly placeholder?: string;
  };
  readonly pills?: {
    readonly options: readonly FilterOption[];
    readonly value: string;
    readonly onChange: (value: string) => void;
  };
  readonly selects?: readonly SelectFilter[];
  readonly className?: string;
}

/** Barra de filtros de una lista: búsqueda, píldoras de estado y desplegables, todo opcional salvo la búsqueda. */
export function FilterBar({ search, pills, selects, className }: Readonly<FilterBarProps>) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <SearchInput value={search.value} placeholder={search.placeholder} onChange={(event) => search.onChange(event.target.value)} />
      {pills && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Estado">
          {pills.options.map((option) => (
            <FilterPill key={option.value} selected={pills.value === option.value} onClick={() => pills.onChange(option.value)}>
              {option.label}
            </FilterPill>
          ))}
        </div>
      )}
      {selects && selects.length > 0 && (
        <div className="flex gap-2">
          {selects.map((filter) => (
            <Select
              key={filter.label}
              aria-label={filter.label}
              className="flex-1"
              value={filter.value}
              onChange={(event) => filter.onChange(event.target.value)}
            >
              <option value="">{filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          ))}
        </div>
      )}
    </div>
  );
}
