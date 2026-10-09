'use client';

import { useSignOut } from '@/features/auth/use-sign-out';

/** "Cerrar sesión" en rojo, como en el perfil de la barra lateral. Solo diseño: la lógica vive en `useSignOut`. */
export function SignOutButton() {
  const { isSigningOut, signOut } = useSignOut();

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={isSigningOut}
      className="self-start rounded-sm text-small font-semibold text-destructive hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
    >
      Cerrar sesión
    </button>
  );
}
