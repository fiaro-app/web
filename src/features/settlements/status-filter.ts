import { SettlementStatusSchema, type SettlementStatus } from '@fiaro-app/contracts';

/** Estados que se pueden pedir con `?estado=`, en el orden en que se muestran las píldoras. */
export const SETTLEMENT_STATUS_FILTERS: readonly SettlementStatus[] = ['PENDING', 'APPROVED', 'REJECTED'];

/** Estado pedido en `?estado=`; cualquier valor que no sea un estado conocido es "todos" (`null`). */
export function parseSettlementStatusParam(value: string | string[] | undefined): SettlementStatus | null {
  const parsed = SettlementStatusSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}
