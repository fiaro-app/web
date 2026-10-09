const BUSINESS_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Una fecha de calendario del contrato (`2026-09-22`, sin hora ni zona) como se escribe en
 * Colombia (`22/09/2026`). Se arma con el texto, sin pasar por `Date`, para que una zona horaria
 * no corra el día. Devuelve el texto tal cual si no tiene ese formato.
 */
export function formatBusinessDate(value: string): string {
  const match = BUSINESS_DATE.exec(value);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
}

const BUSINESS_TIME_ZONE = 'America/Bogota';

/**
 * El día de calendario de un instante (`2026-10-09`) según el reloj de Colombia, que es el del
 * negocio: con UTC o la zona del navegador, a las 9 pm el día ya habría cambiado.
 */
export function businessDateOf(instant: Date): string {
  // `en-CA` formatea como `AAAA-MM-DD`.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BUSINESS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(instant);
}
