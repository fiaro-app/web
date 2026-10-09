/** Un color que el negocio puede elegir como suyo. */
export interface BrandSwatch {
  readonly value: string;
  readonly label: string;
}

/** El color de Fiaro: el de quien no personaliza (se guarda como «sin color»). */
export const DEFAULT_BRAND_COLOR = '#3B3382';

/**
 * Gama de colores de marca que se ofrece: pocos y sobrios, todos con contraste suficiente para el
 * texto blanco de los botones. Así cada negocio se reconoce en su panel sin que se pierda la identidad de Fiaro.
 */
export const BRAND_PALETTE: readonly BrandSwatch[] = [
  { value: DEFAULT_BRAND_COLOR, label: 'Índigo Fiaro' },
  { value: '#1D4ED8', label: 'Azul' },
  { value: '#0F766E', label: 'Verde azulado' },
  { value: '#B45309', label: 'Cobre' },
  { value: '#9F1239', label: 'Vino' },
  { value: '#1C1B2E', label: 'Negro' },
];

/** ¿Es este color uno de la gama (sin importar mayúsculas)? */
export function isPaletteColor(hex: string): boolean {
  return BRAND_PALETTE.some((swatch) => swatch.value.toUpperCase() === hex.toUpperCase());
}

/**
 * La gama que se muestra: la de siempre y, si el negocio guardó antes un color que ya no está en la
 * gama, ese color como «Color actual» para no perderlo ni cambiarlo sin que la persona lo decida.
 */
export function swatchesFor(current: string | null, currentLabel: string): readonly BrandSwatch[] {
  if (current === null || isPaletteColor(current)) return BRAND_PALETTE;
  return [...BRAND_PALETTE, { value: current.toUpperCase(), label: currentLabel }];
}
