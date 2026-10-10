'use client';

import { useCallback, useEffect, useState } from 'react';
import { START_TUTORIAL_EVENT, hasSeenTutorial, markTutorialSeen } from '@/features/tutorial/tutorial-storage';
import type { TutorialStep } from '@/features/tutorial/tutorial-steps';

/** `idle`: nada a la vista; `invite`: se ofrece el tutorial; `tour`: se está recorriendo. */
export type TutorialPhase = 'idle' | 'invite' | 'tour';

/**
 * Lógica del tutorial de bienvenida, sin diseño. A quien entra por primera vez (en este navegador) se le
 * ofrece; si acepta recorre los pasos, y si lo omite o lo termina no vuelve a salir solo. También se puede
 * empezar a pedido con el evento `START_TUTORIAL_EVENT` («Ver el tutorial» en Mi cuenta).
 */
export function useTutorial({ userId, steps }: { readonly userId: string; readonly steps: readonly TutorialStep[] }) {
  // Se decide al montar: en el servidor no hay almacenamiento (queda `idle`), en el navegador sí. El diálogo
  // cerrado se pinta igual en ambos casos, así que la hidratación no se desajusta.
  const [phase, setPhase] = useState<TutorialPhase>(() => (hasSeenTutorial(userId) ? 'idle' : 'invite'));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const start = () => {
      setIndex(0);
      setPhase('tour');
    };
    window.addEventListener(START_TUTORIAL_EVENT, start);
    return () => window.removeEventListener(START_TUTORIAL_EVENT, start);
  }, []);

  const close = useCallback(() => {
    markTutorialSeen(userId);
    setPhase('idle');
  }, [userId]);

  const accept = () => {
    markTutorialSeen(userId);
    setIndex(0);
    setPhase('tour');
  };

  const next = () => {
    if (index >= steps.length - 1) close();
    else setIndex(index + 1);
  };
  const previous = () => setIndex((current) => Math.max(0, current - 1));

  return {
    phase,
    step: steps[Math.min(index, steps.length - 1)],
    index,
    total: steps.length,
    isFirst: index === 0,
    isLast: index >= steps.length - 1,
    accept,
    decline: close,
    finish: close,
    next,
    previous,
  };
}
