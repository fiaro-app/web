import { Select } from '@/components/atoms/Select';
import { FormField } from '@/components/molecules/FormField';

export interface FilterSelectFieldProps {
  readonly name: string;
  readonly label: string;
  readonly defaultValue: string;
  /** Texto de la opción vacía ("Todos los cobradores"). */
  readonly allLabel: string;
  readonly options: readonly { readonly value: string; readonly label: string }[];
}

/** Selector de un filtro de listado (formulario GET): una opción vacía de «todos» y las demás. Solo presentación. */
export function FilterSelectField({ name, label, defaultValue, allLabel, options }: Readonly<FilterSelectFieldProps>) {
  return (
    <div className="w-56">
      <FormField label={label}>
        <Select name={name} defaultValue={defaultValue}>
          <option value="">{allLabel}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormField>
    </div>
  );
}
