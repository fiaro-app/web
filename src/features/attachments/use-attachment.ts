'use client';

import { useEffect, useState, type ChangeEvent } from 'react';
import { getAttachmentUrl, removeAttachment, uploadAttachment } from '@/features/attachments/attachments-api';
import type { AttachmentTarget } from '@/features/attachments/endpoints';
import { validateImageFile } from '@/features/attachments/image-file';
import { describeAuthError } from '@/features/auth/error-messages';
import { isApiRequestError } from '@/lib/api';

type Status = 'loading' | 'ready' | 'error';

function describeAttachmentError(error: unknown): string {
  if (isApiRequestError(error) && error.hasCode('FORBIDDEN')) return 'No tienes permiso para cambiar esta imagen.';
  return describeAuthError(error).message;
}

/**
 * Lógica de una imagen privada: la trae con su URL firmada, y permite subir una nueva (la valida,
 * la sube directo al almacenamiento y la guarda) o quitarla. Sin diseño.
 */
export function useAttachment(target: AttachmentTarget, id: string) {
  const [status, setStatus] = useState<Status>('loading');
  const [url, setUrl] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getAttachmentUrl(target, id)
      .then((current) => {
        if (cancelled) return;
        setUrl(current);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [target, id, attempt]);

  const retry = () => {
    setStatus('loading');
    setAttempt((count) => count + 1);
  };

  const run = async (operation: () => Promise<unknown>, success: string) => {
    setIsBusy(true);
    setError(null);
    setNotice(null);
    try {
      await operation();
      setUrl(await getAttachmentUrl(target, id));
      setNotice(success);
    } catch (error_) {
      // Un fallo del almacenamiento (red, permiso del bucket) no es un error de la API: mensaje propio.
      setError(isApiRequestError(error_) ? describeAttachmentError(error_) : 'No pudimos subir la imagen. Inténtalo de nuevo.');
    }
    setIsBusy(false);
  };

  const chooseFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    input.value = '';
    if (!file || isBusy) return;
    const problem = validateImageFile(file);
    if (problem) {
      setNotice(null);
      setError(problem);
      return;
    }
    await run(() => uploadAttachment(target, id, file), 'Imagen guardada.');
  };

  const remove = () => (isBusy ? Promise.resolve() : run(() => removeAttachment(target, id), 'Imagen quitada.'));

  return { status, url, isBusy, error, notice, chooseFile, remove, retry };
}
