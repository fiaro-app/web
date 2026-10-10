/** Un rectángulo en píxeles de la ventana. */
export interface Box {
  readonly top: number;
  readonly left: number;
  readonly width: number;
  readonly height: number;
}

export interface Size {
  readonly width: number;
  readonly height: number;
}

/** Margen que se deja a la vista alrededor del elemento señalado. */
export const SPOTLIGHT_PADDING = 6;
/** Separación entre el elemento señalado y la tarjeta que lo explica. */
export const CARD_GAP = 16;
const VIEWPORT_MARGIN = 16;

/** El rectángulo del elemento con un margen alrededor, sin salirse de la ventana. */
export function padBox(box: Box, viewport: Size, padding: number = SPOTLIGHT_PADDING): Box {
  const top = Math.max(0, box.top - padding);
  const left = Math.max(0, box.left - padding);
  const bottom = Math.min(viewport.height, box.top + box.height + padding);
  const right = Math.min(viewport.width, box.left + box.width + padding);
  return { top, left, width: right - left, height: bottom - top };
}

/** Las cuatro franjas que cubren la ventana salvo el hueco: arriba, abajo, izquierda y derecha. */
export function maskPanels(hole: Box, viewport: Size): readonly Box[] {
  const bottom = hole.top + hole.height;
  const right = hole.left + hole.width;
  return [
    { top: 0, left: 0, width: viewport.width, height: hole.top },
    { top: bottom, left: 0, width: viewport.width, height: Math.max(0, viewport.height - bottom) },
    { top: hole.top, left: 0, width: hole.left, height: hole.height },
    { top: hole.top, left: right, width: Math.max(0, viewport.width - right), height: hole.height },
  ];
}

/**
 * Dónde poner la tarjeta: a la derecha del elemento si cabe (el menú está a la izquierda), si no debajo, si
 * no encima; sin elemento, centrada. Siempre dentro de la ventana.
 */
export function cardPosition(target: Box | null, card: Size, viewport: Size): { readonly top: number; readonly left: number } {
  const clamp = (value: number, size: number, limit: number) => Math.min(Math.max(value, VIEWPORT_MARGIN), Math.max(VIEWPORT_MARGIN, limit - size - VIEWPORT_MARGIN));
  if (target === null) {
    return { top: clamp((viewport.height - card.height) / 2, card.height, viewport.height), left: clamp((viewport.width - card.width) / 2, card.width, viewport.width) };
  }
  const right = target.left + target.width + CARD_GAP;
  if (right + card.width + VIEWPORT_MARGIN <= viewport.width) {
    return { top: clamp(target.top + target.height / 2 - card.height / 2, card.height, viewport.height), left: right };
  }
  const below = target.top + target.height + CARD_GAP;
  if (below + card.height + VIEWPORT_MARGIN <= viewport.height) {
    return { top: below, left: clamp(target.left, card.width, viewport.width) };
  }
  return { top: clamp(target.top - CARD_GAP - card.height, card.height, viewport.height), left: clamp(target.left, card.width, viewport.width) };
}
