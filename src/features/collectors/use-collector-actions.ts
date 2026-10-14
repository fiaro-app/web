'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  changeCollectorPortfolio,
  deactivateCollector,
  deleteCollector,
  reactivateCollector,
  resetCollectorPassword,
} from '@/features/collectors/collectors-api';
import { describeCollectorError } from '@/features/collectors/error-messages';
import type { CollectorHandover } from '@/features/collectors/get-collector-handover.server';
import type { CollectorDetail } from '@/features/collectors/get-collector.server';
import { isApiRequestError } from '@/lib/api';

/** Envuelve un error de la baja para explicarlo con sus propios mensajes (los códigos significan otra cosa aquí). */
class DeactivationError extends Error {
  constructor(readonly cause: unknown) {
    super('deactivation failed');
  }
}

/** Mensaje de un error al dar de baja a un cobrador. */
function describeDeactivationError(error: unknown): string {
  if (isApiRequestError(error)) {
    if (error.hasCode('CONFLICT')) return 'Este cobrador tiene asignaciones programadas para después de hoy. Reasígnalas antes de darlo de baja.';
    if (error.hasCode('VALIDATION_FAILED')) return 'Sus préstamos cambiaron mientras tanto. Recarga la página e inténtalo de nuevo.';
  }
  return describeCollectorError(error).message;
}

/** Acción en curso o confirmada: solo una a la vez. */
export type CollectorAction = 'portfolio' | 'deactivate' | 'reset-password' | 'reactivate' | 'remove';

/**
 * Lógica de gestionar un cobrador (cambiar cartera, restablecer contraseña, desactivar, reactivar y borrar), sin
 * diseño. Cada acción reporta su error en `error` y, si sale bien, refresca la página para traer
 * el estado nuevo; la contraseña temporal queda en `tempPassword` y se muestra una sola vez.
 */
export function useCollectorActions(collector: Pick<CollectorDetail, 'id' | 'roles' | 'portfolioId'>, handover: CollectorHandover | null = null) {
  const router = useRouter();
  const [pending, setPending] = useState<CollectorAction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [portfolioId, setPortfolioId] = useState(collector.portfolioId ?? '');
  const [notice, setNotice] = useState<string | null>(null);

  const run = async (action: CollectorAction, operation: () => Promise<void>, success?: string) => {
    if (pending) return;
    setPending(action);
    setError(null);
    setNotice(null);
    try {
      await operation();
      if (success) setNotice(success);
      router.refresh();
    } catch (failure) {
      setError(failure instanceof DeactivationError ? describeDeactivationError(failure.cause) : describeCollectorError(failure).message);
    } finally {
      setPending(null);
    }
  };

  const savePortfolio = () => {
    if (portfolioId === '') {
      setError('Elige la cartera del cobrador.');
      return Promise.resolve();
    }
    return run(
      'portfolio',
      async () => {
        await changeCollectorPortfolio(collector.id, collector.roles, portfolioId);
      },
      'Cartera actualizada.',
    );
  };

  const resetPassword = () =>
    run('reset-password', async () => {
      const result = await resetCollectorPassword(collector.id);
      setTempPassword(result.tempPassword);
    });

  /** Da de baja al cobrador pasando todos sus préstamos activos al cobrador elegido. */
  const deactivate = (destinationId: string) =>
    run(
      'deactivate',
      async () => {
        const reassignments = (handover?.loans ?? []).map((loan) => ({ loanId: loan.id, collectorMembershipId: destinationId }));
        try {
          await deactivateCollector(collector.id, reassignments);
        } catch (failure) {
          throw new DeactivationError(failure);
        }
      },
      'Cobrador desactivado.',
    );

  /** Le devuelve el acceso a un cobrador dado de baja (ocupa un cupo del plan). */
  const reactivate = () =>
    run(
      'reactivate',
      async () => {
        await reactivateCollector(collector.id);
      },
      'Cobrador reactivado.',
    );

  /** Borra a un cobrador registrado por error y vuelve a la lista; con historial, la API lo rechaza. */
  const remove = () =>
    run('remove', async () => {
      await deleteCollector(collector.id);
      router.push('/cobradores');
    });

  return { pending, error, notice, tempPassword, portfolioId, setPortfolioId, savePortfolio, resetPassword, deactivate, reactivate, remove };
}
