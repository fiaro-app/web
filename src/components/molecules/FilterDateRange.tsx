import { DatePicker } from '@/components/molecules/DatePicker';
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
          <DatePicker name="desde" defaultValue={from} />
        </FormField>
      </div>
      <div className="w-44">
        <FormField label={toLabel}>
          <DatePicker name="hasta" defaultValue={to} />
        </FormField>
      </div>
    </>
  );
}
