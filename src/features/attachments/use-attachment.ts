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
  const [attempt, setAttempt] = useState(0);
  const [feedback, setFeedback] = useState<{ error: string | null; notice: string | null }>({ error: null, notice: null });
  const [isBusy, setIsBusy] = useState(false);
  const setError = (error: string | null) => setFeedback((current) => ({ ...current, error }));
  const setNotice = (notice: string | null) => setFeedback((current) => ({ ...current, notice }));

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

  const run = (operation: () => Promise<unknown>, success: string) => {
    setIsBusy(true);
    setError(null);
    setNotice(null);
    return operation()
      .then(() => getAttachmentUrl(target, id))
      .then((current) => {
        setUrl(current);
        setNotice(success);
      })
      .catch((cause: unknown) => {
        // Un fallo del almacenamiento (red, permiso del bucket) no es un error de la API: mensaje propio.
        setError(isApiRequestError(cause) ? describeAttachmentError(cause) : 'No pudimos subir la imagen. Inténtalo de nuevo.');
      })
      .finally(() => setIsBusy(false));
  };

  const chooseFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || isBusy) return;
    const problem = validateImageFile(file);
    setNotice(null);
    setError(problem);
    if (problem === null) await run(() => uploadAttachment(target, id, file), 'Imagen guardada.');
  };

  const remove = () => (isBusy ? Promise.resolve() : run(() => removeAttachment(target, id), 'Imagen quitada.'));

  return { status, url, isBusy, error: feedback.error, notice: feedback.notice, chooseFile, remove, retry };
}
