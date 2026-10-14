/** Versión del tutorial: al cambiar mucho su contenido se sube y se vuelve a ofrecer. */
const VERSION = 1;

/** Evento con el que cualquier parte de la web pide empezar el tutorial («Ver el tutorial» en Mi cuenta). */
export const START_TUTORIAL_EVENT = 'fiaro:start-tutorial';

/** Evento con el que se pide la guía de la pantalla actual («Guía de esta pantalla» en el menú). */
export const START_PAGE_GUIDE_EVENT = 'fiaro:start-page-guide';

function keyFor(userId: string): string {
  return `fiaro:tutorial:v${String(VERSION)}:${userId}`;
}

/**
 * ¿Esta persona ya vio u omitió el tutorial en este navegador? Se guarda en `localStorage`: sin API para
 * preferencias, es lo que hay. Si el almacenamiento no está disponible (modo privado, bloqueado) se
 * responde «ya lo vio» para no insistir en cada visita.
 */
export function hasSeenTutorial(userId: string, storage: Pick<Storage, 'getItem'> | null = safeStorage()): boolean {
  if (storage === null) return true;
  try {
    return storage.getItem(keyFor(userId)) !== null;
  } catch {
    return true;
  }
}

/** Recuerda que esta persona ya decidió sobre el tutorial (lo hizo o lo omitió). */
export function markTutorialSeen(userId: string, storage: Pick<Storage, 'setItem'> | null = safeStorage()): void {
  try {
    storage?.setItem(keyFor(userId), new Date().toISOString());
  } catch {
    // Sin almacenamiento no se puede recordar: el tutorial no vuelve a molestar en esta sesión.
  }
}

function safeStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : globalThis.localStorage;
  } catch {
    return null;
  }
}
