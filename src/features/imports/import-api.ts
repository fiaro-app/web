import { importEndpoints, type ImportRow } from '@/features/imports/import-endpoints';
import { callEndpoint } from '@/lib/api';

/** Manda una tanda (hasta 200 filas): `dryRun` solo revisa, sin dryRun crea. */
export function runImport(rows: readonly ImportRow[], dryRun: boolean) {
  return callEndpoint(importEndpoints.run, { body: { dryRun, rows: [...rows] } });
}
