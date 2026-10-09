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
