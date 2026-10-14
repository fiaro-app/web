import { toBusinessDate } from '@fiaro-app/contracts';
import { DatePicker } from '@/components/molecules/DatePicker';
import { FormField } from '@/components/molecules/FormField';

export interface FilterDateRangeProps {
  readonly from: string;
  readonly to: string;
  readonly fromLabel: string;
  readonly toLabel: string;
  /** Si se pueden elegir días posteriores a hoy. Por defecto no: los filtros son de historial. */
  readonly allowFuture?: boolean;
}

/** Par de fechas «desde / hasta» de un filtro de listado (formulario GET, `?desde=&hasta=`). Solo presentación. */
export function FilterDateRange({ from, to, fromLabel, toLabel, allowFuture = false }: Readonly<FilterDateRangeProps>) {
  const max = allowFuture ? undefined : toBusinessDate(new Date());
  return (
    <>
      <div className="w-44">
        <FormField label={fromLabel}>
          <DatePicker name="desde" defaultValue={from} max={max} />
        </FormField>
      </div>
      <div className="w-44">
        <FormField label={toLabel}>
          <DatePicker name="hasta" defaultValue={to} max={max} />
        </FormField>
      </div>
    </>
  );
}
