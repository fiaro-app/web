/** Tipos de imagen que acepta la API para el logo. */
export const LOGO_CONTENT_TYPES = ['image/png', 'image/jpeg'] as const;
export type LogoContentType = (typeof LOGO_CONTENT_TYPES)[number];

/** Tamaño máximo del logo: 2 MB. */
export const LOGO_MAX_BYTES = 2 * 1024 * 1024;

/**
 * Revisa un archivo antes de subirlo. Devuelve el mensaje para la persona, o `null` si sirve. El
 * tipo declarado por el navegador no es una garantía (la API solo lo usa para firmar la URL), pero
 * evita subidas obviamente equivocadas.
 */
export function validateLogoFile(file: { readonly type: string; readonly size: number }): string | null {
  if (!(LOGO_CONTENT_TYPES as readonly string[]).includes(file.type)) return 'El logo debe ser una imagen PNG o JPG.';
  if (file.size > LOGO_MAX_BYTES) return 'El logo pesa más de 2 MB. Elige una imagen más liviana.';
  if (file.size === 0) return 'El archivo está vacío.';
  return null;
}
