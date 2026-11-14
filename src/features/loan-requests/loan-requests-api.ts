import { loanRequestEndpoints, type ApproveLoanRequestBody } from '@/features/loan-requests/endpoints';
import { callEndpoint } from '@/lib/api';

/** Acepta una solicitud, con los ajustes que el administrador haya hecho. */
export function approveLoanRequest(id: string, body: ApproveLoanRequestBody) {
  return callEndpoint(loanRequestEndpoints.approve, { params: { id }, body });
}

/** Rechaza una solicitud; el motivo vacío se omite, no se manda como texto vacío. */
export function rejectLoanRequest(id: string, reason: string) {
  const trimmed = reason.trim();
  return callEndpoint(loanRequestEndpoints.reject, { params: { id }, body: trimmed === '' ? {} : { reason: trimmed } });
}
