import { SettlementStatusSchema, type SettlementStatus } from '@fiaro-app/contracts';

/** Estados que se pueden pedir con `?estado=`, en el orden en que se muestran las píldoras. */
export const SETTLEMENT_STATUS_FILTERS: readonly SettlementStatus[] = ['PENDING', 'APPROVED', 'REJECTED'];

/** Valor de `?estado=` que pide todos los estados: sin `?estado=` se ven solo los pendientes. */
export const ALL_SETTLEMENTS_PARAM = 'TODOS';

/** Estado con que abre «Cuadres»: lo que hay que revisar. */
export const DEFAULT_SETTLEMENT_STATUS: SettlementStatus = 'PENDING';

/**
 * Estado pedido en `?estado=`. Sin el parámetro (o con uno desconocido) son los pendientes, que es lo
 * que hay que revisar; `?estado=TODOS` son todos (`null`).
 */
export function parseSettlementStatusParam(value: string | string[] | undefined): SettlementStatus | null {
  if (value === ALL_SETTLEMENTS_PARAM) return null;
  const parsed = SettlementStatusSchema.safeParse(value);
  return parsed.success ? parsed.data : DEFAULT_SETTLEMENT_STATUS;
}

/** Lo que va en `?estado=` para un estado elegido (`null` son todos). */
export function settlementStatusParam(status: SettlementStatus | null): string {
  return status ?? ALL_SETTLEMENTS_PARAM;
}
