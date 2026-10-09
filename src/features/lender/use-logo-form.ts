'use client';

import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent } from 'react';
import { describeSettingsError } from '@/features/lender/error-messages';
import { saveLogoUrl, uploadLogoFile } from '@/features/lender/lender-api';
import { validateLogoFile } from '@/features/lender/logo-file';
import { isApiRequestError } from '@/lib/api';

/**
 * Lógica del logo del negocio: elegir un archivo lo valida, lo sube directo al almacenamiento y
 * guarda su URL; «quitar» borra la URL. Sin diseño.
 */
export function useLogoForm() {
  const router = useRouter();
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const run = async (operation: () => Promise<unknown>, success: string) => {
    setIsBusy(true);
    setError(null);
    setNotice(null);
    try {
      await operation();
    } catch (failure) {
      // Un fallo del almacenamiento (red, permiso del bucket) no es un error de la API: mensaje propio.
      setError(isApiRequestError(failure) ? describeSettingsError(failure).message : 'No pudimos subir el logo. Inténtalo de nuevo.');
      setIsBusy(false);
      return;
    }
    setNotice(success);
    setIsBusy(false);
    router.refresh();
  };

  const chooseFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    input.value = '';
    if (!file || isBusy) return;
    const problem = validateLogoFile(file);
    if (problem) {
      setNotice(null);
      setError(problem);
      return;
    }
    await run(async () => saveLogoUrl(await uploadLogoFile(file)), 'Logo actualizado.');
  };

  const removeLogo = () => (isBusy ? Promise.resolve() : run(() => saveLogoUrl(null), 'Logo quitado.'));

  return { isBusy, error, notice, chooseFile, removeLogo };
}
