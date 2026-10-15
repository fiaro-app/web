'use client';

import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { Link } from '@/components/atoms/Link';

const KEY_PREFIX = 'fiaro:list:';

/** `sessionStorage` solo cambia con `RememberList` en otra página, así que aquí nunca hay nada a qué suscribirse. */
const subscribeNever = () => () => undefined;

/** @returns La dirección guardada para esa lista, o `null` si no hay o no es de esa lista. */
function readSaved(href: string): string | null {
  try {
    const saved = sessionStorage.getItem(KEY_PREFIX + href);
    return saved?.startsWith(href) ? saved : null;
  } catch {
    return null;
  }
}

/**
 * Recuerda la dirección completa de una lista (con sus filtros y su página) mientras la persona
 * la mira, para que el enlace «Volver» de un detalle regrese exactamente ahí. No dibuja nada.
 *
 * @param path - La ruta de la lista sin filtros (`/prestamos`); es también la clave.
 */
export function RememberList({ path }: Readonly<{ path: string }>) {
  useEffect(() => {
    try {
      sessionStorage.setItem(KEY_PREFIX + path, globalThis.location.pathname + globalThis.location.search);
    } catch {
      // sin sessionStorage (modo privado): «Volver» lleva a la lista sin filtros
    }
  });
  return null;
}

/**
 * Enlace «Volver» de un detalle: lleva a la lista tal como la persona la dejó (filtros y página
 * incluidos, si pasó por ella en esta pestaña) y, si no, a `href`.
 *
 * @param href - La lista sin filtros; sirve de destino si no hay nada recordado.
 */
export function BackLink({ href, children }: Readonly<{ href: string; children: ReactNode }>) {
  const saved = useSyncExternalStore(
    subscribeNever,
    () => readSaved(href),
    () => null,
  );
  return <Link href={saved ?? href}>{children}</Link>;
}
