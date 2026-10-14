import { LoanStatusSchema, type LoanStatus } from '@fiaro-app/contracts';

/** Estados que se pueden pedir con `?estado=`, en el orden en que se muestran las píldoras. */
export const LOAN_STATUS_FILTERS: readonly LoanStatus[] = ['ACTIVE', 'PAID_OFF', 'CANCELED'];

/** Estado pedido en `?estado=`; cualquier valor que no sea un estado conocido es "todos" (`null`). */
export function parseStatusParam(value: string | string[] | undefined): LoanStatus | null {
  const parsed = LoanStatusSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}
