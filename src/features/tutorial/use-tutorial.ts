'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { START_PAGE_GUIDE_EVENT, START_TUTORIAL_EVENT, hasSeenTutorial, markTutorialSeen } from '@/features/tutorial/tutorial-storage';
import type { TutorialStep } from '@/features/tutorial/tutorial-steps';

/** `idle`: nada a la vista; `invite`: se ofrece el tutorial; `tour`: se está recorriendo. */
export type TutorialPhase = 'idle' | 'invite' | 'tour';

/**
 * Lógica del tutorial, sin diseño. A quien entra por primera vez (en este navegador) se le ofrece el recorrido
 * general; si acepta recorre los pasos, y si lo omite o lo termina no vuelve a salir solo. También se puede
 * empezar a pedido: el recorrido general con `START_TUTORIAL_EVENT` («Ver el tutorial» en Mi cuenta) y la guía de la
 * pantalla actual con `START_PAGE_GUIDE_EVENT` (`resolvePageGuide` devuelve sus pasos; sin guía se cae al general).
 */
export function useTutorial({
  userId,
  steps: generalSteps,
  resolvePageGuide,
}: {
  readonly userId: string;
  readonly steps: readonly TutorialStep[];
  readonly resolvePageGuide?: () => readonly TutorialStep[];
}) {
  // Se decide al montar: en el servidor no hay almacenamiento (queda `idle`), en el navegador sí. El diálogo
  // cerrado se pinta igual en ambos casos, así que la hidratación no se desajusta.
  const [phase, setPhase] = useState<TutorialPhase>(() => (hasSeenTutorial(userId) ? 'idle' : 'invite'));
  const [index, setIndex] = useState(0);
  const [steps, setSteps] = useState<readonly TutorialStep[]>(generalSteps);
  const resolveRef = useRef(resolvePageGuide);
  const generalRef = useRef(generalSteps);

  useEffect(() => {
    resolveRef.current = resolvePageGuide;
    generalRef.current = generalSteps;
  });

  useEffect(() => {
    const start = (next: readonly TutorialStep[]) => {
      setSteps(next);
      setIndex(0);
      setPhase('tour');
    };
    const startGeneral = () => start(generalRef.current);
    const startPage = () => {
      const guide = resolveRef.current?.() ?? [];
      start(guide.length > 0 ? guide : generalRef.current);
    };
    globalThis.addEventListener(START_TUTORIAL_EVENT, startGeneral);
    globalThis.addEventListener(START_PAGE_GUIDE_EVENT, startPage);
    return () => {
      globalThis.removeEventListener(START_TUTORIAL_EVENT, startGeneral);
      globalThis.removeEventListener(START_PAGE_GUIDE_EVENT, startPage);
    };
  }, []);

  const close = useCallback(() => {
    markTutorialSeen(userId);
    setPhase('idle');
  }, [userId]);

  const accept = () => {
    markTutorialSeen(userId);
    setSteps(generalSteps);
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
