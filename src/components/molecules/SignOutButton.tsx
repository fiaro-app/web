'use client';

import { useState } from 'react';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { COMMON_TEXT } from '@/content/common';
import { useSignOut } from '@/features/auth/use-sign-out';

/** "Cerrar sesión" en rojo, como en el perfil de la barra lateral; pide confirmar antes de salir. Solo diseño: la lógica vive en `useSignOut`. */
export function SignOutButton() {
  const { isSigningOut, signOut } = useSignOut();
  const [confirming, setConfirming] = useState(false);
  const text = COMMON_TEXT.signOut;

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        disabled={isSigningOut}
        className="self-start rounded-sm text-small font-semibold text-destructive hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
      >
        Cerrar sesión
      </button>
      <ConfirmDialog
        open={confirming}
        title={text.title}
        description={text.description}
        confirmLabel={text.confirmLabel}
        loading={isSigningOut}
        onCancel={() => setConfirming(false)}
        onConfirm={() => void signOut()}
      />
    </>
  );
}
