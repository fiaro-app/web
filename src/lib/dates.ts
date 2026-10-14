import { toBusinessDate } from '@fiaro-app/contracts';

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

/**
 * El día en que ocurrió un instante (`2026-10-09T02:00:00Z`) escrito como se lee en Colombia
 * (`08/10/2026`). El día se toma con `toBusinessDate` del contrato (hora de Bogotá): con UTC o la
 * zona del navegador, a las 9 pm el día ya habría cambiado.
 */
export function formatInstantDate(instant: string): string {
  return formatBusinessDate(toBusinessDate(new Date(instant)));
}

const TIME_FORMAT = new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit', hour12: true });

/** La hora a la que ocurrió un instante, como se lee en Colombia (`3:05 p. m.`). */
export function formatInstantTime(instant: string): string {
  return TIME_FORMAT.format(new Date(instant));
}
