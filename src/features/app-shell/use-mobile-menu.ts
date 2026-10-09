'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

/**
 * Estado del menú lateral deslizable del panel en pantallas angostas. Se cierra al cambiar de
 * ruta (se eligió una opción), con Escape y bloquea el desplazamiento de la página mientras está
 * abierto. Solo lógica: el diseño vive en `MobileNav`.
 */
export function useMobileMenu() {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  // Está abierto solo en la ruta donde se abrió: al navegar deja de coincidir y se cierra solo.
  const isOpen = openPath !== null && openPath === pathname;

  const open = useCallback(() => setOpenPath(pathname), [pathname]);
  const close = useCallback(() => setOpenPath(null), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, close]);

  return { isOpen, open, close };
}
