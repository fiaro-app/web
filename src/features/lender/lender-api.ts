import type { Weekday } from '@fiaro-app/contracts';
import { lenderEndpoints } from '@/features/lender/endpoints';
import { callEndpoint } from '@/lib/api';

/** Cambia el nombre del negocio. */
export function updateBusinessName(name: string) {
  return callEndpoint(lenderEndpoints.update, { body: { name } });
}

/** Cambia los días sin cobro y si los festivos nacionales cuentan. */
export function updateCollectionDays(nonWorkingWeekdays: readonly Weekday[], skipNationalHolidays: boolean) {
  return callEndpoint(lenderEndpoints.update, { body: { nonWorkingWeekdays: [...nonWorkingWeekdays], skipNationalHolidays } });
}

/** Crea una cartera nueva. */
export function createPortfolio(name: string) {
  return callEndpoint(lenderEndpoints.createPortfolio, { body: { name } });
}
