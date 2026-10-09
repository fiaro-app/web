import { contractMessage } from '@fiaro-app/contracts';
import type { z } from 'zod';

/** Errores por campo de un formulario: el nombre del campo y el mensaje que se le muestra. */
export type FieldErrors<TField extends string = string> = Partial<Record<TField, string>>;

/**
 * Pasa los errores de un schema de Zod a un mensaje por campo (el primero de cada uno). Los
 * mensajes que escriben los schemas del contrato son claves (`contracts.phone.invalid_mobile`);
 * `contractMessage` las traduce y deja pasar tal cual el texto que ya está escrito en español.
 */
export function toFieldErrors<TField extends string>(error: z.ZodError): FieldErrors<TField> {
  const errors: Partial<Record<string, string>> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === 'string' && errors[field] === undefined) {
      errors[field] = contractMessage('es', issue.message);
    }
  }
  return errors as FieldErrors<TField>;
}
