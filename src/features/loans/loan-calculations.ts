const BUSINESS_TIME_ZONE = 'America/Bogota';

/**
 * Lo pactado en total que sugiere la app: cuotas × valor de la cuota. El prestamista puede
 * cambiarlo (la API respeta lo acordado); `null` mientras falte alguno de los dos datos.
 */
export function suggestTotalPayable(installmentCount: number | null, installmentValue: number | null): number | null {
  if (installmentCount === null || installmentValue === null) return null;
  if (installmentCount < 1 || installmentValue < 1) return null;
  return installmentCount * installmentValue;
}

/**
 * Fecha de hoy en Colombia (`2026-10-09`), que es la que usa el negocio: con la zona del
 * navegador, a las 8 pm el día ya habría cambiado para quien esté en otra zona.
 */
export function todayBusinessDate(now: Date = new Date()): string {
  // `en-CA` formatea como `AAAA-MM-DD`.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BUSINESS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}
