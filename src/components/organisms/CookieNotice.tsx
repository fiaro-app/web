'use client';

import NextLink from 'next/link';
import { useSyncExternalStore } from 'react';
import { Button } from '@/components/atoms/Button';
import { COOKIE_NOTICE, COOKIES } from '@/content/legal';

const STORAGE_KEY = 'fiaro-cookie-notice';
const listeners = new Set<() => void>();

function read(): boolean {
  try {
    return globalThis.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Aviso de cookies: solo informa (Fiaro usa únicamente las necesarias, así que no hay nada que aceptar o rechazar). Se muestra
 * hasta que la persona lo cierra y lo recuerda en este navegador. Sin almacenamiento disponible, vuelve a aparecer: es inofensivo.
 */
export function CookieNotice() {
  const dismissed = useSyncExternalStore(subscribe, read, () => true);
  if (dismissed) return null;
  const dismiss = () => {
    try {
      globalThis.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Sin almacenamiento solo se pierde el recuerdo.
    }
    for (const listener of listeners) listener();
  };
  return (
    <div role="region" aria-label="Aviso de cookies" className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-2xl flex-col gap-3 rounded-lg bg-foreground p-4 text-background shadow-lg sm:flex-row sm:items-center">
      <p className="flex-1 text-label">
        {COOKIE_NOTICE.text}{' '}
        <NextLink href={COOKIES.path} className="font-semibold underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
          {COOKIE_NOTICE.link}
        </NextLink>
      </p>
      <Button size="sm" onClick={dismiss}>
        {COOKIE_NOTICE.accept}
      </Button>
    </div>
  );
}
