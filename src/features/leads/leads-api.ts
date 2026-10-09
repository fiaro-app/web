import { leadEndpoints, type CreateLeadBody } from '@/features/leads/endpoints';
import { callEndpoint } from '@/lib/api';

/** Manda el contacto a ventas. Un campo opcional vacío no se envía. */
export function sendLead(lead: CreateLeadBody) {
  return callEndpoint(leadEndpoints.create, { body: lead });
}
