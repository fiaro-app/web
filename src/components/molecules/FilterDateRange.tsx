import { Input } from '@/components/atoms/Input';
import { FormField } from '@/components/molecules/FormField';

export interface FilterDateRangeProps {
  readonly from: string;
  readonly to: string;
  readonly fromLabel: string;
  readonly toLabel: string;
}

/** Par de fechas «desde / hasta» de un filtro de listado (formulario GET, `?desde=&hasta=`). Solo presentación. */
export function FilterDateRange({ from, to, fromLabel, toLabel }: Readonly<FilterDateRangeProps>) {
  return (
    <>
      <div className="w-44">
        <FormField label={fromLabel}>
          <Input name="desde" type="date" defaultValue={from} />
        </FormField>
      </div>
      <div className="w-44">
        <FormField label={toLabel}>
          <Input name="hasta" type="date" defaultValue={to} />
        </FormField>
      </div>
    </>
  );
}
