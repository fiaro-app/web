'use client';

import { useEffect, useState } from 'react';
import { fetchCheckoutStatus } from '@/features/subscription/checkout-api';
import type { CheckoutStatus } from '@/features/subscription/checkout-endpoints';
import { isApiRequestError } from '@/lib/api';

/** Cada cuántos milisegundos se vuelve a preguntar mientras Wompi no avise. */
export const POLL_INTERVAL_MS = 3000;
/** Cuántas veces se pregunta antes de decir «sigue en proceso» (≈ 2 minutos). */
export const MAX_POLLS = 40;

/** En qué punto está la espera de la confirmación. */
export type CheckoutWait =
  | { readonly kind: 'checking' }
  | { readonly kind: 'resolved'; readonly status: CheckoutStatus }
  | { readonly kind: 'slow' }
  | { readonly kind: 'not-found' };

/**
 * Pregunta cada pocos segundos en qué quedó la orden hasta que deje de estar pendiente. La
 * redirección de Wompi no prueba nada: quien confirma es su aviso a la API, así que aquí solo se
 * espera a que el estado cambie. Un error pasajero (red) no corta la espera.
 *
 * @param reference - La referencia de la orden (viene en la ruta).
 */
export function useCheckoutStatus(reference: string): CheckoutWait {
  const [wait, setWait] = useState<CheckoutWait>({ kind: 'checking' });

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let polls = 0;

    const poll = async () => {
      polls += 1;
      try {
        const status = await fetchCheckoutStatus(reference, controller.signal);
        if (status.status !== 'PENDING') {
          setWait({ kind: 'resolved', status });
          return;
        }
      } catch (failure) {
        if (controller.signal.aborted) return;
        if (isApiRequestError(failure) && failure.hasCode('NOT_FOUND')) {
          setWait({ kind: 'not-found' });
          return;
        }
      }
      if (polls >= MAX_POLLS) {
        setWait({ kind: 'slow' });
        return;
      }
      timer = setTimeout(() => void poll(), POLL_INTERVAL_MS);
    };

    void poll();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [reference]);

  return wait;
}
