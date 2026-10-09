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

/**
 * Cuotas que ya se pagaron completas, a partir del saldo: `(total − saldo) / valor de la cuota`,
 * redondeado hacia abajo y sin pasar del número de cuotas. La API no entrega este conteo; se
 * deriva de lo pactado y lo pagado (un pago parcial de una cuota no cuenta como cuota pagada).
 */
export function paidInstallments(totalPayable: number, balance: number, installmentValue: number, installmentCount: number): number {
  if (installmentValue <= 0) return 0;
  const paid = Math.max(0, totalPayable - balance);
  return Math.min(installmentCount, Math.floor(paid / installmentValue));
}

/**
 * La asignación que cobra hoy: la vigente (`effectiveFrom ≤ hoy` y sin fin o con fin ≥ hoy). Si
 * hay un reemplazo de un solo día y una permanente, gana el reemplazo (es la más específica); entre
 * dos del mismo tipo, la que empezó más tarde. `null` si nadie cobra hoy.
 */
export function currentAssignment<T extends { effectiveFrom: string; effectiveTo: string | null }>(
  assignments: readonly T[],
  today: string,
): T | null {
  const active = assignments.filter(
    (assignment) => assignment.effectiveFrom <= today && (assignment.effectiveTo === null || assignment.effectiveTo >= today),
  );
  const rank = (assignment: T) => (assignment.effectiveTo === null ? 0 : 1);
  active.sort((a, b) => rank(b) - rank(a) || b.effectiveFrom.localeCompare(a.effectiveFrom));
  return active[0] ?? null;
}
