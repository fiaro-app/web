import { toBusinessDate } from '@fiaro-app/contracts';

/**
 * Lo pactado en total que sugiere la app: cuotas × valor de la cuota. El prestamista puede
 * cambiarlo (la API respeta lo acordado); `null` mientras falte alguno de los dos datos.
 */
export function suggestTotalPayable(installmentCount: number | null, installmentValue: number | null): number | null {
  if (installmentCount === null || installmentValue === null) return null;
  if (installmentCount < 1 || installmentValue < 1) return null;
  return installmentCount * installmentValue;
}

/** Fecha de hoy en Colombia (`2026-10-09`), la que usa el negocio. */
export function todayBusinessDate(now: Date = new Date()): string {
  return toBusinessDate(now);
}
