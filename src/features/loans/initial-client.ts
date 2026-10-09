import { IdSchema } from '@fiaro-app/contracts';

/**
 * Cliente preseleccionado al registrar un préstamo (`?cliente=` en la URL). Solo vale un UUID: un
 * valor raro se descarta y el formulario arranca sin cliente.
 */
export function parseInitialClient(value: string | string[] | undefined): string {
  const parsed = IdSchema.safeParse(value);
  return parsed.success ? parsed.data : '';
}
