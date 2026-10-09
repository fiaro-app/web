'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signOut } from '@/features/auth/auth-api';
import { LOGIN_PATH } from '@/features/auth/route-guard';

/**
 * Lógica de cerrar sesión, sin diseño: llama a la API y, pase lo que pase con la llamada, lleva a
 * la pantalla de inicio de sesión. Si la API no responde, la cookie puede seguir viva, pero el
 * `proxy` y `getCurrentUser` la validan de nuevo en cada visita, y la sesión vence sola.
 */
export function useSignOut() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const run = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
    } catch {
      // Se sigue a login igualmente: no se deja a nadie "atrapado" por una falla de red.
    }
    router.replace(LOGIN_PATH);
    router.refresh();
  };

  return { isSigningOut, signOut: run };
}
