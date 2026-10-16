import { LOAN_REQUEST_STATUSES, type LoanRequestStatus } from '@/features/loan-requests/endpoints';

/** Valor de `?estado=` que pide todos los estados: sin `?estado=` se ven solo las pendientes. */
export const ALL_LOAN_REQUESTS_PARAM = 'TODOS';

/** Estado con que abre «Solicitudes»: lo que hay que resolver. */
export const DEFAULT_LOAN_REQUEST_STATUS: LoanRequestStatus = 'PENDING';

/**
 * Estado pedido en `?estado=`. Sin el parámetro (o con uno desconocido) son las pendientes;
 * `?estado=TODOS` son todas (`null`).
 */
export function parseLoanRequestStatusParam(value: string | string[] | undefined): LoanRequestStatus | null {
  if (value === ALL_LOAN_REQUESTS_PARAM) return null;
  return LOAN_REQUEST_STATUSES.find((status) => status === value) ?? DEFAULT_LOAN_REQUEST_STATUS;
}

/** Lo que va en `?estado=` para un estado elegido (`null` son todos). */
export function loanRequestStatusParam(status: LoanRequestStatus | null): string {
  return status ?? ALL_LOAN_REQUESTS_PARAM;
}
