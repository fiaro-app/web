/** Tipos de imagen que acepta la API para la foto de un cliente o un comprobante. */
export const IMAGE_CONTENT_TYPES = ['image/png', 'image/jpeg'] as const;

/** Tamaño máximo: 5 MB. */
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;

/** Revisa un archivo antes de subirlo. Devuelve el mensaje para la persona, o `null` si sirve. */
export function validateImageFile(file: { readonly type: string; readonly size: number }): string | null {
  if (!(IMAGE_CONTENT_TYPES as readonly string[]).includes(file.type)) return 'La imagen debe ser PNG o JPG.';
  if (file.size > IMAGE_MAX_BYTES) return 'La imagen pesa más de 5 MB. Elige una más liviana.';
  if (file.size === 0) return 'El archivo está vacío.';
  return null;
}
