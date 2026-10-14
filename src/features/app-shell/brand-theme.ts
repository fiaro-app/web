import type { CSSProperties } from 'react';
import { contrastWithWhite, darken, MIN_BRAND_CONTRAST } from '@/lib/color';

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

/**
 * Variables CSS que tiñen el panel con el color de marca del negocio (`--primary`, su hover y el
 * anillo de foco), o `undefined` si no hay color o no sirve: ni un `#RRGGBB` válido ni con contraste
 * suficiente para el texto blanco (el panel se queda con el color de Fiaro en vez de volverse ilegible).
 * Se aplican en el servidor sobre el contenedor del panel, así no hay parpadeo de color al cargar.
 */
export function brandThemeStyle(brandColor: string | null): CSSProperties | undefined {
  if (brandColor === null || !HEX_COLOR.test(brandColor) || contrastWithWhite(brandColor) < MIN_BRAND_CONTRAST) return undefined;
  return { '--primary': brandColor, '--primary-hover': darken(brandColor, 0.1), '--ring': brandColor } as CSSProperties;
}
