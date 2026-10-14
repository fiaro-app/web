import 'server-only';
import type { CollectorOption } from '@/features/loans/get-loan.server';
import { getSettlementLookup } from '@/features/settlements/get-settlement-lookup.server';

/** Cobradores a los que se puede asignar un préstamo (los del negocio, con su nombre). */
export async function getCollectorOptions(): Promise<readonly CollectorOption[]> {
  const lookup = await getSettlementLookup();
  return [...lookup.collectorNames].map(([id, name]) => ({ id, name }));
}
