'use client';

import { TextButton } from '@/components/atoms/TextButton';
import { useSignOut } from '@/features/auth/use-sign-out';

/** Botón "Cerrar sesión". Solo diseño: la lógica vive en `useSignOut`. */
export function SignOutButton() {
  const { isSigningOut, signOut } = useSignOut();

  return (
    <TextButton onClick={signOut} disabled={isSigningOut}>
      Cerrar sesión
    </TextButton>
  );
}
