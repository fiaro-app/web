'use client';

import { useEffect, type RefObject } from 'react';

/** Cierra un desplegable al pulsar fuera de su contenedor o la tecla Esc (el foco vuelve al disparador). */
export function useDismiss(open: boolean, containerRef: RefObject<HTMLElement | null>, onClose: () => void): void {
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) onClose();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, containerRef, onClose]);
}
