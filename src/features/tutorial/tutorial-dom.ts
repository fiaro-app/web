/** Elemento visible que cumple el selector CSS: el menú existe dos veces (escritorio y móvil) y solo una se ve. */
export function findVisible(selector: string): HTMLElement | null {
  let candidates: NodeListOf<HTMLElement>;
  try {
    candidates = document.querySelectorAll<HTMLElement>(selector);
  } catch {
    return null;
  }
  return [...candidates].find((element) => element.getClientRects().length > 0) ?? null;
}
