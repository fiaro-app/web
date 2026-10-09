import { loanEndpoints } from '@/features/loans/endpoints';
import type { LoanValues } from '@/features/loans/loan-schemas';
import { callEndpoint } from '@/lib/api';

/** Da de alta un préstamo. */
export function createLoan(values: LoanValues) {
  return callEndpoint(loanEndpoints.create, { body: values });
}

/** Anula un préstamo activo que todavía no recibió pagos. */
export function cancelLoan(id: string) {
  return callEndpoint(loanEndpoints.cancel, { params: { id } });
}
