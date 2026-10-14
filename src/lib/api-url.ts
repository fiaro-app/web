/** Origen de la API en desarrollo (`pnpm dev` de `api`). */
export const DEFAULT_API_URL = 'http://localhost:3000';

/**
 * Origen (`https://host:puerto`, sin ruta) de la API a partir de la variable `API_URL`.
 * Lo usan `next.config.ts` (para los `rewrites`) y los componentes de servidor (para llamarla directo).
 *
 * @throws Si `API_URL` no es una URL válida: mejor fallar al arrancar que reenviar a ninguna parte.
 */
export function resolveApiUrl(value: string | undefined = process.env.API_URL): string {
  // Vacío cuenta como «sin configurar» (p. ej. `API_URL=` en el .env).
  return new URL(value === undefined || value === '' ? DEFAULT_API_URL : value).origin;
}
