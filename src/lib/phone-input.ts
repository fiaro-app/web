/** Dígitos de un teléfono colombiano sin el indicativo: celular (3…) o fijo (60…). */
const NATIONAL_DIGITS = 10;

/**
 * Da formato de lectura (`321 895 7375`) a lo que se va escribiendo en un campo de teléfono: deja
 * solo dígitos, quita un `57` pegado al inicio (`+57 321…`) y no deja pasar de 10. No valida: un
 * número incompleto queda a medias y lo rechaza el esquema del formulario (`toColombianE164`).
 *
 * @param input - Lo que hay en el campo.
 */
export function formatPhoneInput(input: string): string {
  let digits = input.replaceAll(/\D/g, '');
  if (digits.length > NATIONAL_DIGITS && digits.startsWith('57')) digits = digits.slice(2);
  digits = digits.slice(0, NATIONAL_DIGITS);
  return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6)].filter(Boolean).join(' ');
}

/** El valor que guarda un formulario para un campo: el teléfono con formato, lo demás tal cual. */
export function fieldInput(field: string, value: string): string {
  return field === 'phone' ? formatPhoneInput(value) : value;
}
