import { settlementEndpoints } from '@/features/settlements/endpoints';
import { callEndpoint } from '@/lib/api';

/** Cuerpo de una revisión: el comentario vacío se omite, no se manda como texto vacío. */
function reviewBody(reviewNote: string) {
  const note = reviewNote.trim();
  return note === '' ? {} : { reviewNote: note };
}

/** Aprueba un cuadre pendiente, con un comentario opcional. */
export function approveSettlement(id: string, reviewNote: string) {
  return callEndpoint(settlementEndpoints.approve, { params: { id }, body: reviewBody(reviewNote) });
}

/** Rechaza un cuadre pendiente, con un comentario opcional. */
export function rejectSettlement(id: string, reviewNote: string) {
  return callEndpoint(settlementEndpoints.reject, { params: { id }, body: reviewBody(reviewNote) });
}
